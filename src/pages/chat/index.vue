<script setup lang="ts">
import { customAlphabet } from 'nanoid'
import searchIcon from './img/search.png'
import YhButton from './component/YhButton.vue'
import UserInfo from './component/Userinfo.vue'
import ChatBox from './component/ChatBox.vue'
import { streamFetch } from './fetch'
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 12)

const router = useRouter()
const route = useRoute()

const forbidRefresh = ref(false)

const chatId = computed(() => route.query.chatId)
const appId = localStorage.getItem('appId')

async function onSend(StartChatFnProps) {
  const { messages, controller, generatingMessage, variables }
        = StartChatFnProps
  const prompts = messages.slice(-2)
  const completionChatId = chatId.value || nanoid()
  const { responseText, responseData } = await streamFetch({
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

  return { responseText, responseData, isNewChat: forbidRefresh.value }
}

function jumpToSousou() {
  router.push({
    path: '/sousou3',
  })
}
</script>

<template>
  <div class="bg-red flex justify-center items-center h-100%">
    <div class="w-600px flex flex-col justify-center items-center bg-white pt-12px h-100% overflow-hidden">
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
      <UserInfo class="mt-50px pl-16px pr-16px mb-24px" />
      <ChatBox
        ref="chatBox"
        class="flex-1 w-100%"
        :on-start-chat="onSend"
        :is-new-chat="forbidRefresh"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
