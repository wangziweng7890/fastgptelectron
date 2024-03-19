<template>
  <el-tooltip
    popper-class="propress-popper-class"
    :show-arrow="false"
    effect="light"
  >
    <template #default>
      <slot />
    </template>
    <template #content>
      <slot name="content" />
    </template>
  </el-tooltip>
</template>

<style lang="scss">
.el-popper.propress-popper-class {
    border: 1px solid transparent !important;
    background: #fff;
    background-image: linear-gradient(white, white),
        linear-gradient(
            to right,
            rgba(131, 226, 255, 1),
            rgba(191, 128, 255, 1)
        );
    background-origin: border-box; /* 渐变背景仅在边框区域 */
    background-clip: padding-box, border-box; /* 上层背景裁剪到内容区，下层背景裁剪到边框区 */
    border-radius: 6px 6px 6px 6px !important;
}
</style>
