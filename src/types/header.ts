import { Ref } from "vue"

export interface HeaderBtnOption {
  name: string
  tooltip: boolean
  tip: Ref<string> | string | undefined
  placement: string
  icon: any[]
  switch?: Ref<boolean> | boolean | undefined
  trigger: Function
}
