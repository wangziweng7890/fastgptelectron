<script setup>
const props = defineProps({
  size: {
    type: Number,
    default: 34,
  },
  progress: {
    type: Number,
    default: 100,
  },
  strokeWidth: {
    type: Number,
    default: 4,
  },
  bgColor: {
    type: String,
    default: '#F5FDFF',
  },
  progressColor: {
    type: String,
    default: '#3F92FF',
  },
})

const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => radius.value * 2 * Math.PI)
</script>

<template>
  <div
    class="relative"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
    }"
  >
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 36 36"
      class="circular-progress-bar"
    >
      <path
        class="circle-bg"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        :stroke="bgColor"
        :stroke-width="strokeWidth"
      />
      <path
        class="circle"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        :stroke="progressColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="
          circumference - (progress / 100) * circumference
        "
        :style="{ transition: 'stroke-dashoffset 0.5s ease 0s' }"
      />
      <!-- Optional: Text for displaying percentage -->
    </svg>
    <div
      :style="{
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        left: '0',
        top: '0',
        padding: `${strokeWidth - 1}px`,
      }"
    >
      <slot
        :style="{
          margin: `${strokeWidth}px`,
          width: `100%`,
          height: `100%`,
        }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.circular-progress-bar {
    position: absolute;
    left: 0;
    right: 0;
    transform: rotate(0deg);
    transform-origin: center;
}
.circle-bg {
    stroke-linecap: round;
}
.circle {
    stroke-linecap: round;
}
.percentage {
    font-weight: bold;
}
</style>
