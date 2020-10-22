import axios from "axios"

const baseURL =
  process.env.NODE_ENV === "development"
    ? `${process.env.REACT_APP_DEV_URL}/api/v1`
    : `${process.env.REACT_APP_PROD_URL}/api/v1`

const http = axios.create({
  baseURL,
})

http.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem("token")

  return config
})

http.interceptors.response.use((response) => response?.data)

export default http
