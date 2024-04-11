<script setup lang="ts">
import { debounce } from "lodash-es";
import { Close } from "@element-plus/icons-vue";

import {
  GetFrontConfluenceGetUserSearchHistory,
  PostFrontConfluenceSaveUserSearchHistory,
  DeleteFrontConfluenceRemoveUserSearchHistory,
} from "@/services/apifox/zhiNengKeFu/cONFLUENCEZhangHaoGuanLi/apifox";

const emit = defineEmits(["input", "select"]);

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "medium",
  }
});

const keyword = ref(""); // 搜索关键字
const showHistory = ref(false) // isFocus && !keyword

// 历史记录列表，字符串数组
const historyList = ref<string[]>([]);

const loadHistory = async () => {
  const res = await GetFrontConfluenceGetUserSearchHistory();
  historyList.value = (res || []).filter(t => !!t).reverse().slice(0, 10);
};

// 保存搜索记录
const handleSave = async (val) => {
    await PostFrontConfluenceSaveUserSearchHistory({
        searchKey: val
    })
}

// 删除历史记录
const handleDelete = async (item: string, index: number) => {
  try {
    await DeleteFrontConfluenceRemoveUserSearchHistory({
      searchKey: item,
    })
    historyList.value.splice(index, 1)
  } catch (error) {
    console.log("删除失败");
  }
};

// 输入框，聚焦事件
const handleFocus = () => {
  showHistory.value = !!historyList.value.length && !keyword.value
};

// 输入框，失焦事件
const handleBlur = () => {
  showHistory.value = false
}

// 输入框，键盘事件
const handleKeydown = debounce(async () => {
  // 兼容空数据
  if (keyword.value) {
    // await handleSave(keyword.value)
  } else {
    showHistory.value = !!historyList.value.length
  }
  await loadHistory()
  emit("input", keyword.value)
}, 200);

// 点击历史记录
const handleTarget = async (val) => {
  showHistory.value = false
  keyword.value = val
  // 兼容空数据
  if (val) {
    await handleSave(val)
  }
  emit("select", val)
};

onMounted(async () => {
  props.value && (keyword.value = props.value);
  await loadHistory();
});

// 可以通过ref获取的属性
defineExpose({
  handleTarget,
  handleBlur
})
</script>

<template>
  <div :class="['suggestions-input', 'relative', size]">
    <el-input
      v-model="keyword"
      size="large"
      placeholder="我想知道..."
      class="search-input"
      @input="handleKeydown"
      @focus="handleFocus"
      @blur="() => keyword && handleSave(keyword)"
    >
      <template #prefix>
        <img
          src="~@/assets/images/search-icon.png"
          alt=""
          class="search-icon"
        />
      </template>
    </el-input>
    <div v-if="showHistory" class="history-list">
      <el-divider />
      <div
        v-for="(item, index) in historyList"
        :key="index"
        class="history-item flex justify-between items-center"
        @click="handleTarget(item)"
      >
        <div class="flex items-center">
          <img src="~@/assets/images/timer.png" alt="" class="item-icon" />
          <span class="item-label">{{ item }}</span>
        </div>
        <el-icon class="item-del" @click.stop="handleDelete(item, index)"
          ><Close
        /></el-icon>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-input :deep {
  .el-input__wrapper {
    height: 46px;
    background: #fff;
    border-radius: 10px;
    box-shadow: none;
    border: 1px solid #4c9aff;
  }
}

.el-divider {
  margin: 4px 0;
  border-top-color: #f5f5f6;
}

.history-list {
  position: absolute;
  top: 38px;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 2px 10px 10px;
  background: #fff;
  border: 1px solid #4c9aff;
  border-top: none;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
}

.history-item {
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #f7f8f9;
    .item-del {
      opacity: 1;
    }
  }
}

.search-icon {
  width: 18px;
  height: 21px;
}

.item-icon {
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.item-label {
  color: #4c9aff;
  font-family: "PingFang SC";
  font-size: 14px;
}

.item-del {
  font-size: 16px;
  color: #ccc;
  opacity: 0;
  &:hover {
    color: #222;
  }
}

.mini {
  .search-input {
    :deep {
      .el-input__wrapper {
        height: 38px;
      }
    }
  }

  .history-list {
    top: 30px;
  }
}
</style>
