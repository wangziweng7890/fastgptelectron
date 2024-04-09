<script setup lang="ts">
import { customAlphabet } from 'nanoid'
import { Base64 } from 'js-base64'
import { ElMessage, ElScrollbar } from 'element-plus'
import dayjs from 'dayjs'
import { adaptChat2GptMessages, md } from '../utils'
import newChatIcon from '../img/new-button.png'
import historyIcon from '../img/history-button.png'
import sendIcon from '../img/send.png'
import notSendIcon from '../img/send-disabled.png'
import copyIcon from '../img/copy.png'
import copyActiveIcon from '../img/copy-active.png'
import deleteIcon from '../img/delete.png'
import deleteActiveIcon from '../img/delete-active.png'
import zanIcon from '../img/zan.png'
import zanActiveIcon from '../img/zan-active.png'
import zanSelectIcon from '../img/zan-Select.png'
import caiIcon from '../img/cai.png'
import caiActiveIcon from '../img/cai-active.png'
import caiSelectIcon from '../img/cai-select.png'
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
import { copy } from '~/utils'
import router from '~/router'
import { useDialog } from '@/hooks/dialog'
import { useMessage } from '@/hooks/message'
import {
  GetFrontChatCompletionsDelete,
  GetFrontChatCompletionsGuess,
  GetFrontChatCompletionsList,
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
  avatar: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['refresh'])

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

function copyChat(content, dataId, type) {
  const res = copy(content.replace(/<[^>]+>|&[^>]+;/g, '').trim())
  res && copyMsg()

  type === 'AI'
        && PostFrontChatstepStep({
          type: 3,
          chatDetailId: dataId,
        })
  updatePoint(dataId)
}
const { deleteDialog } = useDialog()
function deleteChat(tempId) {
  deleteDialog({
    async onOk() {
      await GetFrontChatCompletionsDelete({
        id: tempId,
      })
      deleteMsg()
      setChatHistory(
        chatHistory.value.filter(item => item.dataId !== tempId),
      )
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

const showCopyActive = ref(false)
const showDeleteActive = ref(false)
const showZanActive = ref(false)
const showCaiActive = ref(false)
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

// 猜你想问
const guessList = ref([])

const chatController = ref(new AbortController())
async function onSend(flag?) {
  const val = messageContent.value
  if (flag !== 'reload' && (val.trim() === '' || isWaitting.value || isChatting.value))
    return

  guessList.value = []
  handStop.value = false
  const dataId = nanoid()
  const newChatList = [
    ...chatHistory.value,
  ]
  if (flag === 'reload') {
    newChatList[newChatList.length - 1].status = 'loading'
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
    updatePoint(dataId)
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
    GetFrontChatCompletionsGuess({
      message: val,
    }).then((data) => {
      guessList.value = data?.split(',').filter(i => !!i) || []
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
  //   isWaitting.value = false
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
async function caiConfirm(flag) {
  showFeedBack.value = false
  try {
    if (isLoading.value)
      return
    isLoading.value = true
    await PostFrontChatstepStep({
      type: 2,
      treadType: treadType.value,
      chatDetailId: tempId,
      reason: flag === 0 ? feedContent.value : '',
    })
    ElMessage.success('反馈成功')
  }
  finally {
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
  showFeedBack.value = true
}
function changeChatId(chatId) {
  chatController.value?.abort('leave')
  //   chatHistory.value = []
  guessList.value = []
  handStop.value = false
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
  chatController?.abort('stop')
}

function reSend() {
  onSend('reload')
}

function jumpToSousou() {
  router.push({
    path: '/search',
  })
}
</script>

<template>
  <div class="chat-container flex flex-col overflow-hidden h-100% pt-12px">
    <ElScrollbar ref="scrollbarRef" style="flex: 1" class="overflow-hidden">
      <section
        id="ChatBoxRef"
        ref="ChatBoxRef"
        class="flex-1 pl-16px pr-16px flex flex-col"
      >
        <div class="flex  max-w-80%">
          <Avatar class="w-28px h-28px mt-10px mr-8px" />
          <div class="chat-box chat-bot mt-10px p-12px">
            <div class="title">
              {{ introduceObj.title }}
            </div>
            <div v-if="introduceObj.info" class="desc">
              {{ introduceObj.info }}>
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
                    <img
                      :src="showWaitActive ? waitHoverIcon : waitIcon"
                      class="w-14px h-14px mr-4px"
                    >
                    重新生成
                  </div>
                </div>
                <div
                  v-if="
                    isChatting
                      && !isWaitting
                      && index === chatHistory.length - 1
                  "
                  class="absolute left-0 top--33px cursor-pointer"
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
                      <div v-show="index === chatHistory.length - 1 && handStop" class="text-size-10px color-#999">
                        对话已停止
                      </div>
                      <div v-if="item.obj !== 'Human'" class="flex mt-10px">
                        <div class="flex">
                          <img
                            :src="
                              !showCopyActive
                                ? copyIcon
                                : copyActiveIcon
                            "
                            class="opr-icon"
                            @mouseover="showCopyActive = true"
                            @mouseout="showCopyActive = false"
                            @click="
                              copyChat(
                                item.value,
                                item.dataId,
                                item.obj,
                              )
                            "
                          >
                          <img
                            :src="
                              !showDeleteActive
                                ? deleteIcon
                                : deleteActiveIcon
                            "
                            class="opr-icon ml-2px"
                            @mouseover="showDeleteActive = true"
                            @mouseout="showDeleteActive = false"
                            @click="deleteChat(item.dataId)"
                          >
                        </div>
                        <div class="flex ml-auto">
                          <img
                            v-if="
                              item.obj !== 'Human'
                                && item.stepType !== 2
                            "
                            :src="
                              showZanActive
                                ? zanActiveIcon
                                : item.stepType === 1
                                  ? zanSelectIcon
                                  : zanIcon
                            "
                            class="opr-icon"
                            @mouseover="showZanActive = true"
                            @mouseout="showZanActive = false"
                            @click="
                              zanChat(
                                item.dataId,
                                item.stepType === 1,
                              )
                            "
                          >
                          <img
                            v-if="
                              item.obj !== 'Human'
                                && item.stepType !== 1
                            "
                            :src="
                              showCaiActive
                                ? caiActiveIcon
                                : item.stepType === 2
                                  ? caiSelectIcon
                                  : caiIcon
                            "
                            class="opr-icon ml-2px"
                            @mouseover="showCaiActive = true"
                            @mouseout="showCaiActive = false"
                            @click="
                              caiChat(
                                item.dataId,
                                item.stepType === 2,
                              )
                            "
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <template v-if="!isChatting && !isWaitting && item.obj === 'Human'" #content>
                    <div class="space-x-6px flex">
                      <img
                        :src="
                          !showCopyActive
                            ? copyIcon
                            : copyActiveIcon
                        "
                        class="opr-icon"
                        @mouseover="showCopyActive = true"
                        @mouseout="showCopyActive = false"
                        @click="
                          copyChat(
                            item.value,
                            item.dataId,
                            item.obj,
                          )
                        "
                      >
                      <img
                        :src="
                          !showDeleteActive
                            ? deleteIcon
                            : deleteActiveIcon
                        "
                        class="opr-icon"
                        @mouseover="showDeleteActive = true"
                        @mouseout="showDeleteActive = false"
                        @click="deleteChat(item.dataId)"
                      >
                    </div>
                  </template>
                </el-tooltip>
              </div>
              <div v-show="index === chatHistory.length - 1 && guessList.length" class="mt--8px flex mb-18px">
                <div v-for="item in guessList" :key="item" class="more-item mr-8px cursor-pointer" @click="fastSend(item)">
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
          :src="newChatIcon"
          @click="newChat"
        >
          新起会话
        </YhButton>
        <YhButton type="b" :src="historyIcon" @click="openHistory">
          历史会话
        </YhButton>
        <YhButton
          class="ml-auto"
          type="c"
          :src="searchIcon"
          @click="jumpToSousou"
        >
          藏经阁
        </YhButton>
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
          v-if="!isChatting"
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
    <HistoryDialog v-model="showHistory" :app-id="appId" :avatar="avatar" :chat-id="route.query.chatId as string" @changeChatId="changeChatId" />

    <Dialog v-model="showFeedBack" width="400px" class="my-dialogxxx" @close="caiConfirm(1)">
      <template #header>
        会话反馈
      </template>
      <div>
        <p class="color-[#222] mb-12px">
          如果给您带来了困扰，先跟您道个歉(鞠躬)
        </p>
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
          :autosize="{ minRows: 8, maxRows: 20 }"
          placeholder="可以展开说说，您觉得不满意的地方"
        />
        <p class="color-[#222]">
          谢谢你！
        </p>
        <p class="color-[#222] mb-12px">
          伊娃会继续努力，不断改进的(っ╥╯﹏╰╥c)
        </p>
        <div class="text-center">
          <el-button
            color="#87DFFF"
            class="w-88px"
            size="large"
            :loading="isLoading"
            @click="caiConfirm(0)"
          >
            提交
          </el-button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style lang="scss">
@import "../chat.scss";
.my-dialog {
    background: linear-gradient( 90deg, #75C8FF 0%, #4396FF 100%), linear-gradient( 184deg, rgba(255,255,255,0) 0%, #FFFFFF 69%);
        border-radius: 8px 8px 8px 8px;
    .el-dialog__header {
        border-bottom: none;
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
    border: 1px solid #677587;
    height: 22px;
    line-height: 22px;
    padding: 0 6px;
    font-size: 12px;
    color: #677587;
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
    width: 20px;
    height: 20px;
    cursor: pointer;
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
            background: #ffffff;
            border: 1px solid;
            border-image: linear-gradient(
                    92deg,
                    rgba(191, 128, 255, 1),
                    rgba(131, 226, 255, 1)
                )
                1 1;
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
        }

        // &:hover {
        //     box-shadow: 0px 0px 4px 0px #d1d1d1;
        //     background: #ffffff;
        // }

        &.pending {
            border: 1px solid transparent !important;
            background: #fff;
            background-image: linear-gradient(white, white),
            linear-gradient(
              to right,
              rgba(131, 226, 255, 1),
              rgba(191, 128, 255, 1)
            );
            background-origin: border-box; /* 渐变背景仅在边框区域 */
            background-clip: padding-box, border-box; /* 上层背景裁剪        到内容区，下层背景裁剪到边框区 */
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
</style>
