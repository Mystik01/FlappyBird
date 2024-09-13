# Flappy Bird

P5 produce basic documentation for a working game

D2 produce detailed technical documentation for a working game

# User Documentation

## Installation:

Flappy Bird is a web based game written in JavaScript so can be played in your browser. I have provided the local code attached in a zip file but shouldn’t need to install anything to run it. 

### Running online:

I have the game running on my GitHub live so shouldn’t require any installation. On there you can also view the code without downloading it. This will be the most up-to-date version as well. 

[https://mystik01.github.io/FlappyBird/public/](https://mystik01.github.io/FlappyBird/public/)


### Running locally:

To run the game simply direct into the ~/public folder and open the index.html file.

## How to play?

The game is quite simple to play, simply hit space or click with your mouse if running on a computer to make the bird jump. The aim of the game is to get through as many gaps as possible and your live score is tracked in the top left. 

The games does also work on mobile but is not as responsive and not recommended. 

## Reporting bugs:

Bugs can be reported into my Github through this link [https://github.com/Mystik01/FlappyBird/issues/new/choose](https://github.com/Mystik01/FlappyBird/issues/new/choose)

This will allow you to either create a bug report or feedback report. Users are also welcome to collaborate and expand on the code/improve it’s performance or compatibility and can submit that in the PR section.

## Technical info:

The game tracks your highest score in your browsers cookies and is the only data which it tracks and stores. The whole game is client sided and the code is only hosted GitHub. The actual game is run on your pc so if you have an older/slower computer it may impact the performance. All computers and mobiles should be able to run this fine without any performance issues however mobile isn’t completely compatible. You do need to have a newish/updated browser to play, e.g old internet explorer would not be able to run this. This shouldn’t be an issue for majority of users. 

Have had some issues where the bird’s hitbox is hitting the walls when visually it is not. This is because the image the the bird is not exactly cut around the bird. I haven’t been able to find a fix for this and have cropped it as tight as possible. 

You can view the hitbox by opening your browser console (`F12` or `CTRL+SHIFT+I`) and typing into the console `debugMode = true` . You can achieve the same by clicking `CTRL + ALT + SHIFT + S` .

You can view the raw game code here:

https://github.com/Mystik01/FlappyBird/blob/18e13ec15eafbc0e1f0376120d0e7ae5c6d51736/public/game1.js#L1-L372

---

## Program Development

I was inspired to make my own version of Flappy Bird by the game’s iconic graphics and simple layout. Flappy Bird’s simplicity is what makes it appealing and widely playable. In addition to being simple to understand and play, the goal of the game is to pass between pipes to get the highest score. This design also makes coding the game simpler. Because of the simple goal and mechanics of the game, creating a variant would be both an easy attempt and a chance to add to a beloved genre.
I chose to write it in JavaScript as it can be easily run by anyone on any device allowing anyone to play without any issues. I am familiar with JavaScript from experience and knew it could be a simple task.
I also used Visual Studio Code as I find it to be the best text-editor (in my opinion) for it’s simple design and ability to customise it in any way you want and have extensions to help make your programming experience more efficient. Visual Studio Code also allowed me to connect to my GitHub codespace where I was actively writing and testing the program and synchronising it with GitHub.

## Data Use

In the game, player scores are dynamically managed using variables, with the live score displayed in the top right or when the player dies/game ends. Only the highest score achieved is saved between sessions by storing it in cookies, ensuring that new higher scores always replace lesser ones. Player jumps are enabled through responsive input methods like spacebar presses, mouse clicks, or touchscreen taps. However, the game continuously generates obstacles, such as pipes, in real-time, without saving their positions, focusing solely on the immediate gameplay experience and scorekeeping.

## Development of other parts of the game

The actual bird image: <img src="https://github.com/Mystik01/FlappyBird/blob/main/public/bird4.png?raw=true" width="25" height="25" title="Colorful bird">

Was created based on the original flappy bird but wanted to have my own version of it. My version has more colours and has slightly more complexity to it. The colours used are reflected with the background of my version of the game. Every other part of the game is rendered using Javascript and the [Canvas API using HTML](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). This is why the game is simple and easy to run as it uses very light weight renders which are already built into your browser.


<img src="https://i.ibb.co/5MPHJXT/palette.png" alt="palette" border="0">
    
