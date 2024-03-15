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
import caiIcon from '../img/cai.png'
import caiActiveIcon from '../img/cai-active.png'
import stopIcon from '../img/stop.png'
import { appId } from '../config'
import YhButton from './YhButton.vue'
import { copy } from '~/utils'
import router from '~/router'
import {
  GetFrontChatCompletionsDelete,
  GetFrontChatCompletionsDeleteByChatId,
  GetFrontChatCompletionsHistory,
  GetFrontChatCompletionsList,
  GetFrontChatstepStep,
  GetFrontChatstepStepcancel,
} from '@/services/apifox/zhiNengKeFu/cHAT/apifox'
const props = defineProps({
  onStartChat: {
    type: Function,
  },
  isNewChat: {
    type: Boolean,
  },
})

const emit = defineEmits(['refresh'])

const route = useRoute()

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 24)
const messageContent = ref('')

async function zanChat(dataId, isCancel) {
  if (isCancel) {
    await GetFrontChatstepStepcancel({
      chatDetailId: dataId,
    })
  }
  else {
    await GetFrontChatstepStep({
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
  !isCancel && ElMessage.success('点赞完成，你成功引起了我的注意')
}

function copyChat(content, dataId) {
  const res = copy(content.replace(/<[^>]+>|&[^>]+;/g, '').trim())
  res && ElMessage.success('复制成功，感觉自己像个魔术师')
  updatePoint(dataId)
}

const showDelete = ref(false)
let tempId = ''
function deleteChat(dataId) {
  tempId = dataId
  showDelete.value = true
}

const isLoading = ref(false)
async function deleteConfirm() {
  if (isLoading.value)
    return
  try {
    await GetFrontChatCompletionsDelete({
      id: tempId,
    })
    ElMessage.success('删得干净，心情美丽')
    showDelete.value = false
    setChatHistory(
      chatHistory.value.filter(item => item.dataId !== tempId),
    )
  }
  finally {
    isLoading.value = false
  }
}

function updatePoint(dataId) {
  emit('refresh', {
    dataId,
  })
}

const showCopyActive = ref(false)
const showDeleteActive = ref(false)
const showZanActive = ref(false)
const showCaiActive = ref(false)

// 转义对话内容
function onEscapeContent(content, type) {
  if (type === 'question') {
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '<br>')
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

const chatHistory = ref<any>([])

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
async function onSend() {
  const val = messageContent.value
  if (val.trim() === '' || isWaitting.value || isChatting.value)
    return

  const dataId = nanoid()
  const newChatList = [
    ...chatHistory.value,
    {
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
    },
  ]
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
  console.log(text, status, name)
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

const pageNumber = ref(1)
const pageSize = 10
const count = ref(0)
const historyList = ref([])
const showHistory = ref(false)

async function fetchList() {
  const { data, totalCount }
        = await GetFrontChatCompletionsHistory({
          appId,
          pageNumber: pageNumber.value,
          pageSize,
        })
  count.value = totalCount
  historyList.value = data
}

function handleCurrentChange(val) {
  pageNumber.value = val
  fetchList()
}
async function openHistory() {
  fetchList()
  showHistory.value = true
}

const showFeedBack = ref(false)
const feedContent = ref('')
async function caiConfirm(flag) {
  showFeedBack.value = false
  try {
    if (isLoading.value)
      return
    isLoading.value = true
    await GetFrontChatstepStep({
      type: 2,
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
    chatHistory.value.map((item, index) => {
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
  showFeedBack.value = true
}

function formateTime(time) {
  const arr = time.split(' ')
  return dayjs().isSame(arr[0], 'day') ? `今天${arr[1]}` : time
}

async function deleteChatList(chatId) {
  await GetFrontChatCompletionsDeleteByChatId({
    chatId,
  })
  pageNumber.value = 1
  fetchList()
}

function changeChatId(chatId) {
  chatController.value?.abort('leave')
  chatHistory.value = []
  router.replace({
    query: { chatId },
  })
}
</script>

<template>
  <div class="chat-container flex flex-col overflow-hidden h-100% pt-12px">
    <ElScrollbar ref="scrollbarRef" style="flex: 1">
      <section
        ref="ChatBoxRef"
        class="flex-1 pl-16px pr-16px flex flex-col"
      >
        <div v-if="chatHistory.length === 0" class="chat-box chat-bot">
          <div class="text" />
          Hi,我是Eva伊娃，你的新同事，初来乍到～作为你的私人助理，想做你的贴心小棉袄~
        </div>
        <div
          v-for="(item, index) in chatHistory"
          :key="item.dataId"
          class="chat-box relative"
          :class="
            item.obj === 'Human'
              ? 'chat-user self-end'
              : 'chat-bot self-start '
          "
        >
          <div
            v-if="
              isChatting
                && !isWaitting
                && index === chatHistory.length - 1
            "
            class="absolute left-0 top--33px cursor-pointer"
          >
            <img
              :src="stopIcon"
              class="tip-icon"
              @click="() => chatController?.abort('stop')"
            >
          </div>
          <el-tooltip
            :show-arrow="false"
            effect="light"
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
              <div v-else class="flex">
                <div
                  v-if="item.obj === 'Human'"
                  class="message-content"
                  v-html="
                    onEscapeContent(item.value, 'question')
                  "
                />
                <div
                  v-else
                  class="message-content"
                  v-html="
                    md.render(
                      onEscapeContent(
                        item.value,
                        'answer',
                      ),
                    )
                  "
                />
              </div>
            </div>
            <template #content>
              <div
                v-if="!isChatting && !isWaitting"
                class="space-x-6px flex"
              >
                <img
                  :src="
                    !showCopyActive
                      ? copyIcon
                      : copyActiveIcon
                  "
                  class="opr-icon"
                  @mouseover="showCopyActive = true"
                  @mouseout="showCopyActive = false"
                  @click="copyChat(item.value, item.dataId)"
                >
                <img
                  v-if="
                    item.obj !== 'Human'
                      && item.stepType !== 2
                  "
                  :src="
                    showZanActive || item.stepType === 1
                      ? zanActiveIcon
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
                    showCaiActive || item.stepType === 2
                      ? caiActiveIcon
                      : caiIcon
                  "
                  class="opr-icon"
                  @mouseover="showCaiActive = true"
                  @mouseout="showCaiActive = false"
                  @click="
                    caiChat(
                      item.dataId,
                      item.stepType === 2,
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
      </section>
    </ElScrollbar>
    <section class="w-100%">
      <div class="line" />
      <div class="flex mt-8px mb-8px ml-16px pr-16px">
        <YhButton
          class="mr-10px"
          type="a"
          :src="newChatIcon"
          @click="newChat"
        >
          新启会话
        </YhButton>
        <YhButton type="b" :src="historyIcon" @click="openHistory">
          历史会话
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
          placeholder="和我说说话嘛～"
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
          class="absolute cursor-not-allowed z-3 right-10px bottom-10px w-24px h-24px"
          alt=""
        >
      </div>
      <div class="tip">
        AI生成 仅供参考
      </div>
    </section>
    <Dialog v-model="showFeedBack" width="400px" @close="caiConfirm(1)">
      <template #header>
        会话反馈
      </template>
      <div>
        <p class="color-[#222] mb-12px">
          如果给您带来了困扰，先跟您道个歉(鞠躬)
        </p>
        <el-input
          v-model="feedContent"
          class="mb-12px"
          resize="none"
          type="textarea"
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
    <Dialog v-model="showHistory" width="450px">
      <template #header>
        历史会话
      </template>
      <div>
        <div
          v-for="item in historyList"
          :key="item.chatId"
          class="history-box mb-16px pt-14px pb-14px pl-8px pr-8px"
          :class="item.chatId === route.query.chatId ? 'active' : ''"
          @click="changeChatId(item.chatId)"
        >
          <div class="title flex">
            <div class="inline-block mr-6px">
              {{ item.value.slice(0, 20) }}
            </div>
            <div v-if="item.chatId === route.query.chatId" class="current inline-block h-14px l">
              当前会话
            </div>
            <div class="time inline-block ml-auto">
              {{ formateTime(item.createTime) }}
            </div>
          </div>
          <div class="content flex">
            <div>{{ `${item.askValue.slice(0, 20)}...` }}</div>
            <div class="ml-auto" @click.stop="deleteChatList(item.chatId)">
              <img
                :src="deleteIcon"
                class="opr-icon"
              >
            </div>
          </div>
        </div>
        <el-pagination
          v-model:current-page="pageNumber"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="count"
          @current-change="handleCurrentChange"
        />
      </div>
    </Dialog>

    <Dialog v-model="showDelete" width="350px">
      <template #header>
        删除确认
      </template>
      <p class="text p-24px pb-0">
        这次删除，真的不是手抖了吗？
      </p>
      <template #footer>
        <div class="flex justify-between p-l-24px p-r-24px">
          <el-button
            :loading="isLoading"
            color="#EDEDED"
            class="w-88px"
            size="large"
            @click="deleteConfirm"
          >
            确认删除
          </el-button>
          <el-button
            :loading="isLoading"
            color="#00BBFF"
            class="w-88px"
            size="large"
            @click="showDelete = false"
          >
            反悔了～
          </el-button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style lang="scss">
.history-box {
    background: #f8f8f8;
    border-radius: 10px 10px 10px 10px;
    cursor: pointer;

    .title {
        font-weight: 500;
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

    &.active {
        background: linear-gradient(
            136deg,
            #def9ff 0%,
            #ffffff 50%,
            #fdf0ff 100%
        );
    }
}
// .el-button {
//     color: #fff;
// }

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
        max-width: 80%;
        background: linear-gradient(136deg, #c07dff 0%, #82e2ff 100%);
        border-radius: 6px 6px 6px 6px;
        padding: 8px;
        margin-bottom: 18px;

        &:hover {
            background: linear-gradient(136deg, #c07dff 0%, #82e2ff 100%),
                rgba(255, 255, 255, 0.3);
            box-shadow: 0px 0px 4px 0px #d1d1d1;
        }

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
        }
    }
    .chat-bot {
        max-width: 80%;
        background: #f8f8f8;
        padding: 8px;
        border-radius: 6px 6px 6px 6px;
        margin-bottom: 18px;

        &:hover {
            box-shadow: 0px 0px 4px 0px #d1d1d1;
            background: #ffffff;
        }

        .text {
            font-size: 14px;
            color: #222222;
            line-height: 21px;
        }
    }

    .tip {
        font-size: 10px;
        color: #909090;
        line-height: 10px;
        margin-bottom: 16px;
        text-align: center;
    }
}
</style>
