<script setup lang="ts">
const props = defineProps({
  percentage: {
    type: Number,
    default: 100,
  },
})
</script>

<template>
  <div class="gradient-progress-bar">
    <div class="gradient-progress-container">
      <div
        class="overflow-box"
        :style="{
          width: `${props.percentage}%`,
          borderRadius: props.percentage === 100 ? '3px' : '5px',
        }"
      >
        <div class="progress-bar" />
      </div>
    </div>
    <div class="xin1">
      ♥
    </div>
    <div class="xin2">
      ♥
    </div>
  </div>
</template>

<style scoped lang="scss">
.xin1 {
    position: absolute;
    width: 12px;
    height: 11px;
    font-size: 15px;
    color: #bf80ff;
    top: -5px;
    left: -4px;
    z-index: 99;
}
.xin2 {
    width: 16px;
    height: 16px;
    font-size: 24px;
    color: #c2f1ff;
    position: absolute;
    left: -16px;
    top: -9px;
    transform: rotate(-45deg);
}
.gradient-progress-bar {
    box-sizing: content-box;
    width: 120px;
    height: 12px;
    background: #f5fdff;
    border: 1px solid transparent;
    border-radius: 5px 5px 5px 5px;
    background-image: linear-gradient(white, white),
        linear-gradient(
            to right,
            rgba(131, 226, 255, 1),
            rgba(191, 128, 255, 1)
        );
    background-origin: border-box; /* 渐变背景仅在边框区域 */
    background-clip: content-box, border-box; /* 上层背景裁剪到内容区，下层背景裁剪到边框区 */
    position: relative;
}
.overflow-box {
    transition: all 0.5s ease;
    overflow: hidden;
    border-radius: 5px;
}

.progress-bar {
    width: 118px;
    background-image: linear-gradient(
        to right,
        rgba(131, 226, 255, 1),
        rgba(191, 128, 255, 1)
    );
    height: 12px;
}
</style>
