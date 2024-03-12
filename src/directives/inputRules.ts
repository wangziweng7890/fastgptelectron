/*
 * @FilePath: /Document-System/src/directives/inputRules.ts
 * @Description: 控制input输入文本的指令
 * @使用方法：金额： v-input-rules.money  (默认只能输入小数点后两位，小数点后尾数可配置：eg：v-input-rules.money="4" 可保留4位)
 *           整数：v-input-rules.integer
 * @todo: 目前只做了两种，后续根据不同业务需求，定制不同的type，写到handlerType这个工厂函数中调用即可
 */

const inputRules = {
  mounted(el, binding) {
    let isPaste = false // 是否粘贴
    const type = Object.keys(binding.modifiers)[0]
    let exp_value = 2
    if (typeof binding.value === 'number' || typeof binding.value === 'string') {
      exp_value = +binding.value
    }
    if (typeof binding.value === 'object' && 'decimal' in binding.value) {
      exp_value = binding.value.decimal
    }
    let flag = true
    /** 金额类型时保留小数尾数用于计算的值 **/
    let intLen = '1'
    for (let i = 0; i < exp_value; i++) {
      intLen += '0'
    }
    /** 金额类型时保留小数尾数用于计算的值 **/
    const target
      = el instanceof HTMLInputElement ? el : el.querySelector('input')
    // 开始输入汉字
    target.addEventListener('compositionstart', () => {
      flag = false
    })
    // 结束输入汉字
    target.addEventListener('compositionend', () => {
      flag = true
    })
    /**
     *  这里使用input有bug，compositionend输入中文结束之后不会被监听到进行操作，用input的话就必须要指定input类型不能为number
     *  使用keyup操作没问题，但是在输入框中左右移动时也会被触发
     * **/
    const inputCallback = async (e) => {
      const i_value = e.target.value
      const handlerType = {
        // 由于是高频操作，避免dispatchEvent导致堆栈溢出，使用promise队列
        // 金额
        money: () => {
          return new Promise(() => {
            e.target.value = i_value
              .replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
              .replace(/^\./g, '') // 第一个字符必须是数字
              .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
              .replace('.', '$#$')
              .replace(/\./g, '')
              .replace('$#$', '.')
            // 控制小数点位数
            if (e.target.value.includes('.')) {
              const integer = e.target.value.split('.')[0]
              e.target.value = e.target.value.substr(
                0,
                integer.length + exp_value + 1,
              )
            }
            return true
          })
        },
        // 整数
        integer: () => {
          return new Promise(() => {
            if (isPaste) {
              const start = i_value.split('.')[0]
              e.target.value = isNaN(start) ? '' : +start
            }
            else {
              e.target.value = i_value.replace(/[^\d]/g, '')
            }
            // 为了解决数字末尾会显示“.”的问题
            if (e.target.value) {
              e.target.value = e.target.value * 100
              e.target.value = e.target.value / 100
            }
            isPaste = false
            const config = binding.value
            if (!config)
              return
            if ('min' in config && e.target.value < +config.min) {
              e.target.value = config.min
            }
            if ('max' in config && e.target.value > +config.max) {
              e.target.value = config.max
            }
          })
        },
      }
      if (flag) {
        await handlerType[type]()
        e.target.dispatchEvent(new Event('input'))
      }
    }
    el._inputCallback = inputCallback
    target.addEventListener('input', inputCallback)
    target.addEventListener('paste', () => {
      isPaste = true
    })
    const blurCallback = (e) => {
      const handlerType = {
        // 对小数点后面的数值进行补齐
        money: () => {
          if (e.target.value) {
            e.target.value = (
              Math.floor(
                Number(e.target.value) * Number(intLen),
              ) / Number(intLen)
            ).toFixed(Number(exp_value))
          }
          else {
            e.target.value = ''
          }
        },
        integer: () => {
          console.log('-----')
          const i_value = e.target.value
          return new Promise(() => {
            if (isPaste) {
              const start = i_value.split('.')[0]
              e.target.value = isNaN(start) ? '' : +start
            }
            else {
              e.target.value = i_value.replace(/[^\d]/g, '')
            }
            // 为了解决数字末尾会显示“.”的问题
            if (e.target.value) {
              e.target.value = e.target.value * 100
              e.target.value = e.target.value / 100
            }
            isPaste = false
            const config = binding.value
            if (!config)
              return
            if ('min' in config && e.target.value < +config.min) {
              e.target.value = config.min
            }
            if ('max' in config && e.target.value > +config.max) {
              e.target.value = config.max
            }
          })
        },
      }
      handlerType[type]()
      e.target.dispatchEvent(new Event('input'))
    }
    el._blurCallback = blurCallback
    target.addEventListener('blur', blurCallback)
  },
  // 解除事件监听
  unmounted(el) {
    const target
      = el instanceof HTMLInputElement ? el : el.querySelector('input')
    target.removeEventListener('input', el._inputCallback)
    target.removeEventListener('blur', el._blurCallback)
  },
}

export default inputRules
