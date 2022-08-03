
export const useConfigState = defineStore("config", {
  state: () => {
    return {
      menuCollapse: false,
      isDark: useDark()
    }
  },
  actions: {
    toggleCollapse() {
      this.menuCollapse= !this.menuCollapse;
    },
  },
})
