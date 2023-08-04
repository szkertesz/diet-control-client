interface IFoodItemFull {
  _id: string
  qty: number
  name: string
  energy: number
  protein: number
  fat: number
  ch: number
  note: string
}
interface IFoodItemPartial {
  _id: string
  qty: number
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
    foodItems: IFoodItemFull[] | IFoodItemPartial
    sum: INutriData
  }[]
  sum: INutriData
}

export interface IDataResponse {
  status: 'OK' | 'FAILED'
  data: IDateData[]
}
