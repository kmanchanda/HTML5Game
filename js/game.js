var game;

$(document).ready(function(){
  game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });
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
            bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y+1) + '_1.png');
        }
    }

    // create paddle
    paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_big.png');
    paddle.anchor.setTo(0.5, 0.5);

    // create ball
    ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
    ball.anchor.setTo(0.5, 0.5);

    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    
    // add input handler
    game.input.onDown.add(releaseBall, this);

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