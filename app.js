const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const startBtn = document.querySelector('#start_button')
const width = 10
let nextRandom = 0
let timerId = 0
let lineSound = new Audio('http://www.utc.fr/si28/ProjetsUpload/P2006_si28p004/flash_puzzle/sons/rush/mush-up.wav')
let overSound = new Audio('http://www.mario-museum.net/sons/smb_gameover.wav')
let score = 0;

const colors = [
    '#FF9933',
    '#FF355E',
    '#FF00CC',
    '#66FF66',
    '#50BFE6',
]

let isGameOver = false


function createDivs (){
    for (let i = 0; i < 210; i++) {
        let element = document.createElement('div');
        if (i >= 200) {
            element.classList.add('taken');
        }
        grid.appendChild(element);
}}

createDivs()

let squares = Array.from(document.querySelectorAll('.grid div'))
let takenSquares = squares.slice(-10);

//the Tetrominoes
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [0, 1, 2, width+2],
    [1, width+1, width*2+1, width*2],
    [0, width, width+1, width+2]
]

const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
]

const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
]

const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
]

const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

let currentPosition = 4
let currentRotation = 0

// randomly select a tetromino and its first rotation
let random = Math.floor(Math.random()*theTetrominoes.length)
let current = theTetrominoes[random][currentRotation]

//draw the first rotation in a random tetrmoino
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[random]

    })
}

draw()

function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ""

    })
}


//assing function to keyCodes
function control(e) {
    if(e.keyCode === 37){
        moveLeft()
    }else if (e.keyCode === 38){
        rotate()
    }else if (e.keyCode === 39){
        moveRight()
    }else if (e.keyCode === 40){
        moveDown()
    }
}
document.addEventListener('keydown', control)

//moveDown

function moveDown() {
    if(isGameOver === false){
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

}

function freeze () {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //start a new tetromino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
    }
}

function moveLeft() {
    if(isGameOver === false) {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    
        if(!isAtLeftEdge) currentPosition -= 1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1
        }
        draw()
    }
}

function moveRight() {
    if (isGameOver === false) {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    
        if(!isAtRightEdge) currentPosition += 1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1
        }
        draw()  
    }
}

//rotate the tetromino
function rotate() {
    if(isGameOver === false){
        undraw()
        currentRotation ++
        if(currentRotation === current.length) { //if current rotation gets to 4, then return to 0.
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }
}


//show up-next tetromino in mini-grid display
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0


//the Tetrominos without rotations
const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
]

//display the shape in the mini-grid display
function displayShape() {
//remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]

})
}

//add functionality to the button
startBtn.addEventListener('click', () => {
    if (isGameOver === true) {
        clearBlocks()
        document.querySelector('#gameOver').style.display = "none"
        startBtn.innerHTML = "Pause"
        isGameOver = false
        score = 0
        scoreDisplay.innerHTML = score
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        displayShape()
    } else if (timerId) {
        clearInterval(timerId)
        timerId = ''
        startBtn.innerHTML = "Start"
    } else {
        startBtn.innerHTML = "Pause"
        document.querySelector('#gameOver').style.display = "none"
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        displayShape()
    }
  })

//add score
function addScore() {
    for (let i=0; i < 199; i += width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        // check if every div in a row is taken
        if (row.every(index => squares[index].classList.contains('taken'))){
            //if so update the score and remove the taken close and tetromino class from each div
            score += 10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
        //then take the removed squares and then append them to the existing squares to restore the grid
        const squaresRemoved = squares.splice(i, width)
        console.log(squaresRemoved.length)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
        //play sound on line clear
        lineSound.play()
        }
    }
}


function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        document.querySelector('#gameOver').style.display = "block"
        clearInterval(timerId)
        isGameOver = true
        overSound.play()
        startBtn.innerHTML = "Replay"
    }
}

function clearBlocks() {
    squares.forEach(square => {
        square.classList.remove('tetromino')
        square.classList.remove('taken')
        square.style.backgroundColor = ''
    })
    takenSquares.forEach(square => {
        square.classList.add('taken')
    })
}
