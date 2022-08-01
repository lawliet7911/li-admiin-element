<script lang="ts" setup>
import { Ref } from 'vue';
import { HeaderBtnOption } from '~/types/index';

const props = defineProps({
  option: Object
})

let iconCom = computed(() => {
  return (flag: boolean | Ref<boolean> | undefined, components: any[]) => {
    if (!components) return ''
    if (flag === undefined) return components[0]
    let fg: Ref<boolean> = isRef(flag) ? flag as Ref<boolean> : ref(flag);
    return toRaw(fg.value ? components[1] : components[0])
  }
})
</script>
<template>
  <div class="fn-icon cursor-pointer" @click="((props.option as HeaderBtnOption).trigger as any)">
    <component :is="iconCom((props.option as HeaderBtnOption).switch, (props.option as HeaderBtnOption).icon)">
    </component>
  </div>
</template>
<style lang="scss" scoped>
.fn-icon {
  font-size: 14px;
  color: var(--el-text-color-primary)
}
</style>