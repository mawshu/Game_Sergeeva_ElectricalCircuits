document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        { question: 'Какое сопротивление (в Омах) имеет проводник, если ток через него равен 2 А, а напряжение 10 В?', correct: '5' },
        { question: 'Сколько концов у проводника?', correct: '2' },
        { question: 'Сколько выводов у батарейки?', correct: '2' },
        { question: 'Какое напряжение создают две батарейки по 1,5 В каждая, соединенные последовательно?', correct: '3' },
        { question: 'Сколько проводов нужно для подключения двух лампочек в параллельной цепи?', correct: '4' },
    ];

    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const questionElement = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const submitButton = document.getElementById('submit');
    const nextButton = document.getElementById('nextQuestion');

    let score = parseInt(localStorage.getItem('score')) || 0;
    let timeLeft = parseInt(localStorage.getItem('timeLeft')) || 60;
    let currentQuestionIndex = 0;
    let isPaused = false;

    timerElement.textContent = `Время: ${timeLeft}`;
    scoreElement.textContent = `Очки: ${score}`;

    function getRandomQuestions(arr, count) {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    const selectedQuestions = getRandomQuestions(questions, 3);

    const timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timerElement.textContent = `Время: ${timeLeft}`;
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            localStorage.setItem('score', score);
            alert('Время вышло! Переход на страницу с рекордами.');
            window.location.href = 'records.html';
        }
    }, 1000);

    function showQuestion() {
        if (currentQuestionIndex >= selectedQuestions.length) {
            clearInterval(timer);
            localStorage.setItem('score', score);
            localStorage.setItem('timeLeft', timeLeft);
            window.location.href = 'level3.html';
            return;
        }

        const questionData = selectedQuestions[currentQuestionIndex];
        questionElement.textContent = questionData.question;
        answerInput.value = '';
    }

    function handleAnswer() {
        if (isPaused) return;

        const userAnswer = answerInput.value.trim();
        const correctAnswer = selectedQuestions[currentQuestionIndex].correct;

        if (userAnswer === correctAnswer) {
            score += 20;
            scoreElement.textContent = `Очки: ${score}`;
            scoreElement.style.color = 'green';
            answerInput.style.border = '2px solid green';
        } else {
            score -= 10;
            scoreElement.textContent = `Очки: ${score}`;
            scoreElement.style.color = 'red';
            answerInput.style.border = '2px solid red';
        }

        isPaused = true;
        nextButton.disabled = false;
    }

    nextButton.addEventListener('click', () => {
        isPaused = false;
        scoreElement.style.color = '';
        answerInput.style.border = '';
        nextButton.disabled = true;

        currentQuestionIndex++;
        showQuestion();
    });

    submitButton.addEventListener('click', handleAnswer);
    showQuestion();
});
