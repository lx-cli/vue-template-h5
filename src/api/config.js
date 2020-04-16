let BASE_URL = '/api'
if (process.env.NODE_ENV == 'development') {
  BASE_URL = 'https://zmdkouzhaoapi.zmdtech.com.cn/'
} else if(process.env.NODE_ENV == 'production'){
  BASE_URL = 'https://zmdkouzhaoapi.zmdtech.com.cn/'
}

export { BASE_URL }

