document.addEventListener('DOMContentLoaded', () => {
    const recordsContainer = document.getElementById('records-container');
    const clearRecordsButton = document.getElementById('clear-records');
    const backToMainButton = document.getElementById('back-to-main');

    const gameRecords = JSON.parse(localStorage.getItem('gameRecords')) || [];
    const lastGameScore = parseInt(localStorage.getItem('score'));
    const lastPlayerName = localStorage.getItem('playerName');

    const displayRecords = () => {
        recordsContainer.innerHTML = ''; 

        if (gameRecords.length === 0) {
            const noDataMessage = document.createElement('p');
            noDataMessage.textContent = 'Нет данных о сыгранных играх.';
            recordsContainer.appendChild(noDataMessage);
            return;
        }

        const table = document.createElement('table');
        table.classList.add('records-table');

        const headerRow = document.createElement('tr');
        const nameHeader = document.createElement('th');
        const scoreHeader = document.createElement('th');

        nameHeader.textContent = 'Имя игрока';
        scoreHeader.textContent = 'Сумма очков';

        headerRow.appendChild(nameHeader);
        headerRow.appendChild(scoreHeader);
        table.appendChild(headerRow);

        gameRecords.forEach((record) => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const scoreCell = document.createElement('td');

            nameCell.textContent = record.name;
            scoreCell.textContent = record.score;

            if (record.name === lastPlayerName && record.score === lastGameScore) {
                row.classList.add('highlight');
            }

            row.appendChild(nameCell);
            row.appendChild(scoreCell);
            table.appendChild(row);
        });

        recordsContainer.appendChild(table);
    };

    const saveRecords = () => {
        if (lastPlayerName && !isNaN(lastGameScore)) {
            gameRecords.push({ name: lastPlayerName, score: lastGameScore });
            gameRecords.sort((a, b) => b.score - a.score); 
            localStorage.setItem('gameRecords', JSON.stringify(gameRecords));
        }
    };

    clearRecordsButton.addEventListener('click', () => {
        localStorage.removeItem('gameRecords');
        recordsContainer.innerHTML = '<p>Нет данных о сыгранных играх.</p>';
    });

    backToMainButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    saveRecords(); 
    displayRecords(); 
});
