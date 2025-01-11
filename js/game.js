const gameState = {
    playerName: '',
    score: 0,
    timeLeft: 200,
    currentLevel: 1,
    records: JSON.parse(localStorage.getItem('gameRecords')) || [],
};

document.getElementById('start-game').addEventListener('click', () => {
    const playerName = document.getElementById('player-name').value.trim();
    if (!playerName) {
        alert('Введите ваше имя!');
        return;
    }
    gameState.playerName = playerName;
    gameState.score = 0;
    gameState.timeLeft = 200;
    localStorage.setItem('playerName', playerName);
    localStorage.setItem('score', 0);
    localStorage.setItem('timeLeft', 200);
    startGame(1);
});

const startGame = (level) => {
    gameState.currentLevel = level;
    window.location.href = `level${level}.html`;
};

const startTimer = (updateCallback, endCallback) => {
    const timerInterval = setInterval(() => {
        if (gameState.timeLeft <= 0) {
            clearInterval(timerInterval);
            endCallback();
        } else {
            gameState.timeLeft--;
            updateCallback(gameState.timeLeft);
        }
    }, 1000);
    return timerInterval;
};

const saveRecord = () => {
    const newRecord = { name: gameState.playerName, score: gameState.score };
    gameState.records.push(newRecord);
    gameState.records.sort((a, b) => b.score - a.score);
    localStorage.setItem('gameRecords', JSON.stringify(gameState.records));
};

const showFeedback = (isCorrect, callback) => {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = isCorrect ? 'Правильно!' : 'Неправильно!';
    feedbackElement.style.color = isCorrect ? 'green' : 'red';

    setTimeout(() => {
        feedbackElement.textContent = '';
        callback();
    }, 2000);
};
