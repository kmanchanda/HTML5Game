var game;

$(document).ready(function(){
  game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });
});

var bg;

function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.image('starfield', 'assets/starfield.jpg');
    game.load.atlas('breakout', 'assets/breakout.png', 'assets/breakout.json');

}

function create() {

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    bg = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    bg = game.add.sprite(100, 100, 'breakout', 'brick_3_1.png');

}