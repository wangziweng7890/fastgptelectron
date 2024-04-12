<script setup lang="ts">
import { customAlphabet } from 'nanoid'
import { Base64 } from 'js-base64'
import { ElMessage, ElScrollbar } from 'element-plus'
import dayjs from 'dayjs'
import { adaptChat2GptMessages, md } from '../utils'
// import newChatIcon from '../img/new-button.png'
// import historyIcon from '../img/history-button.png'
import geIcon from '../img/ge.svg?component'
import zanIcon from '../img/zan.svg?component'
import caiIcon from '../img/cai.svg?component'
import copyIcon from '../img/copy.svg?component'
import deleteIcon from '../img/delete.svg?component'
import sendIcon from '../img/send.png'
import notSendIcon from '../img/send-disabled.png'
import waitIcon from '../img/wait.png'
import waitHoverIcon from '../img/wait-hover.png'
import searchIcon from '../img/search.png'
import { appId } from '../config'
import tip1 from '../img/tip1.png'
import tip2 from '../img/tip2.png'
import tip3 from '../img/tip3.png'
import tip4 from '../img/tip4.png'
import Avatar from './Avatar.vue'
import HistoryDialog from './HistoryDialog/index.vue'
import historyIcon from '@/assets/logo/history.svg?component'
import newChatIcon from '@/assets/logo/new.svg?component'
import { copy } from '~/utils'
import router from '~/router'
import { useDialog } from '@/hooks/dialog'
import { useMessage } from '@/hooks/message'
import {
  GetFrontChatCompletionsDelete,
  GetFrontChatCompletionsGuess,
  GetFrontChatCompletionsList,
  GetFrontChatCompletionsStop,
  GetFrontChatstepStepcancel,
  PostFrontChatstepStep,
} from '@/services/apifox/zhiNengKeFu/cHAT/apifox'
const props = defineProps({
  onStartChat: {
    type: Function,
  },
  isNewChat: {
    type: Boolean,
  },
  intro: {
    type: String,
  },
})
const emit = defineEmits(['refresh'])
// 猜你想问
const guessList = ref([])
const route = useRoute()

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 24)
const messageContent = ref('')
const chatHistory = ref<any>([])
const { deleteMsg, likeMsg, copyMsg } = useMessage()
const handStop = ref(false)
async function zanChat(dataId, isCancel) {
  if (isCancel) {
    await GetFrontChatstepStepcancel({
      chatDetailId: dataId,
    })
  }
  else {
    await PostFrontChatstepStep({
      type: 1,
      chatDetailId: dataId,
    })
  }
  updatePoint(dataId)
  setChatHistory(
    chatHistory.value.map((item) => {
      return {
        ...item,
        stepType:
                    dataId === item.dataId ? (isCancel ? 0 : 1) : item.stepType,
      }
    }),
  )
  !isCancel && likeMsg()
}

async function copyChat(content, dataId, type) {
  const res = copy(content.replace(/<[^>]+>|&[^>]+;/g, '').trim())
  res && copyMsg()

  if (type === 'AI') {
    await PostFrontChatstepStep({
      type: 3,
      chatDetailId: dataId,
    })
  }

  updatePoint(dataId)
}
const { deleteDialog } = useDialog()
function deleteChat(tempId, isLast = false) {
  deleteDialog({
    async onOk() {
      await GetFrontChatCompletionsDelete({
        id: tempId,
      })
      deleteMsg()
      setChatHistory(
        chatHistory.value.filter(item => item.dataId !== tempId),
      )
      isLast && (guessList.value = [])
    },
  })
}
let tempId = ''

const isLoading = ref(false)

function updatePoint(dataId) {
  emit('refresh', {
    dataId,
  })
}

const showWaitActive = ref(false)

// 转义对话内容
function onEscapeContent(content, type) {
  if (type === 'question') {
    return content
    // return content
    //   .replace(/&/g, '&amp;')
    //   .replace(/</g, '&lt;')
    //   .replace(/>/g, '&gt;')
    //   .replace(/"/g, '&quot;')
    //   .replace(/'/g, '&#39;')
    //   .replace(/\n/g, '<br>')
  }
  return Base64.decode(Base64.encode(content))
}

async function onEnter(e) {
  if (!e.shiftKey && e.keyCode === 13) {
    e.cancelBubble = true
    e.stopPropagation()
    e.preventDefault()
    onSend()
  }
}

const isChatting = computed<boolean>(() => {
  const list = chatHistory.value
  return list[list.length - 1] && list[list.length - 1]?.status !== 'finish'
})
const isWaitting = ref(false)
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
function scrollToBottom(flag = 0) {
  if (!scrollbarRef.value)
    return

  if (flag) {
    const isBottom
            = scrollbarRef.value.wrapRef!.scrollTop
                + scrollbarRef.value.wrapRef!.clientHeight
                + 150
            >= scrollbarRef.value.wrapRef!.scrollHeight
    isBottom
            && scrollbarRef.value.setScrollTop(
                scrollbarRef.value.wrapRef!.scrollHeight,
            )
  }
  else {
        scrollbarRef.value!.setScrollTop(
            scrollbarRef.value!.wrapRef!.scrollHeight,
        )
  }
}

const chatController = ref(new AbortController())
async function onSend(flag?) {
  let val = messageContent.value
  if (flag !== 'reload' && (val.trim() === '' || isWaitting.value || isChatting.value))
    return

  guessList.value = []
  handStop.value = false
  const dataId = nanoid()
  const newChatList = [
    ...chatHistory.value,
  ]
  if (flag === 'reload') {
    val = newChatList[newChatList.length - 2].value
    newChatList[newChatList.length - 1].status = 'loading'
    newChatList[newChatList.length - 1].statusTemp = 0
    newChatList[newChatList.length - 1].value = ''
  }
  else {
    newChatList.push(...[{
      dataId: nanoid(),
      obj: 'Human',
      value: val,
      status: 'finish',
    },
    {
      dataId,
      obj: 'AI',
      value: '',
      status: 'loading',
    }])
  }
  setChatHistory(newChatList)
  messageContent.value = ''
  isWaitting.value = true
  setTimeout(() => {
    scrollToBottom()
  }, 100)

  try {
    const abortSignal = new AbortController()
    chatController.value = abortSignal

    const messages = adaptChat2GptMessages({
      messages: newChatList,
      reserveId: true,
    })

    let temp = ''
    GetFrontChatCompletionsGuess({
      message: val,
    }).then((data) => {
      temp = data
    })

    await props.onStartChat({
      chatList: newChatList.map(item => ({
        dataId: item.dataId,
        obj: item.obj,
        value: item.value,
        status: item.status,
        moduleName: item.moduleName,
      })),
      messages,
      controller: abortSignal,
      generatingMessage,
      variables: {},
    })
    setTimeout(() => {
      updatePoint(dataId)
    }, 1000)
    setChatHistory(
      chatHistory.value.map((item, index) => {
        if (index !== chatHistory.value.length - 1)
          return item
        return {
          ...item,
          status: 'finish',
        }
      }),
    )

    guessList.value = temp?.split(',').filter(i => !!i) || []
    nextTick(() => {
      scrollToBottom()
    })
  }
  catch (err) {
    isWaitting.value = false
    ElMessage.error(err)
    if (!err?.responseText) {
      messageContent.value = val
      setChatHistory(newChatList.slice(0, newChatList.length - 2))
    }
    setChatHistory(
      chatHistory.value.map((item, index) => {
        if (index !== chatHistory.value.length - 1)
          return item
        return {
          ...item,
          status: 'finish',
        }
      }),
    )
  }
  finally {
    isWaitting.value = false
  }
}

async function getChatList() {
  const data = await GetFrontChatCompletionsList({
    chatId: route.query.chatId as string,
  })
  setChatHistory(
    data.map((item) => {
      return {
        ...item,
        dataId: item.id,
        obj: item.role === 'user' ? 'Human' : 'AI',
        statusTemp: item.status,
        status: 'finish',
      }
    }),
  )
}

// page change and abort request
watch(
  () => route.query.chatId,
  async () => {
    if (route.query.chatId && !props.isNewChat) {
      // 获取历史列表
      getChatList()
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
    chatController.value?.abort('leave')
  },
  {
    immediate: true,
  },
)

function setChatHistory(list) {
  chatHistory.value = list
}

function generatingMessage({ text = '', status, name }) {
  isWaitting.value = false
  chatHistory.value = chatHistory.value.map((item, index) => {
    if (index !== chatHistory.value.length - 1)
      return item
    return {
      ...item,
      ...(text
        ? {
          value: item.value + text,
        }
        : {}),
      ...(status && name
        ? {
          status,
          moduleName: name,
        }
        : {}),
    }
  })
  scrollToBottom(1)
}

function newChat() {
  chatController.value?.abort('leave')
  chatHistory.value = []
  isWaitting.value = false
  router.replace({
    path: '/chat',
  })
}

const showHistory = ref(false)
function openHistory() {
  showHistory.value = true
}

const showFeedBack = ref(false)
const feedContent = ref('')
const treadType = ref(null)

function changeTreadType(val) {
  treadType.value = treadType.value === val ? undefined : val
}
async function caiConfirm(flag, dataId) {
  showFeedBack.value = false
  try {
    if (isLoading.value)
      return
    isLoading.value = true
    await PostFrontChatstepStep({
      type: 2,
      treadType: flag === 0 ? treadType.value : undefined,
      chatDetailId: tempId,
      reason: flag === 0 ? feedContent.value : '',
    })
    ElMessage.success('反馈成功')
  }
  finally {
    visible.value[dataId] = false
    isLoading.value = false
  }
  updatePoint(tempId)
}
async function caiChat(dataId, isCancel) {
  if (isCancel) {
    await GetFrontChatstepStepcancel({
      chatDetailId: dataId,
    })
  }
  setChatHistory(
    chatHistory.value.map((item) => {
      return {
        ...item,
        stepType:
                    dataId === item.dataId ? (isCancel ? 0 : 2) : item.stepType,
      }
    }),
  )
  if (isCancel)
    return
  tempId = dataId
  feedContent.value = ''
  treadType.value = ''
  visible.value[dataId] = true
//   showFeedBack.value = true
}
function changeChatId(chatId) {
  chatController.value?.abort('leave')
  //   chatHistory.value = []
  guessList.value = []
  handStop.value = false
  isWaitting.value = false
  router.replace({
    path: '/chat',
    query: { chatId },
  })
  showHistory.value = false
}
let timer
onMounted(() => {
  timer = setInterval(() => {
    if (dayjs().hour() === 4 && route.query.chatId) {
      newChat()
    }
  }, 3000)
})

onUnmounted(() => {
  clearInterval(timer)
})

onActivated(() => {
  handStop.value = false
  scrollToBottom()
})

const introduceObj = computed(() => {
  const arr = props.intro?.split('<br>') || []
  return {
    title: arr[0] || '',
    info: arr[1] || '',
    tips: arr[2]?.match(/\[([^\]]+)\]/g)?.map((val) => {
      return val.replace(/[\[\]]/g, '')
    }) || [],
  }
})

function getTip(index) {
  const i = index % 4
  return [tip1, tip2, tip3, tip4][i]
}

function fastSend(row) {
  messageContent.value = row
  onSend()
}

function stopChat() {
  handStop.value = true
  chatController?.value.abort('stop')
  const list = chatHistory.value
  list.at(-1).statusTemp = 3
  GetFrontChatCompletionsStop({
    id: list.at(-1).dataId,
  })
}

function reSend() {
  onSend('reload')
}

function jumpToSousou() {
  router.push({
    path: '/search',
  })
}

const visible = ref({})
</script>

<template>
  <div class="chat-container flex flex-col overflow-hidden h-100% pt-6px">
    <ElScrollbar ref="scrollbarRef" style="flex: 1" class="overflow-hidden">
      <section
        id="ChatBoxRef"
        ref="ChatBoxRef"
        class="flex-1 pl-16px pr-16px flex flex-col"
      >
        <div class="flex  max-w-80%">
          <Avatar class="w-28px h-28px mt-10px mr-8px" />
          <div class="chat-box chat-bot mt-10px p-12px w-436px">
            <div class="title">
              {{ introduceObj.title }}
            </div>
            <div v-if="introduceObj.info" class="desc">
              {{ introduceObj.info }}
            </div>
            <div v-if="introduceObj.tips.length" class="tips">
              <p class="mb-8px">
                你可以试着问我
              </p>
              <div class="tip-container">
                <div v-for="item, index in introduceObj.tips" :key="item" class="tip-item flex" @click="fastSend(item)">
                  <img :src="getTip(index)" class="w-18px h-18px mt-6px mr-4px ml-10px" alt=""><div class="truncate pr-10px flex-1">
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-for="(item, index) in chatHistory"
          :key="item.dataId"
          class="relative flex max-w-80%"
          :class="
            (item.obj === 'Human'
              ? ' self-end '
              : ' self-start ')
              + (isWaitting && index === chatHistory.length - 1 ? ' pending' : '')
          "
        >
          <div class="flex">
            <Avatar v-if="item.obj !== 'Human'" class="w-28px h-28px mr-8px" />
            <div class="flex flex-col">
              <div
                class="chat-box"
                :class="
                  (item.obj === 'Human'
                    ? ' chat-user '
                    : ' chat-bot ')
                    + (isWaitting && index === chatHistory.length - 1 ? ' pending' : '')
                "
              >
                <div v-if="handStop && index === chatHistory.length - 1" class="absolute left-0 top--33px cursor-pointer">
                  <div
                    class="more-item text-size-10px w-fit-content cursor-pointer"
                    @mouseover="showWaitActive = true"
                    @mouseout="showWaitActive = false"
                    @click="reSend"
                  >
                    <el-icon size="12" class="mr-4px v-middle">
                      <geIcon />
                    </el-icon>
                    <span>重新生成</span>
                  </div>
                </div>
                <div
                  v-if="
                    isChatting
                      && !isWaitting
                      && index === chatHistory.length - 1
                  "
                  class="fixed left-17px bottom-144px cursor-pointer z-9999"
                >
                  <div
                    class="more-item text-size-10px"
                    @mouseover="showWaitActive = true"
                    @mouseout="showWaitActive = false"
                    @click="stopChat"
                  >
                    <img
                      :src="showWaitActive ? waitHoverIcon : waitIcon"
                      class="w-14px h-14px mr-4px"
                    >
                    停止对话
                  </div>
                </div>
                <el-tooltip
                  :show-arrow="false"
                  append-to="#ChatBoxRef"
                  effect="light"
                  :offset="8"
                  :disabled="item.obj !== 'Human'"
                  :placement="
                    item.obj !== 'Human' ? 'top-start' : 'top-end'
                  "
                >
                  <div
                    class="text"
                    :class="
                      isWaitting || isChatting
                        ? 'pointer-events-none'
                        : ''
                    "
                  >
                    <div
                      v-if="
                        isWaitting
                          && index === chatHistory.length - 1
                      "
                      class="self-start"
                    >
                      奋力打字中⸂⸂⸜(രᴗര )⸝⸃⸃ …
                    </div>
                    <div v-else class="flex flex-col">
                      <div
                        v-if="item.obj === 'Human'"
                        class="message-content markdown"
                        v-html="
                          onEscapeContent(item.value, 'question')
                        "
                      />
                      <div
                        v-else
                        class="message-content markdown"
                        v-html="
                          md.render(
                            onEscapeContent(
                              item.value,
                              'answer',
                            ),
                          )
                        "
                      />
                      <div v-show="(item.statusTemp === 3)" class="text-size-10px color-#999">
                        对话已停止
                      </div>
                      <div v-if="item.obj !== 'Human'" class="flex mt-10px">
                        <div class="flex">
                          <el-icon
                            size="20px"
                            class="opr-icon"
                            @click="
                              copyChat(
                                item.value,
                                item.dataId,
                                item.obj,
                              )
                            "
                          >
                            <copyIcon />
                          </el-icon>
                          <el-icon
                            size="20px"
                            class="opr-icon ml-2px"
                            @click="deleteChat(item.dataId, index === chatHistory.length - 1)"
                          >
                            <deleteIcon />
                          </el-icon>
                        </div>
                        <div class="flex ml-auto">
                          <el-icon
                            v-if="
                              item.obj !== 'Human'
                                && item.stepType !== 2
                            "
                            size="20px"
                            class="opr-icon"
                            :class="item.stepType === 1
                              ? 'color-#4C9AFF!'
                              : ''"
                            @click="
                              zanChat(
                                item.dataId,
                                item.stepType === 1,
                              )
                            "
                          >
                            <zanIcon />
                          </el-icon>
                          <el-tooltip :visible="visible[item.dataId]" effect="light" trigger="click" :show-arrow="false" popper-class="self-tips" :disabled="item.stepType !== 2">
                            <template #content>
                              <div class="x" @click="caiConfirm(1, item.dataId)">
                                X
                              </div>
                              <div class="header">
                                您的反馈将
                                <p />
                                帮助伊娃更好地进步!
                              </div>
                              <div class="box">
                                <div class="mb-12px flex">
                                  <div class="mr-16px select-btn" :class="treadType === 1 ? 'active' : ''" @click="changeTreadType(1)">
                                    答非所问
                                  </div>
                                  <div class="select-btn" :class="treadType === 2 ? 'active' : ''" @click="changeTreadType(2)">
                                    内容错误
                                  </div>
                                </div>
                                <el-input
                                  v-model="feedContent"
                                  class="mb-12px"
                                  resize="none"
                                  type="textarea"
                                  show-word-limit
                                  :maxlength="1000"
                                  :autosize="{ minRows: 3, maxRows: 20 }"
                                  placeholder="请输入您的建议..."
                                />
                                <div class="text-center">
                                  <el-button
                                    color="#4C9AFF"
                                    class="w-80px color-#fff!"
                                    :loading="isLoading"
                                    @click="caiConfirm(0, item.dataId)"
                                  >
                                    提交
                                  </el-button>
                                </div>
                              </div>
                            </template>
                            <el-icon
                              v-if="
                                item.obj !== 'Human'
                                  && item.stepType !== 1
                              "
                              size="20px"
                              :class="item.stepType === 2
                                ? 'color-#4C9AFF!'
                                : ''"
                              class="opr-icon ml-2px"
                              @click="
                                caiChat(
                                  item.dataId,
                                  item.stepType === 2,
                                )
                              "
                            >
                              <caiIcon />
                            </el-icon>
                          </el-tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                  <template v-if="!isChatting && !isWaitting && item.obj === 'Human'" #content>
                    <div class="space-x-6px flex">
                      <el-icon
                        size="20px"
                        class="opr-icon"
                        @click="
                          copyChat(
                            item.value,
                            item.dataId,
                            item.obj,
                          )
                        "
                      >
                        <copyIcon />
                      </el-icon>
                      <el-icon
                        size="20px"
                        class="opr-icon"
                        @click="deleteChat(item.dataId)"
                      >
                        <deleteIcon />
                      </el-icon>
                    </div>
                  </template>
                </el-tooltip>
              </div>
              <div v-show="index === chatHistory.length - 1 && guessList.length" class="mt--8px flex mb-18px flex-wrap">
                <div v-for="item in guessList" :key="item" class="more-item mr-8px mb-8px cursor-pointer" @click="fastSend(item)">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ElScrollbar>
    <section class="w-100% bg-#fff">
      <div class="line" />
      <div class="flex mt-8px mb-8px ml-16px pr-16px">
        <YhButton
          class="mr-10px"
          type="a"
          @click="newChat"
        >
          <el-icon size="14" class="mr-2px v-middle">
            <newChatIcon />
          </el-icon><span class="v-middle">新起会话</span>
        </YhButton>
        <YhButton type="b" @click="openHistory">
          <el-icon size="14" class="mr-2px v-middle">
            <historyIcon />
          </el-icon><span class="v-middle">历史会话</span>
        </YhButton>
        <div
          class="ml-auto yh-button2"
          @click="jumpToSousou"
        >
          <img
            class="inline-block w-16px h-16px mr-2px"
            :src="searchIcon"
          ><span class="v-middle">藏经阁</span>
        </div>
      </div>
      <div class="relative input-box">
        <el-input
          v-model="messageContent"
          class="my-input"
          resize="none"
          type="textarea"
          :maxlength="1000"
          :autosize="{ minRows: 1, maxRows: 20 }"
          placeholder="需要什么帮助吗，来问我~"
          @keydown="onEnter"
        />
        <img
          v-if="!isChatting && messageContent.length > 0"
          :src="sendIcon"
          class="absolute cursor-pointer z-3 right-10px bottom-15px w-24px h-24px"
          alt=""
          @click="onSend"
        >
        <img
          v-else
          :src="notSendIcon"
          class="absolute cursor-not-allowed z-3 right-10px bottom-15px w-24px h-24px"
          alt=""
        >
        <div class="absolute color-#a8abb2 right-6px bottom-1px text-10px">
          {{ messageContent.length }}/1000
        </div>
      </div>
      <div class="tip">
        银河AI生成，内容仅供参考
      </div>
    </section>
    <HistoryDialog v-model="showHistory" :app-id="appId" :chat-id="route.query.chatId as string" @changeChatId="changeChatId" @newChat="newChat" />
  </div>
</template>

<style lang="scss">
@import "../chat.scss";
.self-tips.el-popper.is-light {
    width: 204px;
    background: #FFFFFF;
    box-shadow: 0px 0px 10px 0px #CCCCCC;
    border-radius: 8px 8px 8px 8px;
    border: none;
    padding: 0;
    overflow: hidden;
    .header {
        padding: 12px;
        height: 58px;
        background: linear-gradient(90.64deg, rgba(117, 200, 255, 0.2) 0.86%, rgba(67, 150, 255, 0.2) 98.93%), linear-gradient(184.08deg, rgba(255, 255, 255, 0) 3.39%, #FFFFFF 68.06%);
        background-blend-mode: screen;
        font-weight: 500;
        font-size: 16px;
        color: #002046;
        line-height: 19px;
        text-align: justified;
    }
    .box {
        padding: 0 12px 12px 12px;
    }
    .x {
        width: 8px;
        height: 8px;
        right: 13px;
        top: 13px;
        position: absolute;
        cursor: pointer;
    }
}

.select-btn {
    cursor: pointer;
    text-align: center;
    width: 82px;
    height: 24px;
    line-height: 24px;
    background: #EEF5FF;
    font-size: 14px;
    color: #1F497B;
    border-radius: 2px 2px 2px 2px;

    &.active {
        background: #4C9AFF;
        color: #FFFFFF;
    }

    &:hover {
        background: #4C9AFF;
        color: #FFFFFF;
    }
}
.history-box {
    background: #f8f8f8;
    border-radius: 10px 10px 10px 10px;
    cursor: pointer;

    .content {
        font-size: 12px;
        color: #666666;
        line-height: 12px;
        height: 12px;
    }

    .title {
        font-weight: 600;
        font-size: 14px;
        color: #222222;
        line-height: 14px;
        margin-bottom: 12px;
    }

    .time {
        font-weight: 400;
        font-size: 10px;
        color: #8f959e;
        line-height: 12px;
        vertical-align: middle;
    }

    .current {
        background: linear-gradient(136deg, #c07dff 0%, #82e2ff 100%);
        border-radius: 2px 2px 2px 2px;
        font-weight: 400;
        font-size: 10px;
        color: #fffdfd;
        line-height: 14px;
        padding-left: 4px;
        padding-right: 4px;
    }

    .desc {
        font-weight: 400;
        font-size: 12px;
        color: #666666;
        line-height: 12px;
    }

    &.active,
    &:hover {
        background: linear-gradient(
            136deg,
            #def9ff 0%,
            #ffffff 50%,
            #fdf0ff 100%
        );
    }
}

.more-item {
    display: flex;
    align-items: center;
    background: #F6F6F6;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #999;
    height: 22px;
    line-height: 22px;
    padding: 0 6px;
    font-size: 12px;
    color: #999;
    width: fit-content;

    &:hover {
        color: #4C9AFF;
        background: #EEF5FF;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #4C9AFF;
    }
}

.hljs {
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0;
    position: relative;
    overflow-x: scroll;
    .language-name {
        position: absolute;
        top: 9px;
        color: #999;
        right: 43px;
        font-size: 0.8em;
        user-select: none;
    }

    .copy-btn {
        position: absolute;
        right: 8px;
        top: 8px;
        background-color: #525252;
        border: none;
        padding: 2px 5px;
        border-radius: 3px;
        color: #ccc;
        cursor: pointer;
        display: none;
    }
    .copy-textarea {
        position: absolute;
        left: -9999px;
        top: -9999px;
    }
}
.opr-icon {
    color: #ccc;
    width: 20px;
    height: 20px;
    cursor: pointer;
    &:hover {
        color: #4C9AFF
    }
}
.chat-container {
    .tip-icon {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    .input-box {
        margin-left: 16px;
        margin-right: 16px;
        margin-bottom: 12px;
        min-height: 46px;
        background: #f9f9fc;
        border-radius: 6px 6px 6px 6px;
        padding: 12px;
        padding-right: 70px;

        .el-textarea__inner {
            border: none;
            background: transparent;
            box-shadow: none;
        }
    }

    .line {
        height: 0px;
        border-radius: 2px 2px 2px 2px;
        border: 1px solid #f6f6f6;
    }

    .message-content {
        word-break: normal;
        overflow-wrap: break-word;
        display: inline-block;
        max-width: 100%;
        overflow-x: auto;
    }
    .chat-box {
        position: relative;

        .tool-tip {
            position: absolute;
            right: 0;
            top: -20px;
            height: 20px;
            background: #fdfdfd;
            border-radius: 4px 4px 4px 4px;
        }
    }
    .chat-user {
        background: #52a5f2;
        border-radius: 8px 1px 8px 8px;
        margin-bottom: 18px;

        // &:hover {
        //     opacity: 0.6;
        //     box-shadow: 0px 0px 4px 0px #d1d1d1;
        // }

        .pending {
            border: 1px solid #4c9aff;
        }

        .text {
            font-size: 14px;
            color: #ffffff;
            line-height: 21px;
            padding: 8px;
        }
    }
    .chat-bot {
        background: #FFFFFF;
        border-radius: 1px 8px 8px 8px;
        margin-bottom: 18px;

        .title {
            font-weight: 600;
            font-size: 16px;
        }

        .desc {
            font-size: 14px;
            color: #222222;
        }

        .tips {
            margin-top: 10px;
            margin-bottom: 8px;
            font-size: 12px;
            color: #1F497B;
        }

        .tip-container {
            display: grid;
            grid-template-columns: 1fr 1fr; /* 定义两列，每列占用一半的宽度 */
            gap: 8px; /* 可以设置行和列之间的间隙 */
        }

        .tip-item {
            height: 32px;
            line-height: 32px;
            background: #EDF5FF;
            border-radius: 6px 6px 6px 6px;
            cursor: pointer;
            font-size: 14px;
            color: #1F497B;
            //超出省略
            overflow: hidden;
            text-overflow: ellipsis;

            &:hover {
                background: #B7D7FF;
                color: #002046;
            }
        }

        // &:hover {
        //     box-shadow: 0px 0px 4px 0px #d1d1d1;
        //     background: #ffffff;
        // }

        &.pending {
            height: 32px;
            border: 1px solid #4c9aff;

            .text {
                padding-top: 8px;
                padding-bottom: 8px;
                line-height: 14px;
            }
        }
        .text {
            font-size: 14px;
            color: #222222;
            line-height: 21px;
            padding: 12px;
        }
    }

    .tip {
        font-size: 10px;
        color: #a8abb2;
        line-height: 10px;
        margin-bottom: 16px;
        text-align: center;
    }
}

.yh-button2 {
    transition: all cubic-bezier(0.39, 0.575, 0.565, 1);
    cursor: pointer;
    height: 26px;
    background: #F6F9FF;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #D7D7D7;
    padding-left: 6px;
    padding-right: 8px;

    font-size: 14px;
    color: #666;
    line-height: 12px;

    line-height: 22px;
    text-align: left;

    &:hover {
        background: #F6F9FF;
        color: #4C9AFF;
        border: 1px solid #4C9AFF;
    }
}
</style>
