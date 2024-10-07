let selectedSprinkler = null;
let gridRows = 5;  // Nombre de lignes par défaut
let gridCols = 5;  // Nombre de colonnes par défaut

// Définit les portées des arroseurs
const sprinklerRanges = {
    'basic': [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}],   // 4 cases adjacentes
    'quality': [
        {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1},  // Ligne au-dessus
        {x: -1, y: 0},                {x: 1, y: 0},   // Gauche et droite
        {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}     // Ligne en-dessous
    ],  // 8 cases autour
    'iridium': [
        // Portée de 2 dans toutes les directions
        {x: -2, y: -2}, {x: -1, y: -2}, {x: 0, y: -2}, {x: 1, y: -2}, {x: 2, y: -2},
        {x: -2, y: -1}, {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1}, {x: 2, y: -1},
        {x: -2, y: 0},  {x: -1, y: 0},                 {x: 1, y: 0},  {x: 2, y: 0},
        {x: -2, y: 1},  {x: -1, y: 1},  {x: 0, y: 1},  {x: 1, y: 1},  {x: 2, y: 1},
        {x: -2, y: 2},  {x: -1, y: 2},  {x: 0, y: 2},  {x: 1, y: 2},  {x: 2, y: 2}
    ]  // 24 cases autour
};

// Fonction pour générer la grille
function generateGrid() {
    gridRows = document.getElementById("grid-rows").value;  // Nombre de lignes
    gridCols = document.getElementById("grid-cols").value;  // Nombre de colonnes
    const gridContainer = document.getElementById("grid-container");

    gridContainer.innerHTML = '';  // Effacer la grille précédente
    gridContainer.style.gridTemplateColumns = `repeat(${gridCols}, 50px)`;

    for (let i = 0; i < gridRows * gridCols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.dataset.index = i;  // On donne un index à chaque cellule
        cell.addEventListener('click', () => toggleSprinkler(cell));
        gridContainer.appendChild(cell);
    }
}

// Fonction pour sélectionner un arroseur
function selectSprinkler(type) {
    selectedSprinkler = type;
}

// Fonction pour placer ou enlever un arroseur
function toggleSprinkler(cell) {
    const index = parseInt(cell.dataset.index);
    const row = Math.floor(index / gridCols);
    const col = index % gridCols;

    // Si un arroseur est déjà là, on le supprime
    if (cell.classList.contains('sprinkler-basic') ||
        cell.classList.contains('sprinkler-quality') ||
        cell.classList.contains('sprinkler-iridium')) {
        cell.className = 'grid-cell';  // Supprime l'arroseur
        clearHighlightRange(row, col);  // Enlève la surbrillance
    } else if (selectedSprinkler) {
        // Ajouter l'arroseur sélectionné
        cell.classList.add(`sprinkler-${selectedSprinkler}`);
        highlightRange(row, col, selectedSprinkler);  // Montre la portée
    }
}

// Fonction pour afficher la portée d'un arroseur
function highlightRange(row, col, type) {
    const range = sprinklerRanges[type];
    range.forEach(offset => {
        const targetRow = row + offset.y;
        const targetCol = col + offset.x;
        if (targetRow >= 0 && targetRow < gridRows && targetCol >= 0 && targetCol < gridCols) {
            const targetIndex = targetRow * gridCols + targetCol;
            const targetCell = document.querySelector(`.grid-cell[data-index="${targetIndex}"]`);
            if (targetCell) {
                targetCell.classList.add('highlight-range');
            }
        }
    });
}

// Fonction pour enlever la surbrillance
function clearHighlightRange(row, col) {
    document.querySelectorAll('.highlight-range').forEach(cell => {
        cell.classList.remove('highlight-range');
    });
}
