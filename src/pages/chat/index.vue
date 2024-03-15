<script setup lang="ts">
import { customAlphabet } from 'nanoid'
import searchIcon from './img/search.png'
import YhButton from './component/YhButton.vue'
import UserInfo from './component/Userinfo.vue'
import ChatBox from './component/ChatBox.vue'
import { streamFetch } from './fetch'
import { appId } from './config'
import { GetFrontAppGet, GetFrontAppIntimacy } from '@/services/apifox/zhiNengKeFu/cHAT/apifox'
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 12)

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

const avatar = ref('')
const chatName = ref('')
const intro = ref('')
GetFrontAppGet({ appId }).then((data) => {
  avatar.value = data.avatar
  chatName.value = data.name
  intro.value = data.intro
})

const levelName = ref()
const percentage = ref(0)
function getUserInfo() {
  GetFrontAppIntimacy({ appId }).then((data) => {
    levelName.value = data.levelName
    percentage.value = data.point
  })
}
getUserInfo()
function jumpToSousou() {
  router.push({
    path: '/search',
  })
}
</script>

<template>
  <div class="min-w-600px flex justify-center items-center h-100%">
    <div class="flex flex-col w-100% justify-center items-center bg-white pt-12px h-100% overflow-hidden">
      <section class="relative w-100%">
        <YhButton
          class="absolute top-12px right-20px"
          type="c"
          :src="searchIcon"
          @click="jumpToSousou"
        >
          银河搜搜
        </YhButton>
      </section>
      <UserInfo class="mt-50px pl-16px pr-16px mb-12px" :avator="avatar" :level-name="levelName" :percentage="percentage" :chat-name="chatName" />
      <ChatBox
        ref="chatBox"
        class="flex-1 w-100%"
        :on-start-chat="onSend"
        :is-new-chat="forbidRefresh"
        :intro="intro"
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
        layout: 'blank'
      }
    }
  </route>
