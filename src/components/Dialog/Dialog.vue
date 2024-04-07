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
    padding: 0;

    .el-dialog__title {
        color: #222;
    }
    .el-dialog__header {
        font-weight: 500;
        margin-right: 0;
        font-weight: 500;
        font-size: 14px;
        line-height: 40px;
        padding: 0 20px;
        text-align: center;
        border-bottom: 1px solid #F6F6F6;
        background: linear-gradient(90.64deg, rgba(117, 200, 255, 0.2) 0.86%, rgba(67, 150, 255, 0.2) 98.93%),
linear-gradient(184.08deg, rgba(255, 255, 255, 0) 3.39%, #FFFFFF 68.06%);

        // background-image: linear-gradient(to right, #DEF9FF 0%, #FFFFFF 50%, #FDF0FF 100%), linear-gradient(to bottom, rgba(255,255,255,0), #ffffff);
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
