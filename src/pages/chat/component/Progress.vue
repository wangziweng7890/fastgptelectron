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
  </div>
  <div class="process-text">
    {{ percentage }}/100
  </div>
</template>

<style scoped lang="scss">
.gradient-progress-bar {
    box-sizing: content-box;
    width: 123px;
    height: 8px;
    background: #f5fdff;
    border-radius: 5px 5px 5px 5px;
    border: 1px solid transparent;
    border-radius: 5px 5px 5px 5px;
    background-image: linear-gradient(white, white),
        linear-gradient(
            to right,
            rgba(144, 228, 255, 1),
            rgba(64, 147, 255, 1)
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
    background: linear-gradient(90deg, #8fe2ff 0%, #7ccfff 100%);
    height: 8px;
}

.process-text {
    font-size: 10px;
    color: #1f497b;
    line-height: 12px;
    margin-left: 4px;
}
</style>
