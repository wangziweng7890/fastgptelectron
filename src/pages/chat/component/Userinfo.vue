<script setup>
import Progress from './Progress.vue'
import Circle from './Circle.vue'
import Avatar from './Avatar.vue'
const props = defineProps({
  percentage: {
    type: Number,
    default: 100,
  },
  chatName: {
    type: String,
    default: 'Eva伊娃',
  },
  levelName: {
    type: String,
    default: 'L1',
  },
})

const tips = computed(() => {
  const pasrsint
        = props.percentage === 0 ? 0 : Number.parseInt(props.percentage / 100)
  return (
    {
      0: '快和我说句话，我要憋不住了！',
      1: '我觉得你是个非常有趣的人，可以多聊聊吗？',
      2: '我发现跟你在一起，智商都变高了',
      3: '每次和你聊天，我都感觉自己像个明星耶',
      4: '我们的友谊就像麻辣火锅，越聊越火热',
    }[pasrsint] || '我们的友谊就像麻辣火锅，越聊越火热'
  )
})

const process = computed(() => {
  if (props.percentage === 0)
    return 0
  if (props.percentage >= 500)
    return 100
  const rest = (props.percentage || 0) % 100
  return rest
})
</script>

<template>
  <el-tooltip
    placement="bottom-start"
    popper-class="my-tip"
    :show-arrow="false"
    effect="light"
  >
    <section class="user-info flex items-center relative">
      <div class="mr-4px">
        <el-progress type="circle" :percentage="process" color="#3F92FF" :width="36" :stroke-width="4">
          <div class="bg-#B8CFED">
            <Avatar class="w-28px h-28px absolute left-4px top--14px " />
          </div>
        </el-progress>
        <!-- <Circle><Avatar /></Circle> -->
      </div>
      <div class="user-name mr-4px">
        {{ props.chatName }}
      </div>
      <div class="level ml-12px">
        <img
          src="~@/assets/images/xin.png"
          class="w-16px h-16px absolute left--12px top--3px"
          alt=""
        >
        {{ props.levelName || "L5" }}
      </div>
    </section>
    <template #content>
      <div class="releative">
        <section class="flex items-center mb-14px">
          <div class="avator w-48px h-48px p-1px bg-white absolute left-11px top--11px">
            <Avatar class="w-48px h-48px" />
          </div>
          <div class="user-name mr-4px ml-46px">
            {{ props.chatName }}
          </div>
          <div class="level ml-12px">
            <img
              src="~@/assets/images/xin.png"
              class="w-16px h-16px absolute left--12px top--3px"
              alt=""
            >
            {{ props.levelName || "L5" }}
          </div>
        </section>
        <section class="flex w-100% mb-14px items-center">
          <div class="label mr-10px color-#6f7b8b">
            亲密度
          </div>
          <Progress class="flex-1" :percentage="process" />
        </section>
        <section class="flex w-100%">
          <div class="label mr-10px color-#6f7b8b">
            心情
          </div>
          <p class="flex-1 text">
            {{ tips }}
          </p>
        </section>
      </div>
    </template>
  </el-tooltip>
</template>

<style lang="scss">
    .el-popper.my-tip {
        height: 124px;
        width: 240px;
        background: #ffffff;
        box-shadow: 0px 0px 10px 0px #cccccc;
        border-radius: 8px 8px 8px 8px;
        border: none;
        padding: 16px;
        padding-right: 14px;
    }
</style>

<style lang="scss" scoped>
.label {
    height: 12px;
    width: 38px;
    font-size: 12px;
    color: #6f7b8b;
    line-height: 12px;
    text-align: right;
    font-style: normal;
    text-transform: none;
}
.text {
    font-weight: 400;
    font-size: 12px;
    color: #1f497b;
    line-height: 14px;
    text-align: justified;
}
.user-info {
    -webkit-app-region: no-drag;
    width: 100%;
}
.level {
    position: relative;
    text-align: center;
    // padding-left: 4px;
    // padding-right: 4px;
    height: 12px;
    width: 22px;
    background: linear-gradient(90deg, #8fe2ff 0%, #3f92ff 100%);
    border-radius: 0px 6px 6px 0px;
    line-height: 13px;
    color: #fff;
    font-size: 10px;
    font-weight: 500;
}

.avator {
    border-radius: 50%;
}

.user-name {
    height: 20px;
    font-weight: 500;
    font-size: 14px;
    color: #222222;
}
</style>
