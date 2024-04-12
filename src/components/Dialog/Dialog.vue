<template>
  <el-dialog class="over-dialog" :close-on-click-modal="false" append-to-body top="6vh">
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
.el-overlay-dialog {
    overflow: auto;
    display: flex;
    align-items: center;
}
.over-dialog {
    border-radius: 8px;
    overflow: hidden;
    height: fit-content;
    padding: 0!important;

    .el-dialog__title {
        color: #222;
    }
    .el-dialog__header {
        font-weight: 500;
        margin-right: 0;
        font-weight: 500;
        font-size: 16px;
        line-height: 45px;
        padding: 0 20px;
        text-align: center;
        border-bottom: 1px solid #F6F6F6;
        background: linear-gradient(90deg, rgba(117, 200, 255, 0.8) 0%, rgba(67, 150, 255, 0.2) 100%), linear-gradient(184deg, rgba(255,255,255,0) 0%, #FFFFFF 69%);

        background-blend-mode: screen;

        .el-dialog__headerbtn {
            top: 2px;
            height: 44px;
        }
    }

    .el-dialog__body {
        padding: 20px 20px 24px 20px;
        font-size: 16px;
        color: #141222;
    }

    .el-dialog__footer {
        padding: 0;
    }
}
</style>
