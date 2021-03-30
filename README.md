# Rocket League Mafia Bot
A rocket league mafia discord bot written with discord.js
## Explination
Rocket League Mafia is a game where some players are designated 'mafia' while others are 'innocent'. Innocent players play to win the game of rocket league while looking out for the mafia, who are trying to lose on purpse. Points are awarded based on how well you do, 3 points are given to a mafia who is successfully able to lose the game without getting detected (3/5 of the innocent votes). 1 point is also awarded to ever innocent player who guesses the correct mafia.
### Note to players
If you are just looking to play the bot and not host it yourself you can click on the following link and add it to your server. https://discord.com/oauth2/authorize?client_id=825993043903643689&scope=bot
## Commands
### !clear
"Restarts" the game, clears all the players and scores out of memory.
### !score
Replys with the current score of the player who used the command.
### !leaderboard
Replys with the scores of all players in the game.
### !join
Adds the user of the command to the game.
### !vote {Player}
Casts a vote for a player, used at the end of the Rocket League game. Must be @mentions to work properly.
### !num-mafia {Number}
Sets the number of mafia, the game cannot be start with a higher number of mafia than number of players.
### !start
Starts the game by sending a direct message to everyone with their role.
### !help {command}
Lists commands and descriptions or specific command if one is specified. 
## Requirements
* node.js
* A discord account
## Setup
Add discord bot token to first line of bot.js
* Run `npm install discord.js` inside of the directory with the mafia bot
* Start the bot with `npm run start`
