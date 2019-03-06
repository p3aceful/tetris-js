import Movement from './traits/Movement.js';

export default class Player {
    constructor(x, y, arena) {
        this.pos = new Vec2(x, y);
        this.ghostPos = new Vec2(x, y);
        this.arena = arena;
        this.dropCounter = 0;
        this.dropInterval = 1;
        this.bag = ['l','j','s','z','o','i','t'];
        this.reset(this.arena);
        this.movement = new Movement();
    }

    drop() {
        this.pos.y++;
        if (this.arena.collide(this.matrix, this.pos)) {
            this.pos.y--;
            this.dropReset();
        }
        this.dropCounter = 0;
    }

    hardDrop() {
        do {
            this.pos.y++;
        } while (!this.arena.collide(this.matrix, this.pos));
        this.pos.y--;
        this.dropReset();
        this.dropCounter = 0;
    }

    dropReset() {
        this.arena.merge(this);
        this.arena.sweep();
        this.reset(this.arena);
    }

    move(offset) {
        this.pos.x += offset;
        if(this.arena.collide(this.matrix, this.pos)) {
            this.pos.x -= offset;
        }
    }

    reset() {

        if (!this.matrix) {
            let index = this.bag.length * Math.random() | 0;
            let piece = this.bag.splice(index, 1)[0];
            this.matrix = createMatrix(piece);
            this.ghostMatrix = createMatrix(piece);

            this.next = createMatrix(this.bag.splice(this.bag.length * Math.random() | 0, 1)[0]);
        }
        else {
            if (!this.bag.length) {
                this.bag = ['l','j','s','z','o','i','t'];
            }

            let index = this.bag.length * Math.random() | 0;
            this.matrix = this.next;
            this.ghostMatrix = copyMatrix(this.matrix);
            let piece = this.bag.splice(index, 1)[0];
            this.next = createMatrix(piece);
            this.pos.set(3, 0);
            if (this.arena.collide(this.matrix, this.pos)) {
                this.arena.reset();
            }
        }
    }

    rotate(dir) {
        const pos = this.pos.x;
        let offset = 1;
        rotate (this.matrix, dir);
        rotate(this.ghostMatrix, dir);
        while (this.arena.collide(this.matrix, this.pos)) {
            this.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.matrix[0].length) {
                rotate(this.matrix, -dir);
                rotate(this.ghostMatrix, -dir);
                this.pos.x = pos;
                return;
            }
        }
        
    }

    update(deltaTime) {
        this.movement.update(this, deltaTime);

        this.dropCounter += deltaTime;
        if(this.dropCounter > this.dropInterval) {
            this.drop(this.arena);
            this.dropCounter = 0;
        }

        this.updateGhost(deltaTime);
    }

    updateGhost(deltaTime) {
        let x = this.pos.x;
        let y = this.pos.y;

        this.ghostPos.x = x;
        this.ghostPos.y = y;

        while (!this.arena.collide(this.ghostMatrix, this.ghostPos)) {
            this.ghostPos.y++;
        }
        this.ghostPos.y--;
    }
}

class Vec2 {
    constructor(x, y) {
        this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}

function copyMatrix(matrix) {
    let mat = [];
    matrix.forEach(row => {
        let r = [];
        row.forEach(value => {
            r.push(value);
        })
        mat.push(r);
    })
    return mat;
}

function createMatrix(type) {
    switch (type) {
        case 't': return [[0,1,0],[1,1,1],[0,0,0]];
        case 's': return [[0,2,2],[2,2,0],[0,0,0]];
        case 'z': return [[3,3,0],[0,3,3],[0,0,0]];
        case 'o': return [[4,4],[4,4]];
        case 'l': return [[0,0,5],[5,5,5],[0,0,0]];
        case 'j': return [[6,0,0],[6,6,6],[0,0,0]];
        case 'i': return [[0,0,0,0],[7,7,7,7],[0,0,0,0],[0,0,0,0]];
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < y; x++) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => {
            row.reverse();
        });
    }
    else {
        matrix.reverse();
    }
}