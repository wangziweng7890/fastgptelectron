<script setup lang="ts">
import useUserSetting from '@/store/modules/settings'
const userSettingStore = useUserSetting()
</script>

<template>
  <img v-if="userSettingStore.avatar" class="-border-rd-50%" :src="userSettingStore.avatar">
</template>
