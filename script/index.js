document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.tg-0lax');
    const status_div = document.getElementById('status');
    const score_x_span = document.getElementById('scoreX');
    const score_o_span = document.getElementById('scoreO');
    const score_draw_span = document.getElementById('scoreDraw');
    const reset_button = document.getElementById('reset');

    let human_player = 'X';
    let ai_player = 'O';

    let current_player = human_player;
    let game_state = ['', '', '', '', '', '', '', '', ''];
    let score_x = 0;
    let score_o = 0;
    let score_draw = 0;

    const win_conditions = [
        [0, 1, 2],  // lignes
        [3, 4, 5],  // lignes
        [6, 7, 8],  // lignes
        [0, 3, 6],  // colonnes
        [1, 4, 7],  // colonnes
        [2, 5, 8],  // colonnes
        [0, 4, 8],  // diagonales
        [2, 4, 6]   // diagonales
    ];

    // Fonction principale pour démarrer le jeu
    function startGame() {
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.addEventListener('click', handleHumanTurn);
        });
        status_div.innerHTML = `It's ${current_player}'s turn`;
    }

    // fonction pour les tour du joueur humain
    function handleHumanTurn(e) {
        if (current_player !== human_player) return;

        const cell = e.target;
        const cell_index = parseInt(cell.getAttribute('data-index'));

        if (game_state[cell_index] !== '') return;

        makeMove(cell_index, human_player);

        if (checkWinner(game_state, human_player)) {
            handleEndGame(human_player);
        } else if (!game_state.includes('')) {
            handleEndGame('draw');
        } else {
            current_player = ai_player;
            status_div.innerHTML = `AI is thinking...`;
            setTimeout(handleAITurn, 800); // Délai pour simuler un temps de réflexion pour l'IA eh eh
        }
    }

    // Gestion du tour de l'IA avec l'algorithme Minimax
    function handleAITurn() {
        const bestMove = getBestMove();
        makeMove(bestMove.index, ai_player);

        if (checkWinner(game_state, ai_player)) {
            handleEndGame(ai_player);
        } else if (!game_state.includes('')) {
            handleEndGame('draw');
        } else {
            current_player = human_player;
            status_div.innerHTML = `It's ${current_player}'s turn`;
        }
    }

    // Effectuer un mouvement
    function makeMove(index, player) {
        game_state[index] = player;
        cells[index].innerHTML = player;
    }

    // la fin du jeu
    function handleEndGame(winner) {
        if (winner === human_player) {
            score_x++;
            score_x_span.innerText = score_x;
            status_div.innerHTML = `${winner} wins!`;
        } else if (winner === ai_player) {
            score_o++;
            score_o_span.innerText = score_o;
            status_div.innerHTML = `AI wins!`;
        } else {
            score_draw++;
            score_draw_span.innerText = score_draw;
            status_div.innerHTML = `It's a draw!`;
        }

        cells.forEach(cell => {
            cell.removeEventListener('click', handleHumanTurn);
        });

        setTimeout(resetGame, 1500); // un petit délai avant que je jeux ce réinisialise
    }

    // Réinitialiser le jeu
    function resetGame() {
        game_state = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.addEventListener('click', handleHumanTurn);
        });
        current_player = human_player;
        status_div.innerHTML = `It's ${current_player}'s turn`;
    }

    // Vérifier s'il y a un gagnant
    function checkWinner(board, player) {
        for (let condition of win_conditions) {
            const [a, b, c] = condition;
            if (board[a] === player && board[b] === player && board[c] === player) {
                return true;
            }
        }
        return false;
    }

    // Obtenir le meilleur coup pour l'IA avec l'algorithme Minimax
    function getBestMove() {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < game_state.length; i++) {
            if (game_state[i] === '') {
                game_state[i] = ai_player;
                let score = minimax(game_state, 0, false);
                game_state[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { index: i, score };
                }
            }
        }

        return bestMove;
    }

    // Fonction minimax avec élagage alpha-bêta 
    function minimax(board, depth, isMaximizingPlayer, alpha = -Infinity, beta = Infinity) {
        if (checkWinner(board, human_player)) {
            return -10 + depth;
        } else if (checkWinner(board, ai_player)) {
            return 10 - depth;
        } else if (!board.includes('')) {
            return 0;
        }

        if (isMaximizingPlayer) {
            let maxEval = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = ai_player;
                    let eval = minimax(board, depth + 1, false, alpha, beta);
                    board[i] = '';
                    maxEval = Math.max(maxEval, eval);
                    alpha = Math.max(alpha, eval);
                    if (beta <= alpha) break;
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = human_player;
                    let eval = minimax(board, depth + 1, true, alpha, beta);
                    board[i] = '';
                    minEval = Math.min(minEval, eval);
                    beta = Math.min(beta, eval);
                    if (beta <= alpha) break;
                }
            }
            return minEval;
        }
    }

    // Démarrer le jeu au chargement de la page
    startGame();
});
