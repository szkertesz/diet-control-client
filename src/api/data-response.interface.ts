export interface IFoodItem {
  _id: string
  name: string
  energy: number
  protein: number
  fat: number
  ch: number
  note: string
}

interface INutriData {
  energy: number
  protein: number
  fat: number
  ch: number
}
export interface IDateData {
  _id: string
  date: string
  meals: {
    name: string
    foodItems: (IFoodItem & { qty: number })[]
    sum: INutriData
  }[]
  sum: INutriData
}

export interface IDataResponse {
  status: 'OK' | 'FAILED'
  data: IDateData[]
}
