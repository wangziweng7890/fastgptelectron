<script lang="ts" setup>
const props = defineProps({
  src: {
    type: String,
  },
  type: {
    type: String,
    default: 'a',
  },
})
</script>

<template>
  <div :class="`${props.type} yh-button`">
    <img
      v-if="props.src"
      class="inline-block w-16px h-16px mr-2px"
      :src="props.src"
    ><slot />
  </div>
</template>

<style lang="scss">
.yh-button {
    transition: all cubic-bezier(0.39, 0.575, 0.565, 1);
    cursor: pointer;
    height: 26px;
    background: #d6e8ff;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid transparent;
    padding-left: 6px;
    padding-right: 8px;

    font-size: 14px;
    color: #606060;
    line-height: 12px;

    line-height: 24px;
    text-align: left;

    &.a {
        background: #d6e8ff;

        &:hover {
            border: 1px solid #3591ff;
        }
    }
    &.b {
        background: #e6e9ff;

        &:hover {
            border: 1px solid #4d5dff;
        }
    }
    &.c {
        background: #ecfcff;

        &:hover {
            border: 1px solid #62e6ff;
        }
    }
}
</style>
