/**
 * @description 隐藏联系方式显示，点击显示并作记录
 * @author Jeff.Guo
 * @example <span v-secret="'2|客户详情页邮箱'" :key="scope.row.mobile">{{ scope.row.mobile }}</span>  表格中记得加key
 * @params '内容类型|内容页面名称及区域'
 *  内容类型：1 => 手机号，  2 => 邮箱，  3 => 微信ID， 4 => 微信手机号 5 => 身份证号
 *  内容页面名称及区域, 一句话描述点击区域位置，方便定位排查， 举例：信息查询-推荐列表手机号
 */

const vSecret = {
  mounted: (el, binding) => {
    // type: 1手机号  2邮箱  3微信ID 4微信手机号 5其它待定
    const text = el.innerHTML
    el.style.cursor = 'pointer'
    // 隐藏中间4位
    el.innerHTML = text.replace(/^(\d{3})\d*(\d{4})$/, '$1****$2')
    // 微信ID
    if (binding.value && binding.value.split('|')[0] === '3')
      el.innerHTML = new Array(text.length + 1).join('*')
    // 点击显示全部，并提交点击记录
    // const params = binding.value ? binding.value.split('|') : []
    // const data = {
    //     pathname: location.pathname, // 事件发起页面路由
    //     host: location.host, // 事件发起页面域名
    //     system: 'CRM', // 系统名
    //     type: params[0], // 埋点类型
    //     userName: JSON.parse(localStorage.getItem('user')).account, // 当前登帐号
    //     pageName: params[1] || '', // 页面名称
    //     activeName: el.innerText || '未知',
    //     value: '',
    // }
    el.addEventListener('click', () => {
      el.innerHTML = text
      el.style.cursor = ''
      el.style.pointerEvents = 'none'
      // const img = new Image()
      // const baseUrl = `${process.env.VUE_APP_PUSH_URL}/image/n.gif`
      el.onclick = null
      // img.src = `${baseUrl}?${queryString(data)}`
      // img.onload = () => {
      // img.remove()
      // }
    })
  },

}
export default vSecret
