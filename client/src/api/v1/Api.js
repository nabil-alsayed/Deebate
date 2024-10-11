import axios from 'axios'
// import * as config from '@/api/v1/apiConfig'


export const Api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3001/api/v1'
})

// export const Api = axios.create({
//   baseURL: `${config.BASE_URL}:${config.PORT}/api/v${config.VERSION}`
// })
