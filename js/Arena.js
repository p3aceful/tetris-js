export default class Arena {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.reset();
    }

    collide(mat, po) {
        const [m, o] = [mat, po];
        for (let y = 0; y < m.length; y++) {
            for (let x = 0; x < m[y].length; x++) {
                if (m[y][x] !== 0 && (this.matrix[y + o.y] && this.matrix[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    merge(player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if(value !== 0) {
                    this.matrix[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    reset() {
        let arr = [];
        
        for (let i = 0; i < this.h; i++) {
            arr.push(new Array(this.w).fill(0));
        }

        this.matrix = arr;
    }

    sweep() {
        outer: for (let y = this.matrix.length - 1; y > 0; --y) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                if (this.matrix[y][x] === 0) {
                    continue outer;
                }
            }
    
            const row = this.matrix.splice(y, 1)[0].fill(0);
            this.matrix.unshift(row);
            y++;
        }
    }
}