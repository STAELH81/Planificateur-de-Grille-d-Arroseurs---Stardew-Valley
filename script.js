let selectedSprinkler = null;
let deleteMode = false;  // Mode de suppression activé ou non
let gridRows = 5;
let gridCols = 5;

const sprinklerRanges = {
    'basic': [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}], // Portée de l'arroseur simple
    'quality': [ // Portée de l'arroseur de qualité
        {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1},
        {x: -1, y: 0}, {x: 1, y: 0},
        {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}
    ],
    'iridium': [ // Portée de l'arroseur iridium
        {x: -2, y: -2}, {x: -1, y: -2}, {x: 0, y: -2}, {x: 1, y: -2}, {x: 2, y: -2},
        {x: -2, y: -1}, {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1}, {x: 2, y: -1},
        {x: -2, y: 0},  {x: -1, y: 0},                {x: 1, y: 0},  {x: 2, y: 0},
        {x: -2, y: 1},  {x: -1, y: 1},  {x: 0, y: 1},  {x: 1, y: 1},  {x: 2, y: 1},
        {x: -2, y: 2},  {x: -1, y: 2},  {x: 0, y: 2},  {x: 1, y: 2},  {x: 2, y: 2}
    ]
};

// Générer la grille
function generateGrid() {
    gridRows = document.getElementById("grid-rows").value;
    gridCols = document.getElementById("grid-cols").value;
    const gridContainer = document.getElementById("grid-container");

    gridContainer.innerHTML = ''; // Vider la grille existante
    gridContainer.style.gridTemplateColumns = `repeat(${gridCols}, 50px)`; // Redimensionner les colonnes

    for (let i = 0; i < gridRows * gridCols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(cell));
        gridContainer.appendChild(cell);
    }
}

// Sélection de l'arroseur
function selectSprinkler(type) {
    selectedSprinkler = type;
    deleteMode = false;  // Désactive le mode suppression si un arroseur est sélectionné
}

// Activer le mode suppression
function deleteSprinklerMode() {
    deleteMode = true;
    selectedSprinkler = null;  // Désactive la sélection d'arroseur
}

function handleCellClick(cell) {
    const index = parseInt(cell.dataset.index);
    const row = Math.floor(index / gridCols);
    const col = index % gridCols;

    if (deleteMode) {
        // Supprimer un arroseur
        cell.classList.remove('sprinkler-basic', 'sprinkler-quality', 'sprinkler-iridium');
        cell.style.backgroundImage = "url('dirt.png')"; // Revenir à l'état de sol non irrigué
        clearHighlightRange();  // Enlever la surbrillance des autres cellules
    } else if (selectedSprinkler) {
        // Ajouter l'arroseur sélectionné à la cellule cible
        cell.classList.add(`sprinkler-${selectedSprinkler}`);
        cell.style.backgroundImage = `url('${selectedSprinkler}-sprinkler.png')`;

        // Marquer les autres cellules dans la portée comme irriguées
        highlightRange(row, col, selectedSprinkler);

        // Marquer la cellule d'arroseur comme irriguée
        cell.classList.add('irrigated'); // Marquer la cellule comme irriguée
    } else {
        alert("Veuillez sélectionner un arroseur avant de placer un élément.");
    }
}


function highlightRange(row, col, type) {
    clearHighlightRange();  // Enlever toute surbrillance précédente
    const range = sprinklerRanges[type];

    range.forEach(offset => {
        const targetRow = row + offset.y;
        const targetCol = col + offset.x;
        if (targetRow >= 0 && targetRow < gridRows && targetCol >= 0 && targetCol < gridCols) {
            const targetIndex = targetRow * gridCols + targetCol;
            const targetCell = document.querySelector(`.grid-cell[data-index="${targetIndex}"]`);
            if (targetCell) {
                // Mettre à jour l'image de la cellule pour qu'elle soit irriguée
                targetCell.classList.add('irrigated'); // Marquer comme irriguée
                targetCell.style.backgroundImage = "url('irrigated-dirt.png')"; // Changer l'image de fond
            }
        }
    });
}


// Enlever la surbrillance des cellules dans la portée
function clearHighlightRange() {
    document.querySelectorAll('.highlight-range').forEach(cell => {
        cell.classList.remove('highlight-range');
    });
}
