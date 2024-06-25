
document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.tg-0lax');
    const status_div = document.getElementById('status');
    const score_x_span = document.getElementById('scoreX');
    const score_o_span = document.getElementById('scoreO');
    const score_draw_span = document.getElementById('scoreDraw'); 
    const reset_button = document.getElementById('reset');

    let current_player = 'X';
    let game_state = ['', '', '', '', '', '', '', '', ''];
    let score_x = 0;
    let score_o = 0; 
    let score_draw = 0;

    const win_conditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handle_cell_click(e) {
        const cell = e.target;
        const cell_index = parseInt(cell.getAttribute('data-index')); 

        if (game_state[cell_index] !== '' || check_winner()) {
            return;
        }

        game_state[cell_index] = current_player;
        cell.innerHTML = current_player;

        if (check_winner()) {
            status_div.innerHTML = `${current_player} wins!`;
            if (current_player === 'X') {
                score_x++;
                score_x_span.innerText = score_x;
            } else {
                score_o++;
                score_o_span.innerText = score_o;
            }
            reset_game();
        } else if (!game_state.includes('')) {
            status_div.innerHTML = "Draw!";
            score_draw++;
            score_draw_span.innerText = score_draw;
            reset_game();
        } else {
            current_player = current_player === 'X' ? 'O' : 'X';
            status_div.innerHTML = `It's ${current_player}'s turn`;

            if (current_player === 'O') {
                handle_ai_turn();
            }
        }
    }
    // la fonction pour changé le joueur O par l'ia
    function handle_ai_turn() {
        let available_indices = [];
        game_state.forEach((cell, index) => {
            if (cell === '') {
                available_indices.push(index);
            }
        });

        if (available_indices.length === 0 || check_winner()) {
            return;
        }

        const random_index = available_indices[Math.floor(Math.random() * available_indices.length)];
        game_state[random_index] = current_player;
        cells[random_index].innerHTML = current_player;

        if (check_winner()) {
            status_div.innerHTML = `${current_player} wins!`;
            if (current_player === 'X') {
                score_x++;
                score_x_span.innerText = score_x;
            } else {
                score_o++;
                score_o_span.innerText = score_o;
            }
            reset_game();
        } else if (!game_state.includes('')) {
            status_div.innerHTML = "Draw!";
            score_draw++;
            score_draw_span.innerText = score_draw;
            reset_game();
        } else {
            current_player = 'X';
            status_div.innerHTML = `It's ${current_player}'s turn`;
        }
    }

    function check_winner() {
        let round_won = false;
        for (let i = 0; i < win_conditions.length; i++) {
            const [a, b, c] = win_conditions[i];
            if (game_state[a] && game_state[a] === game_state[b] && game_state[a] === game_state[c]) {
                round_won = true;
                break;
            }
        }
        return round_won;
    }

    function reset_game() {
        game_state = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => cell.innerHTML = '');
        current_player = 'X';
        status_div.innerHTML = `It's ${current_player}'s turn`;
    }

    cells.forEach(cell => cell.addEventListener('click', handle_cell_click));
    reset_button.addEventListener('click', reset_game);
    status_div.innerHTML = `It's ${current_player}'s turn`;
});
