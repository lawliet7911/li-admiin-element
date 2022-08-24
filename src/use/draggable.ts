import {
  MaybeComputedRef,
  resolveUnref,
  useEventListener,
} from "@vueuse/core"
import { computed, ref } from "vue"

export interface Position {
  x: number
  y: number
}

export function useMyDraggable(
  target: MaybeComputedRef<HTMLElement | SVGElement | null | undefined>,
  options: any = {}
) {
  const draggingElement =
    options.draggingElement ??  window

  const position = ref<Position>(
    resolveUnref(options.initialValue) ?? { x: 0, y: 0 }
  )
  const pressedDelta = ref<any>()

  const filterEvent = (e: PointerEvent) => {
    if (options.pointerTypes)
      return options.pointerTypes.includes(e.pointerType as any)
    return true
  }

  const handleEvent = (e: PointerEvent) => {
    if (resolveUnref(options.preventDefault)) e.preventDefault()
    if (resolveUnref(options.stopPropagation)) e.stopPropagation()
  }

  const start = (e: PointerEvent) => {
    if (!filterEvent(e)) return
    if (resolveUnref(options.exact) && e.target !== resolveUnref(target)) return
    const rect = resolveUnref(target)!.getBoundingClientRect()
    const pos = {
      x: e.pageX - rect.left,
      y: e.pageY - rect.top,
    }
    if (options.onStart?.(pos, e) === false) return
    pressedDelta.value = pos
    handleEvent(e)
  }
  const move = (e: PointerEvent) => {
    if (!filterEvent(e)) return
    if (!pressedDelta.value) return
    position.value = {
      x: e.pageX - pressedDelta.value.x,
      y: e.pageY - pressedDelta.value.y,
    }
    options.onMove?.(position.value, e)
    handleEvent(e)
  }
  const end = (e: PointerEvent) => {
    if (!filterEvent(e)) return
    if (!pressedDelta.value) return
    pressedDelta.value = undefined
    options.onEnd?.(position.value, e)
    handleEvent(e)
  }

  useEventListener(target, "pointerdown", start, true)
  useEventListener(draggingElement, "pointermove", move, true)
  useEventListener(draggingElement, "pointerup", end, true)

  return {
    x: ref(position.value.x),
    y: ref(position.value.y),
    position,
    isDragging: computed(() => !!pressedDelta.value),
    style: computed(
      () => `left:${position.value.x}px;top:${position.value.y}px;`
    ),
  }
}

export type UseDraggableReturn = ReturnType<typeof useMyDraggable>