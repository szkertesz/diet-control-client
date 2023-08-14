import axios, { AxiosRequestConfig } from 'axios'
import { IDateData, IDataResponse, IFoodItem } from './data-response.interface'

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

export const getData = async (
  url = '/'
): Promise<IDateData[] | IFoodItem[]> => {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url,
    transformResponse: [
      function (data) {
        const json = JSON.parse(data)
        data = json.data
        return data
      },
    ],
  }

  return await clientRequest<IDateData[] | IFoodItem[]>(config)
}

export const postData = async (
  url = '/',
  body = {}
): Promise<IDataResponse> => {
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

  return await clientRequest<IDataResponse>(config)
}

export const deleteData = async (url = '/'): Promise<IDataResponse> => {
  const config: AxiosRequestConfig = {
    method: 'DELETE',
    url,
    transformResponse: [
      function (data) {
        return data
      },
    ],
  }

  return await clientRequest<IDataResponse>(config)
}
