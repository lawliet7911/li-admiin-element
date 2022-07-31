import { defineStore } from "pinia"
import { useLiStorage } from "~/utils/shared"

export const useUserState = defineStore("user", {
  state: () => {
    return {
      user: useLiStorage.get("user") || {},
    }
  },
  actions: {
    setUser(data: object) {
      this.user = data
    },
    logout() {
      useLiStorage.remove("user")
      this.user = {}
    },
  },
})
