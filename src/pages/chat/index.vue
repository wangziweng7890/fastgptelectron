<script setup lang="ts" name="chat">
import { customAlphabet } from 'nanoid'
import UserInfo from './component/Userinfo.vue'
import ChatBox from './component/ChatBox.vue'
import { streamFetch } from './fetch'
import { appId } from './config'
import useUserSetting from '@/store/modules/settings'

import { GetFrontAppGet, GetFrontAppIntimacy } from '@/services/apifox/zhiNengKeFu/cHAT/apifox'
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 12)
const userSettingStore = useUserSetting()

const router = useRouter()
const route = useRoute()

const forbidRefresh = ref(false)

const chatId = computed(() => route.query.chatId)

async function onSend(StartChatFnProps) {
  const { messages, controller, generatingMessage, variables }
        = StartChatFnProps
  const prompts = messages.slice(-2)
  const completionChatId = chatId.value || nanoid()
  await streamFetch({
    data: {
      stream: true,
      detail: true,
      messages: prompts,
      variables,
      appId,
      chatId: completionChatId,
    },
    onMessage: generatingMessage,
    abortCtrl: controller,
  })

  // new chat
  if (completionChatId !== chatId.value) {
    if (controller.signal.reason !== 'leave') {
      forbidRefresh.value = true
      setTimeout(() => {
        forbidRefresh.value = false
      }, 10)
      router.replace({
        query: {
          chatId: completionChatId,
        },
      })
    }
  }
}

const chatName = ref('')
const intro = ref('')
GetFrontAppGet({ appId }, {
}).then((data) => {
  userSettingStore.setAvatar(data.avatar)
  chatName.value = data.name
  intro.value = data.intro
}).then(() => {
  getUserInfo()
})

const levelName = ref()
const percentage = ref(0)
function getUserInfo() {
  GetFrontAppIntimacy({ appId }).then((data) => {
    levelName.value = data.levelName
    percentage.value = data.point
  })
}
</script>

<template>
  <HeaderBar>
    <UserInfo :level-name="levelName" :percentage="percentage" :chat-name="chatName" />
  </HeaderBar>
  <div class="flex justify-center items-center h-100%">
    <div class="flex flex-col w-100% justify-center items-center bg-#F5F6F7 h-100% overflow-hidden">
      <ChatBox
        ref="chatBox"
        class="flex-1 w-100%"
        :on-start-chat="onSend"
        :is-new-chat="forbidRefresh"
        :intro="intro"
        :avatar="avatar"
        @refresh="getUserInfo"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

<route>
    {
      meta: {
        title: "银河数字助理",
        layout: 'blank',
      }
    }
  </route>
