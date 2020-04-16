import ajax from './ajax'

/**测试 */
export const reqTest = test => ajax('api/test', { test })

export default {
  reqTest
}
