<script setup>
import Progress from './Progress.vue'
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
    default: 'v1',
  },
  avator: {
    type: String,
    default: 'https://upload.cdn.galaxy-immi.com/all_it/icon/xinfeng2.png',
  },
})

const tips = computed(() => {
  const pasrsint = Number.parseInt(props.percentage / 100)
  return {
    0: '快和我说句话，我要憋不住了！',
    1: '我觉得你是个非常有趣的人，可以多聊聊吗？',
    2: '我发现跟你在一起，智商都变高了',
    3: '每次和你聊天，我都感觉自己像个明星耶',
    4: '我们的友谊就像麻辣火锅，越聊越火热',
  }[pasrsint || 0]
})
</script>

<template>
  <section class="user-info flex flex-col items-center relative">
    <div>
      <img class="avator" :src="props.avator">
    </div>
    <div class="user-name mt-40px mb-14px">
      {{ props.chatName }}
    </div>
    <div class="flex">
      <el-tooltip
        :content="tips"
        placement="bottom"
        effect="light"
        :show-arrow="false"
        popper-class="propress-popper-class"
      >
        <Progress class="mb-4px mr-6px" :percentage="(props.percentage || 0) % 100" />
      </el-tooltip>
      <div class="level">
        {{ props.levelName || 'V1' }}
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.user-info {
    width: 250px;
    height: 102px;
    background: linear-gradient(136deg, #def9ff 0%, #ffffff 50%, #fdf0ff 100%);
    border-radius: 6px 6px 6px 6px;
    border: 1px solid #ffffff;

    .level {
        padding-left: 4px;
        padding-right: 4px;
        height: 13px;
        background: linear-gradient(90deg, #86dfff 0%, #bc86ff 100%);
        border-radius: 6px 6px 6px 6px;

        color: #fff;
        font-size: 10px;
        font-weight: 500;
    }

    .avator {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: -50%;
        width: 80px;
        height: 80px;
        border-radius: 50px;
    }

    .user-name {
        height: 20px;
        font-weight: 500;
        font-size: 18px;
        color: #222222;
        line-height: 20px;
        text-align: center;
    }
}
.propress-popper-class.el-popper {
    border: 1px solid transparent !important;
    background: #fff;
    background-image: linear-gradient(white, white),
        linear-gradient(
            to right,
            rgba(131, 226, 255, 1),
            rgba(191, 128, 255, 1)
        );
    background-origin: border-box; /* 渐变背景仅在边框区域 */
    background-clip: padding-box, border-box; /* 上层背景裁剪到内容区，下层背景裁剪到边框区 */
    border-radius: 6px 6px 6px 6px !important;
}
</style>
