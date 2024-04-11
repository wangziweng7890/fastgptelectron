<script lang="ts" setup>
import HeadBar from './HeadBar.vue'
import Menus from './Menus.vue'
</script>

<template>
  <div>
    <HeadBar />
    <Menus />
    <div class="container-all">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" setup>
.container-all {
  padding-top: 54px;
  height: 100vh;
}
</style>
