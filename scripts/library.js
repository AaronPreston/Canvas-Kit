Game = {
    window: document.getElementById("canvas"),
    brush: document.getElementById("canvas").getContext("2d"),
    iterationCount: 0,
    active: true,

    objects: [],

    Keyboard: {
        A: false,
        B: false,
        C: false,
        D: false,
        E: false,
        F: false,
        G: false,
        H: false,
        I: false,
        J: false,
        K: false,
        L: false,
        M: false,
        N: false,
        O: false,
        P: false,
        Q: false,
        R: false,
        S: false,
        T: false,
        U: false,
        V: false,
        W: false,
        X: false,
        Y: false,
        Z: false,

        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        0: false,

        SPACE: false,
        ESC: false,
        ENTER: false
    },

    fps: fps(60) 

};

Room = {
    width: 100,
    height: 100,
    /*
    bottom: this.height,
    right: this.width,
    top: 0,
    left: 0,
    */
    backgroundColor: "Gray"
};


Point = {
    value: (((window.innerWidth + window.innerHeight) / 2) / 1000)
};


function clearScreen() {
    Game.brush.fillStyle = Room.backgroundColor;
    Game.brush.clearRect(0, 0, Room.width, Room.height);
}

function fps(x) {
    return 1000 / x;
}

document.body.onkeydown = function(e) {
    switch(e.keyCode) {
        case 32:
            Game.Keyboard.SPACE = true;
            break;
        case 87:
            Game.Keyboard.W = true;
            break;
        case 83:
            Game.Keyboard.S = true;
            break;
        case 65:
            Game.Keyboard.A = true;
            break;
        case 68:
            Game.Keyboard.D = true;
    }
};

document.body.onkeyup = function(e) {
    switch(e.keyCode) {
        case 32:
            Game.Keyboard.SPACE = false;
            break;
        case 87:
            Game.Keyboard.W = false;
            break;
        case 83:
            Game.Keyboard.S = false;
            break;
        case 65:
            Game.Keyboard.A = false;
            break;
        case 68:
            Game.Keyboard.D = false;
    }
};


class GameObject {

    constructor(_x, _y, _width, _height) {
        this.id = Math.floor(Math.random() * 9999);
        this.x = _x;
        this.y = _y;
        this.width = _width;
        this.height = _height;
        this.canCollide = false;
        this.velocity = 0;
        Game.objects[Game.objects.length] = this;

        this.memory = {};

        this.move = {
            enabled: {
                up: true,
                down: true,
                left: true,
                right: true
            }
        };

        /*
        do {
            var idMatch = false,
                randomID = Math.floor(Math.random() * 9999);
            for(x = 0; x < Game.objects.length; x++) {
                if(Game.objects[x].id === randomID) {
                    idMatch = true;
                }
            }

            if(!idMatch) {
                this.id = randomID;
                break;
            }
        } while(true);
        */

    }
    
}

Object.defineProperty(GameObject.prototype, "id", {
    get: function(){ return this._id },
    set: function(value){ this._id = value }
});

Object.defineProperty(GameObject.prototype, "x", {
    get: function(){ return this._x },
    set: function(value){ this._x = value }
});

Object.defineProperty(GameObject.prototype, "y", {
    get: function(){ return this._y },
    set: function(value){ this._y = value }
});

Object.defineProperty(GameObject.prototype, "width", {
    get: function(){ return this._width },
    set: function(value){ this._width = value }
});

Object.defineProperty(GameObject.prototype, "height", {
    get: function(){ return this._height },
    set: function(value){ this._height = value }
});

Object.defineProperty(GameObject.prototype, "canCollide", {
    get: function(){ return this._canCollide },
    set: function(value){ this._canCollide = value }
});

Object.defineProperty(GameObject.prototype, "velocity", {
    get: function(){ return this._velocity },
    set: function(value){ this._velocity = value }
});

Object.defineProperty(GameObject.prototype, "move", {
    get: function(){ return this._move },
    set: function(value){ this._move = value }
});

Object.defineProperty(GameObject.prototype, "memory", {
    get: function(){ return this._memory },
    set: function(value){ this._memory = value }
});


Phy = {
    
    doesCollide: function(objOne, objTwo) {
        if(objOne.canCollide && objTwo.canCollide) {
            if(objOne.x + objOne.width > objTwo.x && objOne.y + objOne.height > objTwo.y && 
                objOne.x < objTwo.x + objTwo.width && objOne.y < objTwo.y + objTwo.height) {
                // Object One collided with Object Two
                return true;
            }
            
            if(objTwo.x + objTwo.width > objOne.x && objTwo.y + objTwo.height > objOne.y &&
                    objTwo.x < objOne.x + objOne.width && objTwo.y < objOne.y + objOne.height) {
                // Object Two collided with Object One
                return true;
            }
        }

        return false;
    },

    sideCollided: function(objOne, objTwo) {

        objOne.x -= Point.value * 1;

        objOne.x += Point.value * 2;
        if(this.doesCollide(objOne, objTwo)) {
            objOne.x -= Point.value * 1;
            return "LEFT";
        }
        objOne.x -= Point.value * 1;

        objOne.x -= Point.value * 1;
        if(this.doesCollide(objOne, objTwo)) {
            objOne.x += Point.value * 1;
            return "RIGHT";
        }
        objOne.x += Point.value * 1;

        objOne.y += Point.value * 1;
        if(this.doesCollide(objOne, objTwo)) {
            objOne.y -= Point.value * 1;
            return "TOP";
        }
        objOne.y -= Point.value * 1;

        objOne.y -= Point.value * 1;
        if(this.doesCollide(objOne, objTwo)) {
            objOne.y += Point.value * 1;
            return "BOTTOM";
        }
        objOne.y += Point.value * 1;

        return false;
    },

    moveObject: function(obj, distance, direction) {

        if(direction.toUpperCase() === "UP" || direction.toUpperCase() == "NORTH") {
            if(obj.move.enabled.up) {
                for(a = 0; a < distance; a++) {
                    obj.y -= Point.value * 1;
                    obj.velocity = a;
                        for(i = 0; i < Game.objects.length; i++) {
                            if(!(obj.id === Game.objects[i].id) && this.sideCollided(obj, Game.objects[i]) === "BOTTOM") {
                                obj.y += Point.value * 1;
                                obj.velocity = 0;  
                            }
                    }
                }
            }
        }

        if(direction.toUpperCase() === "RIGHT" || direction.toUpperCase() == "EAST") {
            for(a = 0; a < distance; a++) {
                obj.x += Point.value * 1;
                obj.velocity = a;
                for(i = 0; i < Game.objects.length; i++) {
                    if(!(obj.id === Game.objects[i].id) && this.sideCollided(obj, Game.objects[i]) === "LEFT" && obj.move.enabled.right) {
                        obj.x -= Point.value * 1;
                        obj.velocity = 0;  
                    }
                }
            }
        }

        if(direction.toUpperCase() === "DOWN" || direction.toUpperCase() == "SOUTH") {
            for(a = 0; a < distance; a++) {
                obj.y += Point.value * 1;
                obj.velocity = a;
                for(i = 0; i < Game.objects.length; i++) {
                    if(!(obj.id === Game.objects[i].id) && this.sideCollided(obj, Game.objects[i]) === "TOP" && obj.move.enabled.down) {
                        obj.y -= Point.value * 1;
                        obj.velocity = 0;  
                    }
                }
            }
        }

        if(direction.toUpperCase() === "LEFT" || direction.toUpperCase() == "WEST") {
            for(a = 0; a < distance; a++) {
                obj.x -= Point.value * 1;
                obj.velocity = a;
                for(i = 0; i < Game.objects.length; i++) {
                    if(!(obj.id === Game.objects[i].id) && this.sideCollided(obj, Game.objects[i]) === "RIGHT" && obj.move.enabled.left) {
                        obj.x += Point.value * 1;
                        obj.velocity = 0;  
                    }
                }
            }
        }
    },

    applyGravity: function(obj, gravityValue) {
        obj.move.enabled.up = false;
        this.moveObject(obj, gravityValue, "DOWN");
    },

    objectJump: function(obj, jumpValue, jumpWait) {
        if(jumpWait === undefined) {
            jumpWait = 30;
        }
        if(obj.memory.lastJump === undefined || Game.iterationCount - obj.memory.lastJump > jumpWait) {
            obj.memory.lastJump = Game.iterationCount;
            obj.move.enabled.up = true;
            obj.velocity = jumpValue;
            this.moveObject(obj, jumpValue, "UP");
        }
    }
};


function libUpdate() { // Used to keep updated with game engine. This happens every time the engine loops.

    for(x = 0; x < Game.objects.length; x++) {
        Game.objects[x].velocity = 0;
    } 
    Point.value = (((window.innerWidth + window.innerHeight) / 2) / 1000);
    Game.window.width = Game.window.height * (Game.window.clientWidth / Game.window.clientHeight);
}