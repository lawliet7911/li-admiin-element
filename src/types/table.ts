export type simpleTableColumn = {
  label: string
  prop: string
  visible: boolean
  width?: string | number
  minWidth?: string | number
  fixed? : true | 'left' | 'right'
  type?: 'selection' | 'index' | 'expand'
  formatter?: Function
  align?: 'left' | 'right' | 'center'
}