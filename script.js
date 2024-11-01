const output = document.getElementById("output");
const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");
const gameArea = document.getElementById("game-area");
const frequencySlider = document.getElementById("frequency-slider");
const frequencyLabel = document.getElementById("frequency-label");

let topPosition = 0;
let score = 0;
let gameInterval;
let redBlocks = [];
let backgroundPosition = 0;

function createRedBlock(left, top) {
    const redBlock = document.createElement('div');
    redBlock.className = 'red-block';
    redBlock.style.left = left + 'px';
    redBlock.style.top = top + 'px';
    gameArea.appendChild(redBlock);
    redBlocks.push(redBlock);
}

function checkCollision() {
    const outputRect = output.getBoundingClientRect();
    for (const redBlock of redBlocks) {
        const redRect = redBlock.getBoundingClientRect();
        if (!(outputRect.right < redRect.left || 
              outputRect.left > redRect.right || 
              outputRect.bottom < redRect.top || 
              outputRect.top > redRect.bottom)) {
            endGame();
        }
    }
}

function endGame() {
    clearInterval(gameInterval);
    alert('Game Over! Your score is: ' + score);
    score = 0;
    scoreDisplay.innerText = 'Score: 0';
    topPosition = window.innerHeight / 2;
    output.style.top = topPosition + 'px';
    redBlocks.forEach(block => block.remove());
    redBlocks = [];
}

function animate() {
    topPosition = window.innerHeight / 2;

    output.style.top = topPosition + "px";

    gameInterval = setInterval(function() {
        redBlocks.forEach(block => {
            const left = parseInt(block.style.left) - 40;
            if (left < -block.offsetWidth) {
                block.remove();
            } else {
                block.style.left = left + "px";
            }
        });

        redBlocks = redBlocks.filter(block => block.parentNode);

        score++;
        scoreDisplay.innerText = 'Score: ' + score;

        const frequency = frequencySlider.value;
        if (score % (11 - frequency) === 0) {
            createRedBlock(window.innerWidth, Math.random() * (window.innerHeight - 60));
        }
        checkCollision();
    }, 200);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowUp') {
            topPosition -= 20;
            output.style.top = topPosition + "px";
        } else if (event.key === 'ArrowDown') {
            topPosition += 20;
            output.style.top = topPosition + "px";
        }
        checkCollision();
    });
}

frequencySlider.oninput = function() {
    frequencyLabel.innerText = 'Frequency: ' + frequencySlider.value;
}
startBtn.onclick = animate;