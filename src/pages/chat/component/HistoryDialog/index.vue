<script setup lang="ts">
import { chunk, groupBy } from 'lodash-es'
import dayjs from 'dayjs'
import { Delete, Loading } from '@element-plus/icons-vue'
import { Base64 } from 'js-base64'
import Avatar from '../Avatar.vue'
import type { ChatItem } from './interface'
import { useMessage } from '@/hooks/message'
import { useDialog } from '@/hooks/dialog'
import {
  GetFrontChatCompletionsDeleteByChatId,
  GetFrontChatCompletionsHistory,
} from '@/services/apifox/zhiNengKeFu/cHAT/apifox'
import { md } from '@/pages/chat/utils'
const props = defineProps<{
  appId: string
  chatId: string
}>()

const emit = defineEmits<{
  changeChatId: [chatId: string]
  newChat: []
}>()

const visible = defineModel<boolean>({
  required: true,
})

function onEscapeContent(content: string, type?: string) {
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

const { deleteMsg } = useMessage()
const { deleteDialog } = useDialog()

const changeChatId = (charId: string) => {
  emit('changeChatId', charId)
  visible.value = false
}

const pageNumber = ref(1)
const pageSize = 10

const historyListRes = shallowRef<Array<ChatItem>>([])

const historyList = computed(() => {
  return Object.entries(groupBy<ChatItem>(historyListRes.value, item => dayjs(item.createTime).format('YYYY/MM/DD')))
    .map(([timestamp, list]) => {
      const rowNum = chunk(list, 2).length
      return {
        timestamp,
        list,
        rowNum,
      }
    })
})

const disabledMore = ref(true)
const loading = ref(false)
const formatDate = (date: string) => dayjs(date).format('HH:mm:ss')

async function fetchList() {
  if (loading.value)
    return
  loading.value = true
  try {
    const { data, totalCount } = await GetFrontChatCompletionsHistory({
      appId: props.appId,
      pageNumber: pageNumber.value,
      pageSize,
    })

    if (pageNumber.value === 1) {
      historyListRes.value = []
    }

    Object.values(historyList.value).forEach((item) => {
      data.push(...item.list)
    })
    data.sort((a, b) => dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf())

    historyListRes.value = data
    disabledMore.value = data.length >= totalCount
    if (!disabledMore.value) {
      pageNumber.value++
    }
  }
  finally {
    loading.value = false
  }
}

const closedDialog = () => {
  pageNumber.value = 1
  disabledMore.value = true
}

async function deleteChatList(item: ChatItem) {
  deleteDialog({
    onOk: async () => {
      await GetFrontChatCompletionsDeleteByChatId({
        chatId: item.chatId,
      })
      historyListRes.value = historyListRes.value.filter(temp => temp.chatId !== item.chatId)
      deleteMsg()
      if (item.chatId === props.chatId) {
        visible.value = false
        emit('newChat')
      }
    },
  })
}
</script>

<template>
  <Dialog v-model="visible" :destroy-on-close="true" :width="492" modal-class="history-dialog" @open="fetchList" @closed="closedDialog">
    <template #header>
      历史会话
    </template>
    <el-empty v-if="!historyList.length" :image-size="200" />

    <div v-else v-infinite-scroll="fetchList" :infinite-scroll-distance="20" :infinite-scroll-disabled="disabledMore" class="msg-container mb-16px pr-20px">
      <el-timeline class="history-timeline">
        <el-timeline-item
          v-for="historyItem in historyList"
          :key="historyItem.timestamp"
          placement="top"
          :timestamp="historyItem.timestamp"
        >
          <div class="chat-timeline-content" :style="{ 'grid-template-rows': `repeat(${historyItem.rowNum}, 240px)` }">
            <div v-for="item in historyItem.list" :key="item.chatId" class="chat-item" :class="{ 'active-item': item.chatId === chatId }" @click="changeChatId(item.chatId)">
              <div class="chat-item-header">
                <span>
                  <i v-if="item.chatId === chatId" class="active-icon" />
                  {{ formatDate(item.createTime) }}
                </span>
                <el-button link title="删除" @click.stop="deleteChatList(item)">
                  <el-icon :size="12" color="#999">
                    <Delete />
                  </el-icon>
                </el-button>
              </div>
              <div class="chat-item-content">
                <div class="item-msg item-value" v-html="onEscapeContent(item.value, 'question')" />
                <div class="item-msg item-askValue">
                  <Avatar class="avator" />
                  <div
                    class="msg-content"
                    v-html="
                      md.render(
                        onEscapeContent(
                          item.askValue,
                          'answer',
                        ),
                      )
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>

      <div class="load-more-item">
        <span v-if="!disabledMore">
          加载中
          <el-icon class="is-loading">
            <Loading />
          </el-icon>
        </span>
        <span v-else>已全部加载完成</span>
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss">
.history-dialog .el-dialog__body {
  padding-right: 0;
}
.history-timeline{
  .el-timeline-item__node--normal{
    left: 0;
    border-color: rgba(76, 154, 255);
    background-color: rgba(76, 154, 255);
  }
  .el-timeline-item__tail{
    left: 5px;
    border-color: rgba(76, 154, 255, 0.4);
  }
  .el-timeline-item__timestamp{
    color: #666;
  }
}
</style>

<style lang="scss" scoped>
.chat-timeline-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-row-gap: 20px;
  grid-column-gap: 20px;
}

.chat-item {
  background-color: #f5f6f7;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden;
  &.active-item{
    background-color: #e4f0ff;
  }
}

.chat-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
  height: 20px;
  font-size: 10px;
  color: #222;
  border-bottom: 1px dotted #4C9AFF;
  flex-shrink: 0;
}

.active-icon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #38DE1D;
  display: inline-block;
}

.chat-item-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: flex-end;

  padding: 0 10px;
  position: relative;
  flex-grow: 2;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: inset 0 -20px 10px -10px #fff;
    z-index: 2;
    height: 100%;
    pointer-events: none;
  }
}

.item-msg {
  margin-top: 10px;
  margin-bottom: 10px;
  max-width: 95%;
  font-size: 14px;
  line-height: 21px;
  padding: 8px;
  overflow: hidden;

}

.item-value {
  background: #52a5f2;
  color: #fff;
  border-radius: 6px 6px 6px 6px;
  flex-shrink: 0;
}

.avator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
}

.item-askValue {
  align-self: flex-start;
  display: flex;
  >.msg-content {
    background-color: #fff;
    padding: 8px;
  }
}
.msg-container{
  overflow: auto;
  max-height: 467px;
}
.load-more-item{
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #999;
}
</style>
