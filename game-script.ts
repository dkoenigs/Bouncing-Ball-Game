import {
    Sprite,
    Container,
    Application,
    Rectangle,
    Graphics,
    DisplayObject,
    Text,
    Circle,
    RoundedRectangle
} from "pixi.js";

export class Ball {
    sprite: Sprite;
    direction: number = 1;
    acceleration: number = 1.1;
    velocity: number = 0;
    constructor(sprite: Sprite) {
        this.sprite = sprite;
    }
}

const app: Application = new Application(500, 500);
document.body.appendChild(app.view);

let background: Sprite = Sprite.fromImage("./Blue.jpg");
background.x = 0;
background.y = 0;
background.scale.x = 0.5;
background.scale.y = 0.5;

app.stage.addChild(background);

// Setting up task of the game
let task: Text = new Text("Make it to the other side of the river!");
task.x = 45;
task.y = 10;
task.style.fill = 0xffffff;
app.stage.addChild(task);


// Setting up water Sprite:
let lineW: Sprite = Sprite.fromImage("./water.png");
lineW.x = 0;
lineW.y = 495;
lineW.scale.x = 0.5;
lineW.scale.y = 0.005;
app.stage.addChild(lineW);

// Setting up platform Sprites:
let line0: Sprite = Sprite.fromImage("./wood.jpg");
line0.x = 0;
line0.y = 490;
line0.scale.x = 0.040;
line0.scale.y = 0.01;
app.stage.addChild(line0);

let line1: Sprite = Sprite.fromImage("./Black.jpg");
line1.x = 120;
line1.y = 490;
line1.scale.x = 0.030;
line1.scale.y = 0.01;
app.stage.addChild(line1);

let line2: Sprite = Sprite.fromImage("./Black.jpg");
line2.x = 220;
line2.y = 490;
line2.scale.x = 0.030;
line2.scale.y = 0.01;
app.stage.addChild(line2);

let line3: Sprite = Sprite.fromImage("./Black.jpg");
line3.x = 320;
line3.y = 490;
line3.scale.x = 0.030;
line3.scale.y = 0.01;
app.stage.addChild(line3);

let line4: Sprite = Sprite.fromImage("./wood.jpg");
line4.x = 438;
line4.y = 490;
line4.scale.x = 0.040;
line4.scale.y = 0.01;
app.stage.addChild(line4);


// Setting up ball
let sprite: Sprite = Sprite.fromImage("./bball.png");
sprite.scale.x = 0.1;
sprite.scale.y = 0.1;
sprite.x = 0;
sprite.y = 90;
let ball: Ball = new Ball(sprite);
app.stage.addChild(ball.sprite);



// Checking collisions with ground
export function detectCollision(ball: DisplayObject): boolean {
    return ball.y > 415 && ball.y < 430;
}

export function detectDeath(ball: DisplayObject): boolean {
    return ((ball.y > 410 && ball.y < 430) && ((ball.x > 30 && ball.x < 90) || (ball.x > 130 && ball.x < 200) || (ball.x > 230 && ball.x < 300) || (ball.x > 350 && ball.x < 400)));
}

export function detectWin(ball: DisplayObject): boolean {
    return (ball.y > 415 && ball.y < 430) && (ball.x > 390 && ball.x < 500);
}

// Moving Ball
export function moveBall(direction: number, acceleration: number): void {
    ball.direction = direction;
    ball.acceleration = acceleration;

    ball.velocity = ball.velocity + (ball.direction * ball.acceleration);
    ball.sprite.y = ball.sprite.y + (ball.direction * ball.velocity);
}

export function resetBall(): void {
    ball.sprite.x = 0;
    ball.sprite.y = 90;
    ball.direction = 1;
    ball.acceleration = 1.1;
    ball.velocity= 0;

}

// Winning Message
let outcome: boolean = false;
let message: Text = new Text("You Won!");
let messageBox: Graphics = new Graphics();

export function gameOutcome(result: boolean): void {
    if (result === true) {
        message.x = 210;
        message.y = 236;
        message.style.fill = 0xffffff;
        messageBox.beginFill(0x008000, 0.4);
        messageBox.drawRect(0, 0, 120, 50);
        messageBox.x = 250 - 45;
        messageBox.y = 250 - 25;
        app.stage.addChild(messageBox);
        app.stage.addChild(message);
        outcome = true;
        resetBall();
    }
}

// Setting Up Keyboard Handlers
window.onkeydown = function(event: KeyboardEvent): void {
    if (event.keyCode === 37) {ball.sprite.x -= 20;} //Left
    else if (event.keyCode === 39) {ball.sprite.x += 20;}
}


//Ticker Function
app.ticker.add(function(delta: number): void {
    
    if (detectDeath(ball.sprite)) {
        resetBall();

    } else if (detectWin(ball.sprite)) {
        gameOutcome(true);

    } else if (detectCollision(ball.sprite)) {
        console.log("Collision Detected");
        moveBall(-1, 1.1);
        app.stage.removeChild(message);
        app.stage.removeChild(messageBox);
        outcome = false;

    } else if (ball.velocity < 0) {
        console.log("Zero Velocity Detected")
        moveBall(1, 1.0981);

    } else if (ball.sprite.y > 410 && ball.velocity < 1.5) {
        console.log("Stopped Bouncing Detected");
        ball.velocity = 0;
        ball.sprite.y = 410.0001;
        moveBall(ball.direction, 0);

    } else {
        moveBall(ball.direction, ball.acceleration);

    }
});