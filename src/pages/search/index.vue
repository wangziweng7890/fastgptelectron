<route>
{
  meta: {
    title: "银河数字助理",
    constant: false,
    layout: 'blank'
  }
}
</route>

<script setup lang="ts" name="search">
import { debounce } from "lodash-es";
import { GetWikiRestApiSearch, PostDoLogin } from "@/services/wiki/apifox";
import {
  GetFrontConfluenceAccount,
  PostFrontConfluenceAccountAdd,
} from "@/services/apifox/zhiNengKeFu/confluence/apifox";
import { GetFrontConfluenceGetHotSearch } from "@/services/apifox/zhiNengKeFu/cONFLUENCEZhangHaoGuanLi/apifox";
import backPng from "@/assets/images/back.png";
import hot1 from "@/assets/images/hot-1.png";
import hot2 from "@/assets/images/hot-2.png";
import hot3 from "@/assets/images/hot-3.png";
import hot4 from "@/assets/images/hot-4.png";
import hot5 from "@/assets/images/hot-5.png";
import hot6 from "@/assets/images/hot-6.png";

import SuggestionsInput from "./SuggestionsInput.vue";

const router = useRouter();

const suggestionsInputRef = ref<InstanceType<typeof SuggestionsInput>>(); // ref(null)
// 热搜图标
const hotIconMap = {
  1: hot1,
  2: hot2,
  3: hot3,
  4: hot4,
  5: hot5,
  6: hot6,
};

// 登录弹窗
const visible = ref(false);
const handleClose = () => {
  if (!localStorage.getItem("wiki-username")) {
    handleClick();
  }
  visible.value = false;
};
// 账号密码输入框
const usernameInput = ref(""); // ref('kennen')
const passwordInput = ref(""); // ref('7d81MNAHo+v@b')
let currentUsername, currentPassword; // 记录当前的账号密码

// 登录confluence的dologin.action
const doLoginConfluence = () => {
  try {
    PostDoLogin({
      os_usemame: currentUsername,
      os_password: window.atob(currentPassword),
      login: "登录",
      os_destination: "",
    });
  } catch (error) {
    console.log("PostDoLogin-error", error);
  }
};

// 检查账号密码
const loadConfluenceAccount = async () => {
  const readLocalUser = localStorage.getItem("wiki-local");
  if (readLocalUser) {
    currentUsername = localStorage.getItem("wiki-username");
    currentPassword = localStorage.getItem("wiki-password");
    return;
  }
  try {
    const res = (await GetFrontConfluenceAccount()) || {};
    if (!!res.username && !!res.password) {
      currentUsername = res.username;
      currentPassword = res.password;
      localStorage.setItem("wiki-username", currentUsername);
      localStorage.setItem("wiki-password", currentPassword);
      doLoginConfluence();
    } else {
      visible.value = true;
    }
  } catch (error) {
    console.log("error", error);
  }
};

const getUserInfo = () => {
  currentUsername = localStorage.getItem("wiki-username");
  currentPassword = localStorage.getItem("wiki-password");
};

const isSearch = ref(false); // 是否触发过搜搜
const keyword = ref(""); // 搜索的关键字
const list = ref<object[]>([]); // 搜索的内容

// 分页
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value);
});

const handleSizeChange = (val: number) => {
  loadData(keyword.value);
};
const handleCurrentChange = () => {
  loadData(keyword.value);
};

interface paramsModel {
  cql: string;
  start: number;
  limit: number;
  excerpt: string;
  expand: string;
  src: string;
  includeArchivedSpaces: boolean;
}
const paramsData = ref<paramsModel>({
  cql: "",
  start: 0,
  limit: 20,
  excerpt: "highlight",
  expand: "space.icon",
  src: "next.ui.search",
  includeArchivedSpaces: false,
});

// 登录
const handleLogin = async () => {
  const auth = {
    username: usernameInput.value,
    password: passwordInput.value,
  };

  try {
    const res = await GetWikiRestApiSearch(
      {
        ...paramsData.value,
        cql: 'siteSearch ~ "key"',
      },
      {
        auth,
        // headers: {
        //     'Authorization': 'Basic ' + btoa(`${usernameInput.value}:${passwordInput.value}`)
        // }
      }
    );
    console.log("123", res);
    if (res?.results) {
      // TODO保存账号密码
      const btoaPassword = window.btoa(passwordInput.value);
      PostFrontConfluenceAccountAdd({
        username: usernameInput.value,
        password: btoaPassword,
      })
        .then((accountRes: any) => {
          console.log("PostFrontConfluenceAccountAdd--res", accountRes);
          localStorage.setItem("wiki-username", usernameInput.value);
          localStorage.setItem("wiki-password", btoaPassword);
          getUserInfo();
          loadData("login");
          doLoginConfluence();
          ElMessage.success("登录成功!");
          handleClose();
        })
        .catch((err: any) => {
          console.log("err", err);
        });
    } else {
      ElMessage.error("对不起，您的用户名或密码不正确。请重试。");
      // localStorage.removeItem('wiki-username')
      // localStorage.removeItem('wiki-password')
    }
  } catch (error) {
    console.log("error", error);
    ElMessage.error("对不起，您的用户名或密码不正确。请重试。");
  }
};

// 自动拼接成 高亮字符串
const highlightText = (str: string) => {
  return str.replace(/@@@hl@@@/g, "<em>").replace(/@@@endhl@@@/g, "</em>");
};

/**
 * 获取列表数据
 * key 搜索的关键字
 * */
async function loadData(key: string) {
  if (!key) {
    list.value = [];
    total.value = 0;
    return;
  }
  const keywordStr = `siteSearch ~ "${key}" AND type in ("space","user","com.atlassian.confluence.extra.team-calendars:calendar-content-type","attachment","page","com.atlassian.confluence.extra.team-calendars:space-calendars-view-content-type","blogpost")`;
  paramsData.value.cql = keywordStr; // 关键字 //encodeURIComponent(`siteSearch ~ "${keyword.value}"`)
  paramsData.value.start = (currentPage.value - 1) * pageSize.value; // 页码
  paramsData.value.limit = pageSize.value;
  let auth;
  if (currentUsername && currentPassword) {
    auth = {
      username: currentUsername,
      password: window.atob(currentPassword),
    };
  }
  const res = await GetWikiRestApiSearch(paramsData.value, {
    auth,
  });

  total.value = res.totalSize || 0;
  list.value =
    res.results?.map((t: any) => {
      return {
        id: t.content?.id,
        title: highlightText(t.title),
        content: highlightText(t.excerpt),
        from: t.resultGlobalContainer?.title,
        _links: t.content?._links,
      };
    }) || [];

  // 保存搜索记录
  // isSaveSearchHistory && saveSearchKeyword(key)
}

/**
 * 获取热搜列表
 * */
const hotSearchList = ref<object[]>([]);
async function loadHotSearchList() {
  const res = await GetFrontConfluenceGetHotSearch();
  console.log("loadHotSearchList-res", res);

  hotSearchList.value = Object.keys(res)
    .map((key) => {
      return { label: key, value: res[key] };
    })
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 6)
    .map((t) => {
      return t;
    });
  console.log("loadHotSearchList-hotSearchList.value", hotSearchList.value);
}

// 是否触发过搜索
const handleKeydown = debounce(async (val) => {
  isSearch.value = true;
  keyword.value = val;
  loadData(val);
}, 200);

// 选中历史记录
const handleSelect = (val) => {
  isSearch.value = true;
  keyword.value = val;
  loadData(val);
};

const handleItem = async (item: any) => {
  window.electronAPI.openURL(
    `http://kf-wiki.galaxy-immi.com/${item._links?.webui}`
  );
};

const handleClick = () => {
  router.back();
};

// 点击热搜选项
const handleHotItem = (item: any) => {
  const { handleTarget } = suggestionsInputRef.value || {};
  handleTarget?.(item.label);
};

// 点击输入框以外的区域隐藏提示
const handleClickOutside = (event) => {
  console.log(
    "event.target",
    event.target,
    event.target.closest(".suggestions-input")
  );
  if (!event.target.closest(".suggestions-input")) {
    const { handleBlur } = suggestionsInputRef.value || {};
    handleBlur?.();
  }
};

const init = async () => {
  await loadConfluenceAccount();
  loadHotSearchList();
};
init();

onMounted(() => {
  console.log("onMounted-suggestionsInputRef", suggestionsInputRef.value);
});
</script>

<template>
  <div class="content-container" @click.stop.prevent="handleClickOutside">
    <div class="ml-16px mt-12px absolute">
      <YhButton
        class="mr-10px w-96px"
        type="c"
        :src="backPng"
        @click="handleClick"
      >
        返回会话
      </YhButton>
    </div>

    <div v-if="isSearch" class="flex flex-col h-100% overflow-hidden is-search">
      <div class="search-box flex items-center">
        <div class="is-search-logo">
          <img src="~@/assets/images/search-logo.png" alt="" />
          <div class="is-search-logo-title">藏经阁</div>
        </div>
        <SuggestionsInput
          ref="suggestionsInputRef"
          :value="keyword"
          class="flex-1"
          size="mini"
          @input="handleKeydown"
          @select="handleSelect"
        ></SuggestionsInput>
      </div>
      <div class="search-desc pt-8px pb-8px">数据来源:业务知识库</div>
      <div class="search-result">
        <div
          v-for="(item, index) in list"
          :key="item.title"
          :index="index"
          class="result-item"
          @click="handleItem(item)"
        >
          <div class="item-title" v-html="item.title" />
          <div class="item-content" v-html="item.content" />
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
          layout="prev, pager, next, jumper, slot"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <span class="pl-12px">共 {{ totalPages }} 页</span>
        </el-pagination>
      </div>
    </div>
    <div v-else class="flex flex-col h-100% justify-center overflow-hidden">
      <div class="search-logo-img mt--25vh">
        <img src="~@/assets/images/search-logo.png" alt="" />
      </div>
      <div class="search-title-img">藏经阁</div>
      <div class="search-desc mt-12px">数据来源:业务知识库</div>
      <div class="suggestions-box">
        <SuggestionsInput
          ref="suggestionsInputRef"
          @input="handleKeydown"
          @select="handleSelect"
        ></SuggestionsInput>
      </div>
      <div
        class="grid grid-cols-2 gap-x-20px gap-y-14px mt-16px ml-16px mr-16px pl-40px pr-40px"
      >
        <div
          v-for="(item, index) in hotSearchList"
          :key="index"
          :class="
            'hot-search-item flex items-center cursor-pointer' +
            ` hot-${index + 1}`
          "
          @click="handleHotItem(item)"
        >
          <img :src="hotIconMap[index + 1]" alt="" />
          <span class="ml-8px">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!--   使用element-plus实现登录弹窗     -->
    <Dialog v-model="visible" width="300px" @close="handleClose">
      <template #header> 登录 </template>
      <div>
        <div>请输入业务知识库账号密码</div>
        <el-input
          v-model="usernameInput"
          placeholder="账号"
          class="mt-16px gray-input"
          size="large"
        />
        <el-input
          v-model="passwordInput"
          type="password"
          placeholder="密码"
          class="mt-12px gray-input"
          size="large"
        />
        <div class="mt-16px text-center">
          <el-button
            type="primary"
            :disabled="!usernameInput || !passwordInput"
            class="login-btn mb-12px"
            @click="handleLogin"
          >
            登录
          </el-button>
          <Tooltip placement="bottom">
            <p class="tips">没有业务知识库账号?</p>
            <template #content>
              <P>业务知识库即Confluence</P>
              <P>注册账号请联系Jovian邓俊威</P>
            </template>
          </Tooltip>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.tips {
  font-size: 10px;
  color: #909090;
  line-height: 12px;
  text-decoration-line: underline;
}

.content-container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  font-size: 14px;
  background: #f5f6f7;
}

.back-icon {
  margin-right: 4px;
  width: 13px;
  height: 11px;
  border-radius: 0;
}

.search-logo-img img {
  margin: 0 auto;
  width: 80px;
  height: 80px;
}

.search-title-img {
  color: #4797ff;
  text-align: center;
  font-family: "PingFang SC";
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.search-title-img img {
  margin: 0 auto;
}

.search-box {
  padding: 8px 16px 0;
  width: 100%;
}

.suggestions-box {
  margin-top: 12px;
  padding: 0 16px;
  width: 100%;
}

.is-search {
  .search-box {
    background: #fff;
  }

  .search-desc {
    background: #fff;
  }
}

.gray-input :deep {
  .el-input__wrapper {
    height: 46px;
    background: #fff;
    border-radius: 10px;
    box-shadow: none;
    border: 1px solid #4c9aff;
  }
}

.is-search-logo {
  margin-right: 14px;
  img {
    margin: 0 auto;
    width: 27px;
    height: 23px;
  }
  &-title {
    color: #4797ff;
    text-align: center;
    font-family: "PingFang SC";
    font-size: 12px;
  }
}

.search-desc {
  padding-right: 16px;
  font-size: 12px;
  color: #909090;
  text-align: right;
}

.search-desc.is-search {
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
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid transparent;
}

.result-item :deep em {
  color: #00c4ff;
  font-style: normal;
}

.result-item:hover {
  border-color: #4c9aff;
  background:
    linear-gradient(
      0deg,
      rgb(255 255 255 / 90%) 0%,
      rgb(255 255 255 / 90%) 100%
    ),
    #4c9aff;
}

.item-title {
  color: #333;
}

.item-content {
  margin-top: 12px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
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

.hot-search-item {
  padding: 10px;
  border-radius: 6px;
  color: #222;
}
.hot-search-item.hot-1 {
  background:
    linear-gradient(
      135deg,
      rgb(255 168 150 / 20%) 2.62%,
      rgb(255 255 255 / 0%) 32.22%
    ),
    #fff;
}
.hot-search-item.hot-2 {
  background:
    linear-gradient(
      135deg,
      rgb(255 204 124 / 20%) 2.62%,
      rgb(255 255 255 / 0%) 32.22%
    ),
    #fff;
}
.hot-search-item.hot-3 {
  background:
    linear-gradient(
      135deg,
      rgb(117 222 255 / 20%) 2.62%,
      rgb(255 255 255 / 0%) 32.22%
    ),
    #fff;
}
.hot-search-item.hot-4 {
  background:
    linear-gradient(
      135deg,
      rgb(255 142 142 / 20%) 2.62%,
      rgb(255 255 255 / 0%) 32.22%
    ),
    #fff;
}
.hot-search-item.hot-5 {
  background:
    linear-gradient(
      135deg,
      rgb(115 253 245 / 20%) 2.62%,
      rgb(255 255 255 / 0%) 32.22%
    ),
    #fff;
}
.hot-search-item.hot-6 {
  background:
    linear-gradient(
      135deg,
      rgb(146 142 255 / 20%) 2.62%,
      rgb(255 255 255 / 0%) 32.22%
    ),
    #fff;
}

.el-pagination :deep {
  .btn-prev,
  .btn-next {
    background-color: transparent;
  }
  .el-pager {
    > li {
      background-color: transparent;
      border: 1px solid transparent;
      border-radius: 6px;
      &:hover {
        color: #4c9aff;
      }
      &.is-active {
        border-color: #4c9aff;
        color: #4c9aff;
      }
    }
  }
}
</style>
