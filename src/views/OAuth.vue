<template>
  <div></div>
</template>
<script>
import { getParams, setOpenid, getStore, removeStore, setStore } from "../utils/utils";
export default {
  data() {
    return {
      urlParam: getParams()
    };
  },
  mounted() {
    //地址栏有openid
    if(this.urlParam.code){
      this.getInfo();//获取信息
    }
    //地址栏没有openid
    else{
      this.goOAuth();//前往授权
    }
  },
  methods: {
    //前往授权
    async goOAuth(){
      const res = await this.$api.reqOAuthUrl(1,window.location.href)
      window.location.replace(res)//授权成功后重定向页面，获取code
    },
    //获取信息
    async getInfo() {
      const res = await this.$api.reqWeChatOAuth(1,this.urlParam.code)
      setOpenid(res.openId)
      setStore('nickName',res.nickName)
      const targetUrl = window.location.origin + window.location.pathname + '#' + getStore('BtargetUrl') //返回之前授权的页面
      window.location.replace(targetUrl)
      removeStore('BtargetUrl')// 页面replace后，移除localStorage里面的BtargetUrl缓存
    }
  }
};
</script>
