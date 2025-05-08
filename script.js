document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const attemptsElement = document.getElementById('attempts');
    const pairsElement = document.getElementById('pairs');
    const totalPairsElement = document.getElementById('total-pairs');
    const restartBtn = document.getElementById('restart-btn');
    const claimBtn = document.getElementById('claim-btn');
    const celebration = document.getElementById('celebration');

    // Fruit emojis for cards
    const fruits = ['🍓', '🍎', '🍑', '🍊', '🍋', '🍇'];

    // Game state
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let attempts = 0;
    let canFlip = true;
    const totalPairs = fruits.length;

    totalPairsElement.textContent = totalPairs;

    // Initialize game
    function initGame() {
        // Reset state
        gameBoard.innerHTML = '';
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        attempts = 0;
        canFlip = true;

        // Update UI
        attemptsElement.textContent = attempts;
        pairsElement.textContent = matchedPairs;
        claimBtn.classList.remove('visible');

        // Create cards array with pairs
        const cardValues = [...fruits, ...fruits];
        shuffleArray(cardValues);

        // Create card elements
        cardValues.forEach((value, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.dataset.value = value;

            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            cardFront.innerHTML = '<div class="logo">DR</div>';

            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            cardBack.textContent = value;

            card.appendChild(cardFront);
            card.appendChild(cardBack);

            card.addEventListener('click', () => flipCard(card));

            gameBoard.appendChild(card);
            cards.push(card);
        });
    }

    // Shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Flip card logic
    function flipCard(card) {
        // Prevent flipping if game is locked or card is already flipped
        if (!canFlip || flippedCards.includes(card) || card.classList.contains('matched')) {
            return;
        }

        // Flip the card
        card.classList.add('flipped');
        flippedCards.push(card);

        // Check if we have a pair
        if (flippedCards.length === 2) {
            attempts++;
            attemptsElement.textContent = attempts;
            canFlip = false;

            const [card1, card2] = flippedCards;

            if (card1.dataset.value === card2.dataset.value) {
                // Match found
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    flippedCards = [];
                    canFlip = true;

                    matchedPairs++;
                    pairsElement.textContent = matchedPairs;

                    // Check if game is complete
                    if (matchedPairs === totalPairs) {
                        gameComplete();
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    }

    // Game completion
    function gameComplete() {
        createConfetti();
        setTimeout(() => {
            claimBtn.classList.add('visible');
        }, 1000);
    }

    // Create confetti effect
    function createConfetti() {
        celebration.innerHTML = '';
        celebration.classList.add('active');

        const colors = ['#e94057', '#f27121', '#8a2387', '#ffdb3a', '#ff9a3a', '#a1dd70'];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;

            celebration.appendChild(confetti);
        }

        setTimeout(() => {
            celebration.classList.remove('active');
        }, 4000);
    }

    // Restart game
    restartBtn.addEventListener('click', initGame);

    // Initialize the game
    initGame();
});