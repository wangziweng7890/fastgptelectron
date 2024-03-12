<script setup lang="ts">
import LogSvg from '~/assets/logo/tuxing.svg?component'
import CompanySvg from '~/assets/logo/wenzi.svg?component'
</script>

<template>
  <router-link to="/workbench">
    <div class="head-nav flex items-center justify-center">
      <el-icon mr-10px :size="35">
        <LogSvg />
      </el-icon>
      <el-icon :size="90">
        <CompanySvg />
      </el-icon>
    </div>
  </router-link>
</template>

<style lang="scss">
.head-nav {
  width: 180px;
}
</style>
