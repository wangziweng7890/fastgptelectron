<template>
  <el-dialog class="over-dialog" :close-on-click-modal="false">
    <template #header>
      <slot name="header" />
    </template>
    <template #default>
      <slot />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<style lang="scss">
.over-dialog {
    border-radius: 8px;
    overflow: hidden;
    .el-dialog__title {
        color: #222;
    }
    .el-dialog__header {
        font-weight: 500;
        margin-right: 0;
        font-weight: 500;
        font-size: 18px;
        line-height: 60px;
        padding: 0 20px;
        text-align: center;
        border-bottom: 1px solid #F6F6F6;
        background-image: linear-gradient(to right, #DEF9FF 0%, #FFFFFF 50%, #FDF0FF 100%), linear-gradient(to bottom, rgba(255,255,255,0), #ffffff);
        background-blend-mode: screen;

        .el-dialog__headerbtn {
            top: 2px;
        }
    }

    .el-dialog__body {
        padding: 20px;
        font-size: 16px;
        color: #141222;
    }
}
</style>
