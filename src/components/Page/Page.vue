<script lang="ts" setup>
interface PropsData {
    name: string
    jumpFn?: Function
}

const props = defineProps({
  // 自定义面包屑，可覆盖route.meta.breadcrumb
  breadcrumb: {
    type: Array,
  },
  showCrumb: {
    type: Boolean,
    default: true,
  },
})

const route = useRoute()
const router = useRouter()

const newBreadcrumb = computed(() => {
  return (props.breadcrumb || route.meta.breadcrumb || []) as PropsData[]
})

// 跳转，默认通过回退的方式
function jump(index, item) {
  const length = newBreadcrumb.value.length
  if (item.jumpFn)
    return item.jumpFn(item)
  if (item.path)
    return router.push(item.path)
  return router.go(index - length + 1)
}
</script>

<template>
  <div class="page_container">
    <div class="h-100% flex flex-col">
      <div class="page-bg">
        <section v-if="props.showCrumb" class="page-header">
          <div class="app-breadcrumb">
            <el-breadcrumb v-show="newBreadcrumb.length" separator="/">
              <el-breadcrumb-item
                v-for="(item, index) in newBreadcrumb"
                :key="item.name"
                :type="(index === newBreadcrumb.length - 1 || newBreadcrumb.length <= 1) ? '' : 'breadcrumb'"
              >
                <a
                  v-if="index !== newBreadcrumb.length - 1"
                  href="javascript:void(0)"
                  @click="jump(index, item)"
                >{{
                  item.name
                }}</a>
                <span v-else>{{ item.name }}</span>
              </el-breadcrumb-item>
            </el-breadcrumb>
            <div>
              <slot name="right" />
            </div>
          </div>
          <div class="p-4 w100% page-body">
            <slot />
          </div>
        </section>
        <section v-else>
          <slot />
        </section>
      </div>
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page_container {
  position: relative;
}
.page-bg {
  flex: 1;
  margin: 20px;
  overflow: auto;

  .page-header {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .page-body {
    height: 0;
    flex: 1;
    overflow-y: auto;
    border-radius: 6px;
    background-color: rgb(255 255 255);
  }
}

.app-breadcrumb {
  background-color: #f2f6fa;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  align-items: center;
  line-height: 50px;

  .el-breadcrumb {
    display: inline-block;
    font-weight: 400;
    font-size: 16px;
    margin: 4px 0 16px;
  }

  :deep(.el-breadcrumb__inner) {
    color: #141222;
    font-weight: bold;
  }

  :deep(.el-breadcrumb__separator) {
    font-weight: normal;
    color: #141222;
  }

  .el-breadcrumb__item[type*="breadcrumb"] {
    :deep(.el-breadcrumb__inner) {
      color: #828395;
      font-weight: normal;

      a {
        color: #828395;
        font-weight: normal;
      }

      &:hover {
        a {
          color: #0151ff;
          font-weight: 400;
        }
      }
    }

    :deep(.el-breadcrumb__separator) {
      font-weight: normal;
      color: #828395;
    }
  }

  :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner,
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover) {
    color: #141222;
    font-weight: bold;
  }
}
</style>
