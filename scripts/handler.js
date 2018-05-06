
/*
** USER-DEFINED ENGINE OPTIONS
*/

Game.window.width = window.innerWidth;
Game.window.height = window.innerHeight;

Room.width = Game.window.width;
Room.height = Game.window.height;


load();

setInterval(function() {

    
    
    if(Game.active) {

        libUpdate();

        try {
            
            clearScreen();

            if(update() === 1 && draw() === 1 && Game.active) {
                Game.iterationCount += 1;
            } else {
                if(update() !== 1) {
                    throw "Update function execution failure.";
                } else if(draw() !== 1) {
                    throw "Draw function execution faulure.";
                } else {
                    throw "Unknown execution failure.";
                }
            }

            
        }
    
        catch(e) {
            Game.active = false;
            end();
        }
    } else {

        end();


        
    }

}, Game.fps);