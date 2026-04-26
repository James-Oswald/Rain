/**
 * 输入适配层：把“空格键”映射为单击 / 双击 / 长按三种动作。
 * - 非战斗界面：Space 只触发 `onSpaceDown`（推进叙事）
 * - 战斗/选择界面：Space 的 KeyUp 组合成单击/双击；KeyDown+计时触发长按
 *
 * 注意：这里会 `preventDefault()` 防止空格滚动页面。
 */
import { useEffect, useRef } from 'react'

export function useSpaceInput({
  screen,
  onSpaceDown,
  onSingleClick,
  onDoubleClick,
  onLongPress
}) {
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef(null)
  const pressStartRef = useRef(0)
  const longPressRef = useRef(false)
  const longPressTimerRef = useRef(null)
  const isPressingRef = useRef(false)

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code !== 'Space') return
      if (e.repeat) return

      e.preventDefault()

      if (screen !== 'game' && screen !== 'defeatChoice') {
        onSpaceDown()
        return
      }

      pressStartRef.current = Date.now()
      longPressRef.current = false
      isPressingRef.current = true

      clearTimeout(longPressTimerRef.current)

      longPressTimerRef.current = setTimeout(() => {
        if (isPressingRef.current) {
          longPressRef.current = true
          onLongPress()
        }
      }, 600)
    }

    function handleKeyUp(e) {
      if (e.code !== 'Space') return
      e.preventDefault()

      if (screen !== 'game' && screen !== 'defeatChoice') return

      isPressingRef.current = false
      clearTimeout(longPressTimerRef.current)

      const pressDuration = Date.now() - pressStartRef.current
      if (pressDuration >= 600 || longPressRef.current) return

      clickCountRef.current += 1
      clearTimeout(clickTimerRef.current)

      clickTimerRef.current = setTimeout(() => {
        const count = clickCountRef.current

        if (count === 1) onSingleClick()
        if (count === 2) onDoubleClick()

        clickCountRef.current = 0
      }, 260)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      clearTimeout(clickTimerRef.current)
      clearTimeout(longPressTimerRef.current)
    }
  }, [screen, onSpaceDown, onSingleClick, onDoubleClick, onLongPress])
}
