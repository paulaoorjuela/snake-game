const gameBoard = document.querySelector('.game-board');
const scoreBoard = document.querySelector('.score');
const highScoreBoard = document.querySelector('.high-score');
const controls = document.querySelectorAll('.controls i');

let score = 0
let highScore = localStorage.getItem('highScore') || 0;
highScoreBoard.innerHTML = `High Score: ${highScore}`

let gameOver = false
let foodX, foodY
let snakeX = 5, snakeY = 10
let snakeBody = []
let velocityX = 0, velocityY = 0
let setIntervalId


const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1
    foodY = Math.floor(Math.random() * 30) + 1
}

const handleGameOver = () => {
    clearInterval(setIntervalId)
    alert('Game Over!')
    location.reload()
}

const changeDirection = (event) => {
    if (event.key === 'ArrowUp' && velocityY != 1) {
        velocityX = 0
        velocityY = -1
    } else if (event.key === 'ArrowDown' && velocityY != -1) {
        velocityX = 0
        velocityY = 1
    } else if (event.key === 'ArrowLeft' && velocityX != 1) {
        velocityX = -1
        velocityY = 0
    } else if (event.key === 'ArrowRight' && velocityX != -1) {
        velocityX = 1
        velocityY = 0
    }
}

controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}))
})

const drawGame = () => {
    if (gameOver) return handleGameOver()
    let htmlMarkup = `<div class="food" style="grid-area:${foodY} / ${foodX}"></div>`
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition()
        snakeBody.push([foodX, foodY])
        score ++
        highScore = Math.max(highScore, score)
        localStorage.setItem('highScore', highScore)
        scoreBoard.innerHTML = `Score: ${score}`
        highScoreBoard.innerHTML = `High Score: ${highScore}`
    }

    for (let i = snakeBody.length -1; i > 0 ; i--) {
        snakeBody[i] = snakeBody[i - 1]
        
    }

    snakeBody[0] = [snakeX, snakeY] 

    snakeX += velocityX
    snakeY += velocityY

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true
        return
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="snake-head" style="grid-area:${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true
        }
    }

    gameBoard.innerHTML = htmlMarkup
}
changeFoodPosition()
setIntervalId = setInterval(drawGame, 125)

document.addEventListener('keydown', changeDirection)