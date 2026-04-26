/**
 * 打字机效果：当 active=true 时按速度逐字渲染 text。
 * 提供 skipText（立刻显示全文）与 resetTypewriter（清空并从头开始）。
 */
import { useEffect, useState } from 'react'

export function useTypewriter({ text, active, speed = 50 }) {
  const [displayText, setDisplayText] = useState('')
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    setDisplayText('')
    setCharIndex(0)
  }, [text])

  useEffect(() => {
    if (!active) return
    if (charIndex >= text.length) return

    const timer = setTimeout(() => {
      setDisplayText((prev) => prev + text[charIndex])
      setCharIndex((prev) => prev + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [active, charIndex, speed, text])

  function skipText() {
    setDisplayText(text)
    setCharIndex(text.length)
  }

  function resetTypewriter() {
    setDisplayText('')
    setCharIndex(0)
  }

  return { displayText, skipText, resetTypewriter }
}
