// Attendre que le contenu du document soit entièrement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', () => {
    
    // Sélectionner toutes les cellules du tableau de jeu
    const cells = document.querySelectorAll('.tg-0lax');
    // Sélectionner les éléments d'interface pour l'affichage de l'état du jeu et des scores
    const status_div = document.getElementById('status');
    const score_x_span = document.getElementById('scoreX');
    const score_o_span = document.getElementById('scoreO');
    const score_draw_span = document.getElementById('scoreDraw');
    const reset_button = document.getElementById('reset');
    
    // Initialiser les variables de l'état du jeu
    let current_player = 'X'; // Le joueur qui commence
    let game_state = ['', '', '', '', '', '', '', '', '']; // L'état actuel de chaque cellule (vide au départ)
    let score_x = 0; // Score du joueur X
    let score_o = 0; // Score du joueur O
    let score_draw = 0; // Nombre de parties nulles
    
    // Conditions de victoire (index des cellules qui doivent être égales pour gagner)
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

    // Fonction appelée lorsqu'une cellule est cliquée
    function handle_cell_click(event) {
        const cell = event.target; // La cellule cliquée
        const cell_index = parseInt(cell.getAttribute('data-index')); // Obtenir l'index de la cellule cliquée

        // Vérifier si la cellule est déjà remplie ou si quelqu'un a déjà gagné
        if (game_state[cell_index] !== '' || check_winner()) {
            return;
        }

        // Mettre à jour l'état du jeu et l'affichage de la cellule
        game_state[cell_index] = current_player;
        cell.innerHTML = current_player;

        // Vérifier s'il y a un gagnant
        if (check_winner()) {
            status_div.innerHTML = `${current_player} wins!`; // Afficher le gagnant
            if (current_player === 'X') {
                score_x++;
                score_x_span.innerText = score_x; // Mettre à jour le score de X
            } else {
                score_o++;
                score_o_span.innerText = score_o; // Mettre à jour le score de O
            }
            reset_game(); // Réinitialiser la grille après une victoire
        } else if (!game_state.includes('')) { // Vérifier s'il y a une égalité
            status_div.innerHTML = "Draw!";
            score_draw++;
            score_draw_span.innerText = score_draw; // Mettre à jour le nombre de parties nulles
            reset_game(); // Réinitialiser la grille après une égalité
        } else {
            // Changer de joueur
            current_player = current_player === 'X' ? 'O' : 'X';
            status_div.innerHTML = `It's ${current_player}'s turn`; // Afficher le joueur actuel
        }
    }

    // Fonction pour vérifier s'il y a un gagnant
    function check_winner() {
        let round_won = false;
        for (let i = 0; i < win_conditions.length; i++) {
            const [a, b, c] = win_conditions[i];
            // Vérifier si les cellules a, b et c sont égales et non vides
            if (game_state[a] && game_state[a] === game_state[b] && game_state[a] === game_state[c]) {
                round_won = true;
                break;
            }
        }
        return round_won;
    }

    // Fonction pour réinitialiser la grille après une partie
    function reset_game() {
        game_state = ['', '', '', '', '', '', '', '', '']; // Réinitialiser l'état du jeu
        cells.forEach(cell => cell.innerHTML = ''); // Effacer le contenu des cellules
        current_player = 'X'; // Réinitialiser le joueur actuel
        status_div.innerHTML = `It's ${current_player}'s turn`; // Mettre à jour l'affichage du joueur actuel
    }

    // Ajouter un écouteur d'événement de clic à chaque cellule
    cells.forEach(cell => cell.addEventListener('click', handle_cell_click));
    // Ajouter un écouteur d'événement de clic au bouton de réinitialisation
    reset_button.addEventListener('click', reset_game);
    // Afficher le joueur actuel au début du jeu
    status_div.innerHTML = `It's ${current_player}'s turn`;
});
