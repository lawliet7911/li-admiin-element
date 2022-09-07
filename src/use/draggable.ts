import { MaybeComputedRef, resolveUnref, useEventListener } from "@vueuse/core"
import { computed, ref } from "vue"

export interface Position {
  x: number
  y: number
}

export function useMyDraggable(
  target: MaybeComputedRef<HTMLElement | SVGElement | null | undefined>,
  options: any = {}
) {
  const position = ref<Position>(
    resolveUnref(options.initialValue) ?? { x: 0, y: 0 }
  )
  const filterEvent = (e: PointerEvent) => {
    if (options.pointerTypes)
      return options.pointerTypes.includes(e.pointerType as any)
    return true
  }

  const handleEvent = (e: PointerEvent) => {
    if (resolveUnref(options.preventDefault)) e.preventDefault()
    if (resolveUnref(options.stopPropagation)) e.stopPropagation()
  }

  let isDragging = false

  const pointerStartPosition = ref<Position>({
    x: 0,
    y: 0,
  })

  const dragElementStartPosition = ref<Position>({
    x: 0,
    y: 0,
  })

  // let dragFlag = false
  const start = (e: PointerEvent) => {
    if (!filterEvent(e)) return
    if (resolveUnref(options.exact) && e.target !== resolveUnref(target)) return
    isDragging = true
    pointerStartPosition.value = {
      x: e.clientX,
      y: e.clientY,
    }
    // get dragElement position when start drag
    dragElementStartPosition.value = {
      x: (resolveUnref(target) as HTMLElement).offsetLeft,
      y: (resolveUnref(target) as HTMLElement).offsetTop,
    }
    handleEvent(e)
  }

  const move = (e: PointerEvent) => {
    if (!filterEvent(e)) return
    if (isDragging) {
      position.value = {
        x:
          dragElementStartPosition.value.x +
          e.pageX -
          pointerStartPosition.value.x,
        y:
          dragElementStartPosition.value.y +
          e.pageY -
          pointerStartPosition.value.y,
      }
    }
    options.onMove?.(position.value, e)
    handleEvent(e)
  }

  const end = (e: PointerEvent) => {
    if (!filterEvent(e)) return
    isDragging = false
    options.onEnd?.(position.value, e)
    handleEvent(e)
  }

  useEventListener(target, "pointerdown", start, true)
  useEventListener(target, "pointermove", move, true)
  useEventListener(target, "pointerup", end, true)
  return {
    x: ref(position.value.x),
    y: ref(position.value.y),
    position,
    isDragging: ref(isDragging),
    style: computed(
      () => `left:${position.value.x}px;top:${position.value.y}px;`
    ),
  }
}

export type UseDraggableReturn = ReturnType<typeof useMyDraggable>
