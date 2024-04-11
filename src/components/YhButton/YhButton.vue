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
    <slot />
  </div>
</template>

<style lang="scss">
.yh-button {
    transition: all cubic-bezier(0.39, 0.575, 0.565, 1);
    cursor: pointer;
    height: 26px;
    background: #fff;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #D7D7D7;
    padding-left: 6px;
    padding-right: 8px;

    font-size: 14px;
    color: #666;
    line-height: 12px;

    line-height: 22px;
    text-align: left;

    &:hover {
        background: #EEF5FF;
        color: #4C9AFF;
        border: 1px solid #4C9AFF;
    }
//     &.b {
//         background: #e6e9ff;

//         &:hover {
//             border: 1px solid #4d5dff;
//         }
//     }
//     &.c {
//         background: #ecfcff;

//         &:hover {
//             border: 1px solid #62e6ff;
//         }
//     }
}
</style>
