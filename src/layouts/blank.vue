<template>
  <div class="h-100%">
    <UpdateTips />
    <router-view v-slot="{ Component }">
      <keep-alive include="chat">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
