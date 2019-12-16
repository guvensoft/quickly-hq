export interface User {
  name: string,
  role: string,
  role_id: string,
  pincode: number,
  status: number,
  timestamp: number,
  _id?: string,
  _rev?: string
}
export interface UserGroup {
  name: string,
  description: string,
  auth: UserAuth,
  status: number,
  timestamp: number,
  _id?: string,
  _rev?: string
}
export interface UserAuth {
  components: ComponentsAuth,
  cancelCheck: boolean,
  cancelProduct: boolean,
  discount: boolean,
  payment: boolean,
  end: boolean,
}
export interface ComponentsAuth {
  store: boolean,
  cashbox: boolean,
  endoftheday: boolean,
  reports: boolean,
  settings: boolean
}