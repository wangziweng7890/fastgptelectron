import Dialog from '@/components/Dialog/Dialog.vue'

export interface ConfirmDialogProps {
  title: string
  message: string
  confirmButtonText?: string
  cancelButtonText?: string
  onOk?: () => void | Promise<void>
  onCancel?: () => void
}

export function useDialog() {
  const confirmDialog = (props: ConfirmDialogProps) => {
    const container = document.createElement('div')

    const app = createApp(
      defineComponent({
        setup() {
          const visible = ref(true)
          const isLoading = ref(false)
          const close = () => {
            visible.value = false
          }
          const onOk = async () => {
            isLoading.value = true
            try {
              await props.onOk?.()
              close()
            }
            finally {
              isLoading.value = false
            }
          }
          const onCancel = () => {
            props.onCancel?.()
            close()
          }
          const slots = {
            header: () => props.title,
            default: () => [
              <p
                key="message"
                class="text p-24px pt-16px pb-36px text-center text-size-14px"
              >
                {props.message}
              </p>,
              <div
                key="footer"
                class=" flex justify-between p-l-30px p-r-30px"
              >
                <el-button
                  size="large" class="confirmButton"
                  loading={isLoading.value}
                  onClick={onOk}
                >
                  {props.confirmButtonText || '确定'}
                </el-button>
                <el-button
                  size="large"
                  class="cancelButton"
                  onClick={onCancel}
                  disabled={isLoading.value}
                >
                  {props.cancelButtonText || '取消'}
                </el-button>
              </div>,
            ],
          }
          return () => {
            return (
              <Dialog modal-class="custom-ui-dialog" modelValue={visible.value} onClose={close} onClosed={destroyViewer} v-slots={slots} width="300px"></Dialog>
            )
          }
        },
      }),
    )

    app.mount(container)
    document.body.appendChild(container)

    function destroyViewer() {
      app.unmount()
      document.body.removeChild(container)
    }
  }

  const deleteDialog = (props: {
    onOk: ConfirmDialogProps['onOk']
  }) => confirmDialog({
    ...props,
    title: '删除确认',
    message: '这次删除，真的不是手抖了吗？',
    confirmButtonText: '确认删除',
    cancelButtonText: '反悔了~',
  })
  return {
    deleteDialog,
    confirmDialog,
  }
}
