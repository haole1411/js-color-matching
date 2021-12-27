import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getColorElementList,
  getColorListElement,
  getInActiveColorList,
  getPlayAgainButton,
} from './selectors.js'
import { createTimer, getRandomColorPairs, hideReplay, setTimerText, showReplay } from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
  second: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})
function handleTimerChange(second) {
  const fullSecond = `0${second}`.slice(-2)
  setTimerText(fullSecond)
}
function handleTimerFinish() {
  //end game
  gameStatus = GAME_STATUS.FINISHED
  setTimerText('Game Over')
}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click
console.log(getRandomColorPairs(PAIRS_COUNT))

function initColor() {
  //random 8 pair of color
  const colorList = getRandomColorPairs(PAIRS_COUNT)
  //bind to li > div.overlay
  const liList = getColorElementList()
  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index]
    const overlayElement = liElement.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
  })
}
function attachEventForColorList() {
  const ulElement = getColorListElement()
  if (!ulElement) return
  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return
    handleColorList(event.target)
  })
}

//handleColorCLick 1
//handleColorCLick 2
//handleColorCLick 3
//setTImeout 2 --> reset selec
//setTImeout 3 --> error here

function handleColorList(liElement) {
  const shouldBlockCLick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  const isCLick = liElement.classList.contains('active')
  if (!liElement || isCLick || shouldBlockCLick) return
  liElement.classList.add('active')
  // save clicked cell to selection
  selections.push(liElement)

  if (selections.length < 2) {
    return
  }

  //check math
  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color

  const isMatch = firstColor === secondColor
  if (isMatch) {
    //check win
    const isWin = getInActiveColorList().length === 0
    if (isWin) {
      //show replay
      showReplay()
      //show you win
      setTimerText('You Win !!!!')
      timer.clear()

      gameStatus = GAME_STATUS.FINISHED
    }

    selections = []
    return
  }
  //in case of not match
  //remove active for 2 li element
  gameStatus = GAME_STATUS.BLOCKING
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    selections = []
    //race conditino check with handleTImeeFinish
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 500)
  //reset
}

function resetGame() {
  //reset  global var
  gameStatus = GAME_STATUS.PLAYING
  selections = []
  // reset DOM element
  //remove active class form li
  // hide replay btt
  // clear you win text
  const colorElementList = getColorElementList()
  for (const colorElement of colorElementList) {
    colorElement.classList.remove('active')
  }
  hideReplay()
  setTimerText('')

  // re-generate colorList
  initColor()

  //start new Game
  startTimer()
}

function attachEventReplayButton() {
  const playAgainButton = getPlayAgainButton()
  if (!playAgainButton) return
  playAgainButton.addEventListener('click', resetGame)
}

function startTimer() {
  timer.start()
}
;(() => {
  initColor()

  attachEventForColorList()

  attachEventReplayButton()

  startTimer()
})()
