import { getPlayAgainButton, getTimerElement } from './selectors.js'
export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  //random 'count' colors
  for (let i = 0; i < count; i++) {
    // randomColor function is provide by https://github.com/davidmerfield/randomColor
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    })

    colorList.push(color)
  }

  const fullColorList = [...colorList, ...colorList]
  shuffle(fullColorList)

  return fullColorList
}
function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length <= 2) return arr
  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i)

    let tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
}
export function showReplay() {
  const repLayElement = getPlayAgainButton()
  if (!repLayElement) return
  repLayElement.classList.add('show')
}
export function hideReplay() {
  const repLayElement = getPlayAgainButton()
  if (!repLayElement) return
  repLayElement.classList.remove('show')
}
export function setTimerText(text) {
  const timerElement = getTimerElement()
  if (!timerElement) return
  timerElement.textContent = text
}
export function createTimer({ second, onChange, onFinish }) {
  let interValid = null
  function start() {
    clear()
    let currentSecond = second
    interValid = setInterval(() => {
      // if (onChange) onChange(currentSecond)
      onChange?.(currentSecond)
      currentSecond--
      if (currentSecond < 0) {
        clear()
        onFinish?.()
      }
    }, 1000)
  }
  function clear() {
    clearInterval(interValid)
  }
  return {
    start,
    clear,
  }
}
