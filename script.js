// TOWER DEFENSE GAME

// Get canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// 1. GAME VARIABLES

let health = 20;
let gold = 300;
let score = 0;
let wave = 0;

let gameRunning = false;
let paused = false;
let gameSpeed = 1;

let gameOver = false;
let victory = false;


// Arrays store game objects
let towers = [];
let enemies = [];
let bullets = [];


// Currently selected tower type
let selectedTower = "basic";

// Currently selected tower on the map
let selectedTowerObject = null;


// 2. PATH

const path = [
    { x: 0, y: 100 },
    { x: 180, y: 100 },
    { x: 180, y: 350 },
    { x: 400, y: 350 },
    { x: 400, y: 170 },
    { x: 700, y: 170 },
    { x: 700, y: 430 },
    { x: 900, y: 430 }
];


// 3. TOWER INFORMATION

const towerData = {

    basic: {
        cost: 60,
        damage: 25,
        range: 120,
        speed: 700,
        color: "#4da3ff"
    },

    rapid: {
        cost: 90,
        damage: 10,
        range: 100,
        speed: 200,
        color: "#ffd84d"
    },

    ice: {
        cost: 80,
        damage: 7,
        range: 110,
        speed: 800,
        color: "#c084fc"
    }

};


// 4. ENEMY INFORMATION

const enemyData = {

    basic: {
        health: 60,
        speed: 50,
        reward: 8,
        color: "#55d66f"
    },

    fast: {
        health: 35,
        speed: 90,
        reward: 10,
        color: "#ffd34e"
    },

    tank: {
        health: 200,
        speed: 30,
        reward: 20,
        color: "#ef6666"
    },

    boss: {
        health: 500,
        speed: 20,
        reward: 50,
        color: "#ff5ca8"
    }

};


// 5. UPDATE SCREEN

function updateScreen() {

    document.getElementById("health").textContent = health;

    document.getElementById("gold").textContent = gold;

    document.getElementById("wave").textContent = wave;

    document.getElementById("score").textContent = score;

}



// 6. MESSAGE


function showMessage(text) {

    document.getElementById("message").textContent = text;

}


// 7. SELECT TOWER TYPE

document.getElementById("basicButton").onclick = function () {

    selectedTower = "basic";

    showMessage("Basic tower selected");

};


document.getElementById("rapidButton").onclick = function () {

    selectedTower = "rapid";

    showMessage("Rapid tower selected");

};


document.getElementById("iceButton").onclick = function () {

    selectedTower = "ice";

    showMessage("Ice tower selected");

};


// 8. CHECK IF POSITION IS ON PATH

function isOnPath(x, y) {

    for (let i = 0; i < path.length - 1; i++) {

        const a = path[i];
        const b = path[i + 1];

        const minX = Math.min(a.x, b.x) - 35;
        const maxX = Math.max(a.x, b.x) + 35;

        const minY = Math.min(a.y, b.y) - 35;
        const maxY = Math.max(a.y, b.y) + 35;

        if (
            x >= minX &&
            x <= maxX &&
            y >= minY &&
            y <= maxY
        ) {
            return true;
        }

    }

    return false;

}


// 9. PLACE OR SELECT TOWER

canvas.onclick = function (event) {

    if (gameOver || victory) {
        return;
    }

    const rect = canvas.getBoundingClientRect();

    const x =
        (event.clientX - rect.left)
        * canvas.width / rect.width;

    const y =
        (event.clientY - rect.top)
        * canvas.height / rect.height;


    // First check if player clicked an existing tower

    for (const tower of towers) {

        const dx = tower.x - x;
        const dy = tower.y - y;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        if (distance < 25) {

            selectedTowerObject = tower;

            updateTowerInfo();

            showMessage("Tower selected");

            return;
        }

    }


    // Don't place towers on the enemy path

    if (isOnPath(x, y)) {

        showMessage("You cannot place a tower on the path");

        return;
    }


    const data = towerData[selectedTower];


    // Check money

    if (gold < data.cost) {

        showMessage("Not enough gold");

        return;
    }


    // Create tower

    const tower = {

        x: x,
        y: y,

        type: selectedTower,

        cooldown: 0,

        level: 1,

        totalCost: data.cost

    };


    towers.push(tower);

    gold -= data.cost;

    selectedTowerObject = tower;


    updateScreen();

    updateTowerInfo();

    showMessage("Tower placed!");

};

// 10. SHOW SELECTED TOWER INFORMATION

function updateTowerInfo() {

    const info =
        document.getElementById("towerInfo");


    if (!selectedTowerObject) {

        info.textContent =
            "No tower selected";

        return;
    }


    const tower = selectedTowerObject;

    const data = towerData[tower.type];


    info.innerHTML =

        "Type: " + tower.type +
        "<br>Level: " + tower.level +
        "<br>Damage: " + data.damage * tower.level +
        "<br>Range: " + data.range;


}

// 11. UPGRADE TOWER

document.getElementById("upgradeTower").onclick = function () {

    if (!selectedTowerObject) {

        showMessage("Select a tower first");

        return;
    }


    const tower = selectedTowerObject;

    const upgradeCost = 50 * tower.level;


    if (gold < upgradeCost) {

        showMessage("Not enough gold to upgrade");

        return;
    }


    gold -= upgradeCost;

    tower.level++;


    updateScreen();

    updateTowerInfo();

    showMessage(
        "Tower upgraded to level " +
        tower.level
    );

};


// 12. SELL TOWER

document.getElementById("sellTower").onclick = function () {

    if (!selectedTowerObject) {

        showMessage("Select a tower first");

        return;
    }


    const tower = selectedTowerObject;

    const index =
        towers.indexOf(tower);


    if (index !== -1) {

        towers.splice(index, 1);

    }


    // Return half of tower cost

    gold +=
        Math.floor(tower.totalCost / 2);


    selectedTowerObject = null;


    updateScreen();

    updateTowerInfo();

    showMessage("Tower sold");

};



// 13. START WAVE

document.getElementById("startWave").onclick = function () {

    if (gameOver) {

        showMessage("Game Over - restart the game");

        return;
    }


    if (victory) {

        showMessage("You already won the game!");

        return;
    }


    if (gameRunning) {

        showMessage("Wave is already running");

        return;
    }


    if (wave >= 50) {

        victory = true;

        showVictory();

        return;
    }


    wave++;

    gameRunning = true;


    createWave();


    updateScreen();

    showMessage(
        "Wave " + wave + " started!"
    );

};


// 14. CREATE WAVE

function createWave() {

    const enemyCount =
        10 + wave * 3;


    for (
        let i = 0;
        i < enemyCount;
        i++
    ) {

        createEnemy(i);

    }

}


// 15. CREATE ENEMY

function createEnemy(number) {

    let type = "basic";


    // Fast enemies

    if (
        wave >= 5 &&
        number % 5 === 0
    ) {

        type = "fast";

    }


    // Tank enemies

    if (
        wave >= 10 &&
        number % 10 === 0
    ) {

        type = "tank";

    }


    // Boss

    if (
        wave % 10 === 0 &&
        number === 0
    ) {

        type = "boss";

    }


    const data = enemyData[type];


    const enemy = {

        x: path[0].x,

        y: path[0].y,

        point: 0,

        health:
            data.health + wave * 5,

        maxHealth:
            data.health + wave * 5,

        speed: data.speed,

        reward: data.reward,

        type: type

    };


    enemies.push(enemy);

}


// 16. MOVE ENEMIES

function moveEnemies(deltaTime) {

    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        const enemy = enemies[i];


        const nextPoint =
            path[enemy.point + 1];


        // Enemy reached base

        if (!nextPoint) {

            health--;

            enemies.splice(i, 1);


            if (health <= 0) {

                health = 0;

                gameOver = true;

                gameRunning = false;

                showGameOver();

            }


            updateScreen();

            continue;

        }


        const dx =
            nextPoint.x - enemy.x;

        const dy =
            nextPoint.y - enemy.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance > 0) {

            enemy.x +=
                (dx / distance)
                * enemy.speed
                * deltaTime;

            enemy.y +=
                (dy / distance)
                * enemy.speed
                * deltaTime;

        }


        // Reached next point

        if (distance < 5) {

            enemy.point++;

        }

    }


    // Wave completed

    if (
        enemies.length === 0 &&
        gameRunning
    ) {

        gameRunning = false;

        gold += 30;


        if (wave >= 50) {

            victory = true;

            showVictory();

        } else {

            showMessage(
                "Wave complete! +30 gold"
            );

        }


        updateScreen();

    }

}


// 17. FIND ENEMY

function findEnemy(tower) {

    const data =
        towerData[tower.type];


    for (const enemy of enemies) {

        const dx =
            enemy.x - tower.x;

        const dy =
            enemy.y - tower.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance <= data.range) {

            return enemy;

        }

    }


    return null;

}


// 18. TOWERS ATTACK

function updateTowers(deltaTime) {

    for (const tower of towers) {

        tower.cooldown -=
            deltaTime * 1000;


        if (tower.cooldown <= 0) {

            const enemy =
                findEnemy(tower);


            if (enemy) {

                shoot(tower, enemy);

                tower.cooldown =
                    towerData[tower.type].speed;

            }

        }

    }

}


// 19. SHOOT

function shoot(tower, enemy) {

    const bullet = {

        x: tower.x,

        y: tower.y,

        enemy: enemy,

        damage:
            towerData[tower.type].damage
            * tower.level

    };


    bullets.push(bullet);

}


// 20. MOVE BULLETS

function updateBullets(deltaTime) {

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet = bullets[i];


        // Target was destroyed

        if (!enemies.includes(bullet.enemy)) {

            bullets.splice(i, 1);

            continue;

        }


        const enemy = bullet.enemy;


        const dx =
            enemy.x - bullet.x;

        const dy =
            enemy.y - bullet.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        const speed = 400;


        if (distance > 0) {

            bullet.x +=
                (dx / distance)
                * speed
                * deltaTime;

            bullet.y +=
                (dy / distance)
                * speed
                * deltaTime;

        }


        if (distance < 10) {

            enemy.health -=
                bullet.damage;


            // Enemy dies

            if (enemy.health <= 0) {

                const index =
                    enemies.indexOf(enemy);


                if (index !== -1) {

                    enemies.splice(index, 1);

                }


                gold += enemy.reward;

                score +=
                    enemy.reward * 10;


                updateScreen();

            }


            bullets.splice(i, 1);

        }

    }

}


// 21. GAME OVER SCREEN

function showGameOver() {

    showMessage(
        "GAME OVER! Your base was destroyed. Click Restart."
    );

}


// 22. VICTORY SCREEN

function showVictory() {

    showMessage(
        "VICTORY! You completed all 50 waves!"
    );

}


// 23. DRAW PATH

function drawPath() {

    ctx.lineWidth = 60;

    ctx.lineCap = "round";

    ctx.strokeStyle = "#70583e";


    ctx.beginPath();

    ctx.moveTo(
        path[0].x,
        path[0].y
    );


    for (
        let i = 1;
        i < path.length;
        i++
    ) {

        ctx.lineTo(
            path[i].x,
            path[i].y
        );

    }


    ctx.stroke();

}


// 24. DRAW TOWERS

function drawTowers() {

    for (const tower of towers) {

        const data =
            towerData[tower.type];


        // Range for selected tower

        if (
            tower === selectedTowerObject
        ) {

            ctx.beginPath();

            ctx.arc(
                tower.x,
                tower.y,
                data.range,
                0,
                Math.PI * 2
            );

            ctx.strokeStyle =
                "rgba(255,255,255,0.25)";

            ctx.stroke();

        }


        // Tower

        ctx.beginPath();

        ctx.arc(
            tower.x,
            tower.y,
            18,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            data.color;

        ctx.fill();


        // Tower level

        ctx.fillStyle = "black";

        ctx.font =
            "bold 12px Arial";

        ctx.textAlign = "center";


        ctx.fillText(
            tower.level,
            tower.x,
            tower.y + 4
        );


        ctx.textAlign = "left";

    }

}


// 25. DRAW ENEMIES

function drawEnemies() {

    for (const enemy of enemies) {

        const data =
            enemyData[enemy.type];


        ctx.beginPath();

        ctx.arc(
            enemy.x,
            enemy.y,
            enemy.type === "boss"
                ? 18
                : 10,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            data.color;

        ctx.fill();


        // Health bar

        ctx.fillStyle = "red";

        ctx.fillRect(
            enemy.x - 15,
            enemy.y - 20,
            30,
            4
        );


        ctx.fillStyle = "lime";

        ctx.fillRect(
            enemy.x - 15,
            enemy.y - 20,
            30 *
            (enemy.health /
            enemy.maxHealth),
            4
        );

    }

}


// 26. DRAW BULLETS

function drawBullets() {

    for (const bullet of bullets) {

        ctx.beginPath();

        ctx.arc(
            bullet.x,
            bullet.y,
            4,
            0,
            Math.PI * 2
        );


        ctx.fillStyle = "white";

        ctx.fill();

    }

}


// 27. DRAW EVERYTHING

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle =
        "#16251a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawPath();

    drawTowers();

    drawEnemies();

    drawBullets();

}


// 28. PAUSE

document.getElementById("pauseGame").onclick =
    function () {

        if (gameOver || victory) {
            return;
        }


        paused = !paused;


        if (paused) {

            this.textContent = "Resume";

        } else {

            this.textContent = "Pause";

        }

    };


// 29. GAME SPEED

document.getElementById("speedGame").onclick =
    function () {

        if (gameSpeed === 1) {

            gameSpeed = 2;

        } else if (gameSpeed === 2) {

            gameSpeed = 3;

        } else {

            gameSpeed = 1;

        }


        this.textContent =
            "Speed: " +
            gameSpeed +
            "x";

    };


// 30. RESTART

document.getElementById("restartGame").onclick =
    function () {

        health = 20;

        gold = 300;

        score = 0;

        wave = 0;

        towers = [];

        enemies = [];

        bullets = [];

        gameRunning = false;

        paused = false;

        gameSpeed = 1;

        gameOver = false;

        victory = false;

        selectedTowerObject = null;


        document.getElementById("pauseGame")
            .textContent = "Pause";

        document.getElementById("speedGame")
            .textContent = "Speed: 1x";


        updateScreen();

        updateTowerInfo();


        showMessage(
            "Game restarted!"
        );

    };

 
// 31. MAIN GAME LOOP

let lastTime =
    performance.now();


function gameLoop(currentTime) {

    let deltaTime =
        (currentTime - lastTime)
        / 1000;


    lastTime = currentTime;


    // Prevent large time jump

    if (deltaTime > 0.05) {

        deltaTime = 0.05;

    }


    if (!paused && !gameOver && !victory) {

        moveEnemies(
            deltaTime * gameSpeed
        );


        updateTowers(
            deltaTime * gameSpeed
        );


        updateBullets(
            deltaTime * gameSpeed
        );

    }


    draw();


    requestAnimationFrame(gameLoop);

}


// 32. START GAME

updateScreen();

updateTowerInfo();

requestAnimationFrame(gameLoop);