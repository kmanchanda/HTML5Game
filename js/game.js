var game;

$(document).ready(function(){
  game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });
});

var bg;
var bricks;
var paddle;
var ball;

var ballOnPaddle = true;

function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.image('starfield', 'assets/starfield.jpg');
    game.load.atlas('breakout', 'assets/breakout.png', 'assets/breakout.json');

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    bg = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    // create bricks
    bricks = game.add.group();
    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 15; x++)
        {
            var brick = bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y+1) + '_1.png');
            game.physics.enable(brick, Phaser.Physics.ARCADE);
            brick.body.immovable = true;
        }
    }

    // create paddle
    paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_big.png');
    paddle.anchor.setTo(0.5, 0.5);

    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;

    // create ball
    ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
    ball.anchor.setTo(0.5, 0.5);

    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    
    // add input handler
    game.input.onDown.add(releaseBall, this);

}

function update () {
    game.physics.arcade.collide(ball, paddle, null, null, this);
    game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
}

function releaseBall () {
    console.log('[input event] click');
    if (ballOnPaddle)
    {
        ballOnPaddle = false;
        ball.body.velocity.x = -75;
        ball.body.velocity.y = -300;
    }
}

function ballHitBrick (_ball, _brick) {
    _brick.kill();
}