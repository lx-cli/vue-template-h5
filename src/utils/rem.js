/** rem适配方案 */
(function (doc, win) {
  var u = navigator.userAgent;
  var font_size = 0;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      docEl.style.fontSize = 37.5 * (clientWidth / 375) + 'px';
      font_size = 37.5 * (clientWidth / 375) + 'px'; 
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
  var initScale = 1 / window.devicePixelRatio; // initScale  = 1/2;
  var viewPortMeta = document.createElement("meta");
  viewPortMeta.setAttribute("name", "viewport");
  viewPortMeta.setAttribute("content", "width=device-width, initial-scale=" +
          initScale + ", maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui");
  document.getElementsByTagName('head')[0].appendChild(viewPortMeta);
  if (isAndroid) {
    //android阻止页面字体自动调整大小（解决微信浏览器调整字体后，页面错位问题。iOS使用-webkit-text-size-adjust禁止调整字体大小）
    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
      handleFontSize();
    } else {
      if (document.addEventListener) { 
        document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
      } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", handleFontSize);
        document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
      }
    }

    function handleFontSize() {
      // 设置网页字体为默认大小
      WeixinJSBridge.invoke('setFontSizeCallback', {
        'fontSize': font_size
      });
      // 重写设置网页字体大小的事件
      WeixinJSBridge.on('menu:setfont', function () {
        WeixinJSBridge.invoke('setFontSizeCallback', {
          'fontSize': font_size
        });
      });
    }
  }
})(document, window);