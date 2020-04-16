<template>
  <div id="app">
    <transition name="router-fade" mode="out-in" v-show="isPortrait">
      <div v-show="isPortrait" style="height:100%;">
        <router-view />
      </div>
    </transition>
    <div class="tip" v-if="!isPortrait">请使用竖屏模式浏览</div>
  </div>
</template>

<script>
import { getOpenid, setOpenid, setStore, getStore } from "./utils/utils";
import { showMenuItems } from "./utils/wxapi";
export default {
  data() {
    return {
      isPortrait: true //是否竖屏
    };
  },
  mounted() {
    // setOpenid("o8XsE0mLDD5jNjzqyYSZQgUoVrhA"); //测试环境先授权，发布时删除

    // 移动端的浏览器一般都支持window.orientation这个参数，通过这个参数可以判断出手机是处在横屏还是竖屏状态。
    window.addEventListener(
      "onorientationchange" in window ? "orientationchange" : "resize",
      () => {
        if (window.orientation === 180 || window.orientation === 0) {
          //竖屏状态
          console.log("竖屏");
          this.isPortrait = true;
        }
        if (window.orientation === 90 || window.orientation === -90) {
          //横屏状态
          console.log("横屏");
          this.isPortrait = false;
        }
      },
      false
    );
  },
  watch: {
    $route: function(to, from, value) {
      // <---------------------------微信授权逻辑------------------------------->
      let openId = getOpenid();
      let isStart = getStore("mask_isStart");
      if (!openId && window.location.hash.indexOf("oauth") == -1) {
        setStore("BtargetUrl", to.path);
        if (window.location.search.indexOf("?") == -1) {
          this.$router.replace(`/oauth`);
        } else {
          this.$router.replace(`/oauth${window.location.search}`);
        }
      } else if (
        isStart != null &&
        isStart == "false" &&
        to.path != "/result"
      ) {
        //已经答完题，直接进结果页
        this.$router.replace("/result");
      }

      //路由返回/home和/from时，重新配置微信隐藏菜单（防止其它无分享页面返回这两个页面导致这两个页面分享功能失效）
      // if (openId && (to.path === "/home" || to.path === "/form")) {
      //   showMenuItems();
      // }

      // if (to.path === '/answer') {
      //   this.isPlay = true
      // }
    }
  }
};
</script>

<style lang="less" scoped>
#app {
  // 字体抗锯齿渲染
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // 移动端字体设置
  font-family: Helvetica;
  background: #fafafa;
  font-size: 0.35rem;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
  color: #313131;
  .tip {
    background: #666;
    color: #fff;
    height: 100%;
    text-align: center;
    line-height: 16;
  }
}
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}
</style>
