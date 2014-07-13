var game;

$(document).ready(function(){
  game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
  $('#mute-button').click(function(){
    game.sound.mute = !game.sound.mute;
  });
  $('#pause-button').click(function(){
    game.paused = !game.paused;
  });
});

var bg;
var bricks;
var paddle;
var ball;

var ballOnPaddle = true;
var score = 0;
var lives = 3;
var gameOverFlag = false;

var scoreText;
var livesText;
var introText;

function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.image('starfield', 'assets/starfield.jpg');
    game.load.atlas('breakout', 'assets/breakout.png', 'assets/breakout.json');

    game.load.audio('boden', ['assets/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/bodenstaendig_2000_in_rock_4bit.ogg']);
    game.load.audio('squit', ['assets/squit.mp3', 'assets/squit.ogg']);

}

function create() {
    game.time.advancedTiming = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;

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
    
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballLost, this);

    ball.animations.add('spin', [ 'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 50, true);
    
    // add input handler
    game.input.onDown.add(releaseBall, this);

    // scoring
    scoreText = game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
    livesText = game.add.text(680, 550, 'lives: ' + lives, { font: "20px Arial", fill: "#ffffff", align: "left" });
    introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
    introText.anchor.setTo(0.5, 0.5);

    // background music
    var music = game.add.audio('boden');
    music.play('', 0, 1, true);
}

function update () {
    // move paddle based on mouse input
    paddle.body.x = Math.min(game.input.x, game.width - paddle.width);
    if (ballOnPaddle)
    {
        ball.body.x = paddle.x;
    }

    // collision checks
    game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
    game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
}

function render () {
    game.debug.text('FPS: ' + game.time.fps, 20, 20, 'rgb(255,0,0)');
}

function releaseBall () {
    console.log('[input event] click');
    if (gameOverFlag) {
        gameOverFlag = false;
        resetGame();
    }
    else if (ballOnPaddle)
    {
        ballOnPaddle = false;
        ball.body.velocity.x = -75;
        ball.body.velocity.y = -300;
        introText.visible = false;
        ball.animations.play('spin');
    }
}

function ballHitBrick (_ball, _brick) {
    _brick.kill();

    score += 10;
    scoreText.text = 'score: ' + score;

    var music = game.add.audio('squit');
    music.play();

    //  are all bricks finished - start new level
    if (bricks.countLiving() === 0)
    {
        score += 1000;
        scoreText.text = 'score: ' + score;
        introText.text = '- Next Level -';
        introText.visible = true;

        resetBall ();
        bricks.callAll('revive');
    }
}

function ballHitPaddle (_ball, _paddle) {
    // where on the paddle did the ball hit
    var diff = _paddle.x - _ball.x;

    if (diff !== 0)
    {
        // for left/right side impact, give a increase the angle of bounce
        _ball.body.velocity.x = -10 * diff;
    }
    else
    {
        // for center impact, add a random velocity shift
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }
}

function ballLost () {
    lives--;
    livesText.text = 'lives: ' + lives;

    resetBall();

    if(lives === 0) {
        gameOver();
    }
}

function resetBall () {
    ballOnPaddle = true;
    ball.reset(paddle.x + 16, paddle.y - 16);
    ball.animations.stop();
}

function gameOver () {
    introText.text = 'Game Over !!!';
    introText.visible = true;
    gameOverFlag = true;
}

function resetGame () {
    score = 0;
    lives = 3;
    introText.text = '- click to start -';
    scoreText.text = 'score: ' + score;
    livesText.text = 'lives: ' + lives;
    bricks.callAll('revive');
}