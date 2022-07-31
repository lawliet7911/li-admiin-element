type storeValue = string | number | bigint | object | Date | Array<any>
export const useLiStorage = {
  /**
   * 存
   * @param key 存取的localStorage的键
   * @param value 要存储的值
   * @param expTime 过期时间 单位：小时
   */
  set(key: string, value: any, expTime = 0): void {
    let type = plainType(value)
    if (["function", "symbol", "regexp", "error"].includes(type)) {
      console.warn(`can't store ${key} value type:[${type}]`)
      return
    }
    let save = {
      type: type,
      data: value,
    }
    localStorage.setItem(key, JSON.stringify(save))
    if (expTime > 0) {
      localStorage.setItem(
        key + "-expTime",
        new Date()
          .setHours(parseInt(new Date().getHours().toString()) + expTime)
          .toString()
      )
    }
  },
  get(key: string): storeValue {
    let data: string = localStorage.getItem(key) || ""
    if (!data.length) return ""
    let re
    try {
      re = JSON.parse(data)
    } catch (error) {
      re = data
    } finally {
      if (!re.type) return ""
      if (["string", "object"].includes(re.type)) return re.data
      if (re.type === "number") {
        if (re.data.includes(".")) return parseFloat(re.data)
      }
      if (re.type === "array") return re.data.split(",")
      if (re.type === "bigint") return BigInt(re.data)
      if (re.type === "date") return new Date(re.data)
      return ""
    }
  },
  remove(key: string) {
    localStorage.removeItem(key)
    localStorage.removeItem(key + "-expTime")
  },
}

export const isObject = (value: any): boolean => {
  return typeof value == "object" && value !== null
}

export const plainType = (target: any): string => {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
}

export const __IS_DEV__: boolean = true

export const warn: Function = __IS_DEV__ ? console.warn : () => {}

export const toPureString = (target: any) => {
  let type = plainType(target)
  let typeString = ["string", "number"].includes(type)
  if (typeString) return type.toString()
  let typeRAWObject = ["object", "array"].includes(type)
  if (typeRAWObject) return JSON.stringify(target)
}
