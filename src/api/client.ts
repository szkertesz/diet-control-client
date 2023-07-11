import axios, { AxiosRequestConfig } from 'axios'
import { IResponseData } from './client.interface'

// base axios instance
export const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'content-type': 'application/json',
  },
})

// a small API for client requests
export const clientRequest = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await client(config)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getData = async (url = '/'): Promise<IResponseData[]> => {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url,
    transformResponse: [
      function (data) {
        return data
      },
    ],
  }

  return await clientRequest<IResponseData[]>(config)
}

export const postData = async (
  url = '/',
  body = {}
): Promise<IResponseData[]> => {
  const config: AxiosRequestConfig = {
    method: 'POST',
    url,
    data: body,
    transformResponse: [
      function (data) {
        return data
      },
    ],
  }

  return await clientRequest<IResponseData[]>(config)
}
