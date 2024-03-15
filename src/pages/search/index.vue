<route>
{
meta: {
title: "搜搜首页",
constant: false,
layout: 'blank'
}
}
</route>

<script setup lang="ts" name="search">
import { debounce } from 'lodash-es'
import { GetWikiRestApiSearch, GetWikiSpaceAuth } from '@/services/wiki/apifox'
import { Search } from '@element-plus/icons-vue'
const router = useRouter()

// 登录弹窗
const visible = ref(false)
const handleClose = () => {
    visible.value = false
}

// 检查账号密码
const hasUser = ref(false)
const usernameInput = ref('') //ref('kennen')
const passwordInput = ref('') //ref('7d81MNAHo+v@b')

let username,password

const getUserInfo = () => {
    username = localStorage.getItem('wiki-username')
    password = localStorage.getItem('wiki-password')
}
getUserInfo()
hasUser.value = !!username && !!password
visible.value = !hasUser.value

console.log('visible', visible.value)
const isSearch = ref(false) // 是否触发过搜搜
const keyword = ref('') // 搜索的关键字
const list = ref([]) // 搜索的内容

// 分页
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
}
const handleCurrentChange = () => {
    loadData(keyword.value)
}

interface paramsModel {
    cql: string
    start: number
    limit: number
    excerpt: string
    expand: string
    src: string
    includeArchivedSpaces: boolean
}
const paramsData = ref<paramsModel>({
    cql: '',
    start: 0,
    limit: 20,
    excerpt: "highlight",
    expand: "space.icon",
    src: "next.ui.search",
    includeArchivedSpaces: false
})

// 登录
const handleLogin = async () => {
    const auth = {
        username: usernameInput.value,
        password: passwordInput.value
    }

    try {
        const res = await GetWikiRestApiSearch({
            ...paramsData.value,
            cql: 'siteSearch ~ "key"',
        }, {
            auth
            // headers: {
            //     'Authorization': 'Basic ' + btoa(`${usernameInput.value}:${passwordInput.value}`)
            // }
        })
        console.log('123', res)
        if (res?.results) {
            localStorage.setItem('wiki-username', usernameInput.value)
            localStorage.setItem('wiki-password', passwordInput.value)
            hasUser.value = true
            getUserInfo()
            loadData('login')
            ElMessage.success('登录成功!')
            handleClose()
        } else {
            ElMessage.error('对不起，您的用户名和/或密码不正确。请重新再试。')
            // localStorage.removeItem('wiki-username')
            // localStorage.removeItem('wiki-password')
        }
    } catch (error) {
        console.log('error', error)
        ElMessage.error('对不起，您的用户名和/或密码不正确。请重新再试。')
    }
}

// 自动拼接成 高亮字符串
const highlightText = (str: string) => {
    return str.replace(/@@@hl@@@/g, '<em>').replace(/@@@endhl@@@/g, '</em>')
}

/**
 * 获取列表数据
 * $description 清除不需要的筛选参数
 * */
async function loadData(key: string) {
    if (!key) {
        list.value = []
        total.value = 0
        return
    }
    const keywordStr = `siteSearch ~ "${key}" AND type in ("space","user","com.atlassian.confluence.extra.team-calendars:calendar-content-type","attachment","page","com.atlassian.confluence.extra.team-calendars:space-calendars-view-content-type","blogpost")`
    paramsData.value.cql = keywordStr // 关键字 //encodeURIComponent(`siteSearch ~ "${keyword.value}"`)
    paramsData.value.start = (currentPage.value - 1) * pageSize.value // 页码
    paramsData.value.limit = pageSize.value
    let auth
    if (username && password) {
        auth = {
            username,
            password
        }

    }
    const res = await GetWikiRestApiSearch(paramsData.value, {
        auth
    })

    total.value = res.totalSize || 0
    list.value = res.results?.map((t: any) => {
        return {
            id: t.content?.id,
            title: highlightText(t.title),
            content: highlightText(t.excerpt),
            from: t.resultGlobalContainer?.title,
            _links: t.content?._links
        }
    }) || []
}

// 是否触发过搜索
const handleKeydown = debounce(async () => {
    isSearch.value = true
    loadData(keyword.value)
}, 200)

const handleItem = async (item: any) => {
    console.log('item.content?._links?.webui', item._links?.webui)
    window.open('http://wiki.galaxy-immi.com:8090/' + item._links?.webui)
}

const handleClick = () => {
    router.push('/chat')
}



</script>

<template>
    <div class="content-container">
        <div class="back-button" @click="handleClick">
            <img src="~@/assets/images/back.png" alt="" class="back-icon">
            返回会话
        </div>
        <div v-if="!isSearch" class="sousou-logo-img">
            <img src="~@/assets/images/search-logo.png" alt="">
        </div>
        <div v-if="!isSearch" class="sousou-title-img">
            <img src="~@/assets/images/search-title.png" alt="">
        </div>
        <div class="search-box">
            <el-input
                v-model="keyword"
                size="large"
                placeholder="我想知道..."
                class="search-input gray-input"
                :prefix-icon="Search"
                @keydown="handleKeydown"
            >
            </el-input>
        </div>
        <div :class="['sousou-desc', { 'is-search': isSearch }]">数据来源:业务知识库</div>
        <div v-if="isSearch" class="search-result">
            <div v-for="(item, index) in list" :key="item.title" :index="index" class="result-item" @click="handleItem(item)">
                <div v-html="item.title" class="item-title"></div>
                <div v-html="item.content" class="item-content"></div>
                <div class="item-from">
                    摘自：
                    <span>{{ item.from }}</span>
                </div>
            </div>
            <el-empty v-if="!list.length" :image-size="200" />
        </div>
        <div class="pagination-container">
            <el-pagination
                v-if="isSearch"
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                layout="prev, pager, next, jumper, total"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
        <!--   使用element-plus实现登录弹窗     -->
        <Dialog v-model="visible" width="300px" @close="handleClose">
            <template #header>
                登录
            </template>
            <div>
                <div>请输入业务知识库账号密码</div>
                <el-input v-model="usernameInput" placeholder="账号" class="mt-16px gray-input" size="large" />
                <el-input v-model="passwordInput" type="password" placeholder="密码" class="mt-12px gray-input" size="large" />
                <div class="mt-16px text-center">
                    <el-button type="primary" :disabled="!usernameInput || !passwordInput" class="login-btn" @click="handleLogin">登录</el-button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 100vh;
  font-size: 14px;
}

.content-container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  font-size: 14px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  margin: 12px 0 0 16px;
  padding: 6px 8px;
  width: 90px;
  background: #ecfcff;
  color: #606060;
  border-radius: 4px;
  cursor: pointer;
}

.back-icon {
  margin-right: 4px;
  width: 13px;
  height: 11px;
  border-radius: 0;
}

.sousou-logo-img {
  margin-top: 35vh;
}

.sousou-logo-img img {
  margin: 0 auto;
  width: 84px;
  height: 32px;
}

.sousou-title-img {
  margin-top: 22px;
}

.sousou-title-img img {
  margin: 0 auto;
  width: 240px;
  height: 34px;
}

.search-box {
  margin-top: 34px;
  padding: 0 16px;
  width: 100%;
}

.search-input {
  //background: #F9F9FC;
  //border-radius: 10px;
}

.gray-input :deep {
  .el-input__wrapper {
    height: 46px;
    background: #f9f9fc;
    border-radius: 10px;
    box-shadow: none;
    border: none;
  }
}

//.search-input .el-input__inner {
//    border: none;
//}

.sousou-desc {
  margin-top: 30px;
  font-size: 12px;
  color: #909090;
  text-align: center;
}

.sousou-desc.is-search {
  margin-top: 12px;
}

.search-result {
  padding: 16px;
  flex: 1;
  height: 0;
  overflow-y: auto;
}

.result-item {
  margin-bottom: 16px;
  padding: 16px 8px;
  background: #f8f8f8;
  border-radius: 10px;
  cursor: pointer;
}

.result-item :deep em {
  color: #00c4ff;
  font-style: normal;
}

.result-item:hover {
  background: linear-gradient(136deg, #def9ff 0%, #fff 50%, #fdf0ff 100%);
}

.item-title {
  color: #333;
}

.item-content {
  margin-top: 12px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 控制显示行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: normal; /* 显示换行 */
  word-wrap: break-word; /* 允许单词内换行 */
  overflow-wrap: break-word; /* 允许单词内换行 */
}

.item-from {
  margin-top: 12px;
  color: #999;
}

.pagination-container {
  display: flex;
  justify-content: end;
  padding: 16px 32px;
}

.login-btn {
  background: #87dfff;
  border-radius: 6px;
  border: none;
  width: 93px;
  height: 36px;
  &.is-disabled,
  &.is-disabled:hover {
    background: #ededed;
  }
}
</style>
