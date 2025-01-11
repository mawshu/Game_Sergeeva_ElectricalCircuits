document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            instructionImage: 'pics/instruction1.png',
            image: 'pics/field.png',
            correctPlacement: {
                slot1: 'switch',
                slot2: 'ammeter',
                slot3: 'bulb',
            },
            slotPositions: {
                slot1: { top: '30%', left: '9%' },
                slot2: { top: '65%', left: '39%' },
                slot3: { top: '30%', left: '72%' },
            },
        },
        {
            instructionImage: 'pics/instruction2.png',
            image: 'pics/field.png',
            correctPlacement: {
                slot1: 'switch',
                slot2: 'bulb',
                slot3: 'ammeter',
            },
            slotPositions: {
                slot1: { top: '30%', left: '9%' },
                slot2: { top: '65%', left: '39%' },
                slot3: { top: '30%', left: '72%' },
            },
        },
        {
            instructionImage: 'pics/instruction4.png',
            image: 'pics/field2.png',
            correctPlacement: {
                slot1: 'bulb',
                slot2: 'ammeter',
                slot3: 'switch',
            },
            slotPositions: {
                slot2: { top: '20%', left: '72%' },
                slot1: { top: '80%', left: '38%' },
                slot3: { top: '50%', left: '72%' },
            },
        },
    ];

    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const questionImage = document.getElementById('questionImage');
    const instructionImageElement = document.getElementById('instructionImage');
    const checkCircuitButton = document.getElementById('checkCircuit');
    const nextButton = document.getElementById('nextQuestion');
    const dropzones = document.querySelectorAll('.dropzone');
    const draggableElements = document.querySelectorAll('.draggable');

    let score = parseInt(localStorage.getItem('score')) || 0;
    let timeLeft = parseInt(localStorage.getItem('timeLeft')) || 60;
    let currentQuestionIndex = 0;
    let isPaused = false;

    timerElement.textContent = `Время: ${timeLeft}`;
    scoreElement.textContent = `Очки: ${score}`;

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

    function setSlotPositions(positions) {
        for (const slotId in positions) {
            const slot = document.getElementById(slotId);
            const { top, left } = positions[slotId];

            slot.style.position = 'absolute';
            slot.style.top = top;
            slot.style.left = left;
        }
    }

    function showQuestion() {
        if (currentQuestionIndex >= questions.length) {
            clearInterval(timer);
            localStorage.setItem('score', score);
            localStorage.setItem('timeLeft', timeLeft);
            alert('Игра завершена! Переход на страницу с рекордами.');
            window.location.href = 'records.html';
            return;
        }

        const questionData = questions[currentQuestionIndex];
        instructionImageElement.src = questionData.instructionImage;
        questionImage.src = questionData.image;

        setSlotPositions(questionData.slotPositions);

        dropzones.forEach((dropzone) => {
            dropzone.textContent = '';
        });

        draggableElements.forEach((element) => {
            document.getElementById('elements').appendChild(element);
        });
    }

    function handleDragStart(event) {
        event.dataTransfer.setData('text', event.target.id);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const draggedElementId = event.dataTransfer.getData('text');
        const draggedElement = document.getElementById(draggedElementId);

        if (event.target.classList.contains('dropzone')) {
            event.target.textContent = '';
            event.target.appendChild(draggedElement);
        }
    }

    function checkCircuit() {
        const questionData = questions[currentQuestionIndex];
        const correctPlacement = questionData.correctPlacement;
        let isCorrect = true;

        for (const slotId in correctPlacement) {
            const slot = document.getElementById(slotId);
            const placedElement = slot.children[0];

            if (!placedElement || placedElement.id !== correctPlacement[slotId]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            score += 30;
            scoreElement.textContent = `Очки: ${score}`;
            scoreElement.style.color = 'green';
        } else {
            score -= 15;
            scoreElement.textContent = `Очки: ${score}`;
            scoreElement.style.color = 'red';
        }

        isPaused = true;
        nextButton.disabled = false;
    }

    nextButton.addEventListener('click', () => {
        isPaused = false;
        scoreElement.style.color = '';
        nextButton.disabled = true;
        currentQuestionIndex++;
        showQuestion();
    });

    checkCircuitButton.addEventListener('click', checkCircuit);

    draggableElements.forEach((element) => {
        element.addEventListener('dragstart', handleDragStart);
    });

    dropzones.forEach((dropzone) => {
        dropzone.addEventListener('dragover', handleDragOver);
        dropzone.addEventListener('drop', handleDrop);
    });

    showQuestion();
});
