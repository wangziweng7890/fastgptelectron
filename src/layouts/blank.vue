<script lang="ts" setup>
import Page from './components/Page.vue'
</script>

<template>
  <Page>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </Page>
</template>
