document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        { question: 'Какой компонент накапливает заряд?', options: ['Конденсатор', 'Резистор', 'Лампа'], correct: 0 },
        { question: 'Какой компонент управляет током?', options: ['Реле', 'Выключатель', 'Лампа'], correct: 1 },
        { question: 'Что показывает вольтметр в электрической цепи?', options: ['Силу тока', 'Напряжение', 'Сопротивление'], correct: 1 },
        { question: 'Как называется устройство для измерения силы тока?', options: ['Амперметр', 'Вольтметр', 'Омметр'], correct: 0 },
        { question: 'Какое устройство защищает цепь от перегрузок?', options: ['Выключатель', 'Плавкий предохранитель', 'Лампа'], correct: 1 },
    ];

    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const nextButton = document.getElementById('nextQuestion');

    let score = parseInt(localStorage.getItem('score')) || 0;
    let timeLeft = parseInt(localStorage.getItem('timeLeft')) || 60;
    let currentQuestionIndex = 0;
    let selectedOptionIndex = 0; 
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
            alert('Время вышло! Переход на страницу с рекордами.');
            localStorage.setItem('score', score);
            window.location.href = 'records.html';
        }
    }, 1000);

    function showQuestion() {
        if (currentQuestionIndex >= selectedQuestions.length) {
            clearInterval(timer);
            localStorage.setItem('score', score);
            localStorage.setItem('timeLeft', timeLeft);
            window.location.href = 'level2.html';
            return;
        }

        const questionData = selectedQuestions[currentQuestionIndex];
        questionElement.textContent = questionData.question;

        optionsElement.innerHTML = '';
        questionData.options.forEach((option, index) => {
            const button = document.createElement('div');
            button.textContent = option;
            button.classList.add('option');
            if (index === selectedOptionIndex) button.classList.add('selected');
            optionsElement.appendChild(button);
        });
    }

    function handleAnswer() {
        if (isPaused) return;

        const correctIndex = selectedQuestions[currentQuestionIndex].correct;
        const options = optionsElement.children;
        const selectedOption = options[selectedOptionIndex];
        const correctOption = options[correctIndex];

        if (selectedOptionIndex === correctIndex) {
            score += 10;
            scoreElement.textContent = `Очки: ${score}`;
            scoreElement.style.color = 'green';
        } else {
            score -= 5;
            scoreElement.textContent = `Очки: ${score}`;
            scoreElement.style.color = 'red';
        }

        selectedOption.style.border = '2px solid red';
        correctOption.style.border = '2px solid green';
        isPaused = true;

        nextButton.disabled = false;
    }

    function handleKeyDown(event) {
        if (isPaused) return;

        const options = optionsElement.children;

        if ((event.key === 'ArrowRight') || (event.key === 'ArrowDown')){
            selectedOptionIndex = (selectedOptionIndex + 1) % options.length;
        } else if ((event.key === 'ArrowLeft') || (event.key === 'ArrowUp')) {
            selectedOptionIndex = (selectedOptionIndex - 1 + options.length) % options.length;
        } else if (event.key === 'Enter') {
            handleAnswer();
            return;
        }

        Array.from(options).forEach((option, index) => {
            option.classList.toggle('selected', index === selectedOptionIndex);
        });
    }

    nextButton.addEventListener('click', () => {
        isPaused = false;
        scoreElement.style.color = '';
        nextButton.disabled = true;

        const options = document.querySelectorAll('.option');
        options.forEach((option) => {
            option.style.border = '';
        });

        currentQuestionIndex++;
        selectedOptionIndex = 0; 
        showQuestion();
    });

    document.addEventListener('keydown', handleKeyDown);
    showQuestion();
});
