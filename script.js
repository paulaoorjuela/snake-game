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
let gameSpeed = 10; // Initial speed
let obstacles = [];
let obstacleThreshold = 5; // Start showing obstacles after this score

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

const updateGameSpeed = () => {
    clearInterval(setIntervalId);
    gameSpeed = Math.max(10, 125 - score * 5); // Decrease interval as score increases, min speed = 10ms
    setIntervalId = setInterval(drawGame, gameSpeed);
};

const addObstacles = () => {
    const obstacleX = Math.floor(Math.random() * 30) + 1;
    const obstacleY = Math.floor(Math.random() * 30) + 1;
    obstacles.push([obstacleX, obstacleY]);
};

const getDirectionClass = (velocityX, velocityY) => {
    if (velocityX === 1) return "right";
    if (velocityX === -1) return "left";
    if (velocityY === 1) return "down";
    if (velocityY === -1) return "up";
    return ""; // Default (no movement)
};

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
        if (score % obstacleThreshold === 0) addObstacles(); // Add obstacles at intervals
        updateGameSpeed(); // Adjust game speed on score increase
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
        let segmentClass = i === 0 ? "snake-head" : "snake"; // Head gets 'snake-head', others get 'snake'
        htmlMarkup += `<div class="${segmentClass}" style="grid-area:${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    
        // Check for collisions with the body (game over condition)
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    // Draw obstacles
    obstacles.forEach(([x, y]) => {
        htmlMarkup += `<div class="obstacle" style="grid-area:${y} / ${x}"></div>`;
        if (snakeX === x && snakeY === y) gameOver = true; // End game on obstacle collision
    });

    gameBoard.innerHTML = htmlMarkup
}
changeFoodPosition()
setIntervalId = setInterval(drawGame, 125)

document.addEventListener('keydown', changeDirection)