import ajax from './ajax'

/**微信授权地址 */
export const reqOAuthUrl = (activityId,oauthUrl) => ajax('weixin/oauthUrl', {activityId,oauthUrl})
/**获取微信授权 */
export const reqWeChatOAuth = (activityId,code) => ajax('weixin/weChatOAuth', {activityId,code})
/**获取微信签名 */
export const reqGetSignature = (activityId,oauthUrl) => ajax('weixin/getSignature', {activityId,oauthUrl})

export default {
  reqOAuthUrl,
  reqWeChatOAuth,
  reqGetSignature
}
