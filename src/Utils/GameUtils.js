import _ from 'lodash';


export function getVictoryTiles(victoryRequirement, playerNumber, baseX, baseY, board) {
    function shiftHorizontal(multiplier, distance, vector) {
        return {
            x: vector.x + (multiplier * distance),
            y: vector.y
        }
    }
    function shiftVertical(multiplier, distance, vector) {
        return {
            x: vector.x,
            y: vector.y + (multiplier * distance)
        }
    }

    function tileBelongsToPlayer(vector) {
        const x = vector.x;
        const y = vector.y;
        
        if (
            board[x]
            && board[x][y]
            && board[x][y] === playerNumber
        ) {
            return true;
        }
        
        return false;
    }


    let victoryTiles = {};
    const baseVector = {x: parseInt(baseX, 10), y: parseInt(baseY, 10)};

    // Short out if function was eroneously called on tile not belonging to player
    if (!tileBelongsToPlayer(baseVector)) {
        return victoryTiles;
    }

    
    const routineSets = [
        [
            [shiftHorizontal.bind(this, -1)],
            [shiftHorizontal.bind(this, 1)]
        ],
        [
            [shiftVertical.bind(this, -1)],
            [shiftVertical.bind(this, 1)]
        ],
        [
            [shiftHorizontal.bind(this, -1), shiftVertical.bind(this, -1)],
            [shiftHorizontal.bind(this, 1), shiftVertical.bind(this, 1)],
        ],
        [
            [shiftHorizontal.bind(this, -1), shiftVertical.bind(this, 1)],
            [shiftHorizontal.bind(this, 1), shiftVertical.bind(this, -1)],
        ]
    ];

    routineSets.forEach((_routineSet) => {
        let routineSet = _routineSet.slice();

        let playerTiles = {};
        playerTiles[baseVector.x] = {[baseVector.y]: true};

        let playerTilesCount = 1;

        let distance = 1;
        while (routineSet.length) {
            const newRoutineSet = [];

            routineSet.forEach((subroutineSet) => {
                let runningVector = _.clone(baseVector);
                
                subroutineSet.forEach((subroutine) => {
                    runningVector = subroutine(distance, runningVector);
                });

                if (tileBelongsToPlayer(runningVector)) {
                    newRoutineSet.push(subroutineSet);
                    if (!_.has(playerTiles, [runningVector.x, runningVector.y])) {
                        playerTiles = _.merge(playerTiles, {[runningVector.x]: {[runningVector.y]: true}});
                        playerTilesCount += 1;
                    }
                }
            });

            routineSet = newRoutineSet;
            distance += 1;
        }

        if (playerTilesCount >= victoryRequirement) {
            victoryTiles = _.merge(victoryTiles, playerTiles);
        }
    });

    return victoryTiles;
}

export function isColumnFull(columnData) {
    return (columnData[0] !== 0);
}

export function isBoardFull(boardData) {
    let foundEmptyColumn = false;
    _.forEach(boardData, (columnData) => {
        if (!isColumnFull(columnData)) {
            foundEmptyColumn = true;
        }
    });

    return (!foundEmptyColumn);
}

export function getFreshGameBoard(columnCount, rowCount) {
    const tiles = {};
    for (let col = 0; col < columnCount; col++) {
        tiles[col] = {};
        for (let row = 0; row < rowCount; row++) {
            tiles[col][row] = 0;
        }
    }

    return tiles;
}