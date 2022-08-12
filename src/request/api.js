import axios from 'axios'
export const service = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 60000 // request timeout
})
