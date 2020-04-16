import { reqGetSignature } from '../api/oauth'
import { getOpenid } from '../utils/utils'
(async function () {
  const openid = getOpenid()
  if (!openid) { return }
  const data = await reqGetSignature(1, window.location.href.split("#")[0]);
  // 微信配置
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: data.appId, // 必填，公众号的唯一标识
    timestamp: data.timestamp, // 必填，生成签名的时间戳
    nonceStr: data.nonceStr, // 必填，生成签名的随机串
    signature: data.signature, // 必填，签名，见附录1
    jsApiList: [
      "updateAppMessageShareData",
      "updateTimelineShareData",
      "showMenuItems",
      "hideAllNonBaseMenuItem",
      "chooseWXPay"
    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  });
  showMenuItems()
  wxshare("口罩卫士挑战赛，测试你的抗疫评级！", "专家还是黑洞就看这一次了！测抗疫等级赢好礼！")
})()

export function wxshare(title, des) {
  wx.ready(() => {
    //自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
    wx.updateAppMessageShareData({
      title: title, // 分享标题
      desc: des, // 分享描述
      link: `${window.location.origin}/maskgame/index.html`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: `${window.location.origin}/maskgame/share.jpg`,
      success: () => {
        // cb && cb()
      }
    });
    //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
    wx.updateTimelineShareData({
      title: title, // 分享标题
      desc: des, // 分享描述
      link: `${window.location.origin}/maskgame/index.html`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: `${window.location.origin}/maskgame/share.jpg`,
      success: () => {
        // cb && cb()
      }
    });
  });
}

export function hideAllNonBaseMenuItem() {
  wx.ready(() => {
    wx.hideAllNonBaseMenuItem()
  })
}

export function showMenuItems() {
  wx.ready(() => {
    wx.hideAllNonBaseMenuItem()

    wx.showMenuItems({
      menuList: [
        "menuItem:share:appMessage",
        "menuItem:share:timeline"
      ] // 要显示的菜单项，所有menu项见附录3
    });
  });
}

export function wxpay(payRes, cb) {
  wx.chooseWXPay({
    appId: payRes.appId,
    timestamp: payRes.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
    nonceStr: payRes.nonceStr, // 支付签名随机串，不长于 32 位
    package: `prepay_id=${payRes.prepay_id}`, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
    signType: payRes.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
    paySign: payRes.paySign, // 支付签名
    success: function (res) {
      console.log('微信支付成功回调', res)
      // 支付成功后的回调函数
      cb('success')
    },
    fail: function (err) {
      console.log('微信支付失败回调', err)
      cb('fail')
    },
    cancel: function (err) {
      console.log('用户取消微信支付', err)
      cb('cancel')
    },
  });
}
