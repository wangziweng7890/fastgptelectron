<script setup lang="ts" name="headbar">
import { Close, Minus } from '@element-plus/icons-vue'
interface IProps {
  title?: string
}
const props = defineProps<IProps>()

const onMini = () => {
  console.log('点击了最小化')
  window.electronAPI.minimize()
}
const onClose = () => {
  console.log('点击了关闭')
  window.electronAPI.close()
}
const isAffixedWindow = ref(false)
const onAffixWindow = async () => {
  console.log('点击了锁定')
  const resFlag = await window.electronAPI.affixWindow(!isAffixedWindow.value)
  isAffixedWindow.value = resFlag
}
// const onUnFixWindow = () => {
//   console.log('点击了锁定')
//   window.electronAPI.fixWindow(false)
// }
</script>

<template>
  <div class="HeadBar">
    <div class="title">
      {{ props.title || '银河数字助理' }}
    </div>
    <div class="btns">
      <el-space :size="0">
        <el-icon @click="onMini">
          <Minus />
        </el-icon>
        <el-icon v-if="isAffixedWindow" @click="onAffixWindow">
          <img class="png-icon" src="~@/assets/images/affix.png" alt="">
        </el-icon>
        <el-icon v-else @click="onAffixWindow">
          <img class="png-icon" src="~@/assets/images/unAffix.png" alt="">
        </el-icon>
        <el-icon @click="onClose">
          <Close />
        </el-icon>
      </el-space>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.HeadBar {
  width: 100%;
  position: fixed;
  height: 34px;
  background-color: rgb(213 237 232 / 20%);
  -webkit-app-region: drag;
  .title {
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    line-height: 34px;
  }
  .btns {
    -webkit-app-region: no-drag;
    position: fixed;
    right: 0;
    top: 0;
    :deep(.el-space__item) {
      align-items: stretch;
      cursor: pointer;
      &:hover {
        background: #e4e7e9;
      }
      & .el-icon {
        height: 34px;
        width: 34px;
        color: #999;
      }
    }
    & .png-icon {
      height: 20px;
      width: 20px;
    }
  }
}
</style>
