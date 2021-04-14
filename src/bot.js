DISCORDJS_BOT_TOKEN='';

const { Client } = require('discord.js');
const bot = new Client();
const PREFIX = "!";

var players = []
var votes = [];
var hasVoted = [];
var votedFor = [];
var mafia = [];
var scores = [];
var num_mafia = 1;
var round_active = false;
var end_game = false;

bot.on('ready', () => {
	console.log(`${bot.user.username} has logged in.`);
});

function validPlayer(id) {
	return (players.includes(id) && round_active === true) ? true : false;
}

function nextRound(message) {
	end_game = false;
	round_active = false;
	output = 'Leaderboard:\n';
	for (var i = scores.length - 1; i >= 0; i--) {
		output += '<@' + players[i] + '>: ' + scores[i] + '\n';
	}
	message.channel.send(output);
}

function help(command) {
	if (command === 'clear') {
		return '!clear\n"Restarts" the game, clears all the players and scores out of memory.';
	} else if (command === 'score'){
		return '!score\nReplys with the current score of the player who used the command.';
	} else if (command === 'leaderboard'){
		return '!leaderboard\nReplys with the scores of all players in the game.';
	} else if (command === 'join'){
		return '!join\nAdds the user of the command to the game.';
	} else if (command === 'vote'){
		return '!vote {Player}\nCasts a vote for a player, used at the end of the Rocket League game. Must be @mentions to work properly.';
	} else if (command === 'num-mafia'){
		return '!num-mafia {Number}\nSets the number of mafia, the game cannot be start with a higher number of mafia than number of players.';
	} else if (command === 'start'){
		return '!start\nStarts the game by sending a direct message to everyone with their role.';
	} else if (command === 'help') {
		return '!help\nLists commands and descriptions or specific command if one is specified.';
	} else if (command === 'winner'){
		return '!winner {Player} {Player} {Player}\nLists the 3 players who won the rocket league game, must be @messages';
	} else {
		return 'Command ' + PREFIX + command + ' not recognized';
	}
}

bot.on('message', (message) => {
	if (message.author.bot) return;

	if (message.content.startsWith(PREFIX)) {
		const [cmd, ...args] = message.content
			.trim()
			.substring(PREFIX.length)
			.split(/\s+/);
		
		if (cmd === 'clear') {
			players = [];
			scores = [];
			message.channel.send('Player list and scores has been cleared');
		} else if (cmd === 'score') {
			if (!players.includes(message.author.id)) {
				message.reply('You are not in the game.');
			} else if (scores.length === 0) {
				message.reply('Your score is 0');
			} else {
				message.reply('Your score is ' + scores[players.indexOf(message.author.id)]);
			}
		} else if (cmd === 'leaderboard') {
			if (scores.length === 0) {
				message.reply('Nobody has scored yet');
			} else {
				output = 'Leaderboard:\n';
				for (var i = scores.length - 1; i >= 0; i--) {
					output += '<@' + players[i] + '>: ' + scores[i] + '\n';
				}
				message.channel.send(output);
			}
		} else if (cmd === 'join') {
			if (players.includes(message.author.id)) {
				message.reply('You are already in the game.');
			} else {
				players.push(message.author.id);
				message.reply('You have joined the game!')
			}
		} else if (cmd === 'vote') {
			if (round_active === false) {
				message.reply('The round has not started.');
			} else if (!players.includes(message.author.id)) {
				message.reply('You are not in the game');
			} else if (args[0] === undefined) {
				message.reply('Please tag a player to vote for');
			} else if (hasVoted[players.indexOf(message.author.id)]) {
				message.reply('You have already voted');
			} else if (args[0].length !== 22 || !args[0].startsWith('<')) {
				message.reply('Make sure to @ mention the player you are voting for');
			} else if (!players.includes(args[0].substring(3,21))) {
				message.reply('They are not playing the game');
			} else {
				hasVoted[players.indexOf(message.author.id)] = true;
				votedFor[players.indexOf(message.author.id)] = players.indexOf(args[0].substring(3,21));
				votes[players.indexOf(args[0].substring(3,21))]++;
				message.reply('Your vote has been submitted');
				if (!hasVoted.includes(false)) {
					end_game = true;
					output = 'Everyone has voted and the mafia are:\n';
					for (var i = mafia.length - 1; i >= 0; i--) {
						output += "<@" + players[mafia[i]] + ">\n"
					}
					message.channel.send(output);
					message.channel.send('Type !winner to assign points');
				}
			}
		} else if (cmd === 'num-mafia') {
			if (args[0] > 0) {
				num_mafia = args[0];
				message.channel.send('Number of mafia has been set to ' + num_mafia);
			} else if (args[0] === undefined) {
				message.channel.send('Please enter the number of mafia you would like');
			} else {
				message.channel.send('Only numerical values greater than 0 are accepted');
			}
		} else if (cmd === 'start') {
			if (players.length < num_mafia) {
				message.channel.send('Not enough players, perhaps less mafia?');
				return;
			} else if (players.length === 0) {
				message.channel.send('Nobody is in the game...');
				return;
			} else if (round_active === true) {
				message.reply('The game is already started');
				return;
			}
			votes = [];
			hasVoted = [];
			votedFor = [];
			mafia = [];
			for (var i = players.length - 1; i >= 0; i--) {
				votes[i] = 0;
				hasVoted[i] = false;
			}
			for (var i = num_mafia - 1; i >= 0; i--) {
				while (true) {
					rand = Math.floor(Math.random()*players.length);
					if (!mafia.includes(rand)) {
						mafia.push(rand);
						break;
					}
				}
			}
			for (var i = players.length - 1; i >= 0; i--) {
				if (mafia.includes(i)) {
					bot.users.cache.get(players[i]).send('You are Mafia');
				} else {
					bot.users.cache.get(players[i]).send('You are Innocent');
				}
			}
			while (players.length > scores.length){
				scores.push(0);
			}
			round_active = true;
			message.channel.send('Players may join their teams, after the game is completed !vote');
		} else if (cmd === 'winner') {
			if (round_active === false) {
				message.reply('Game has not started.');
			} else if (end_game === false) {
				message.reply('Not everyone has voted');
				console.log(hasVoted);
			} else if (args[0] === undefined || args[1] === undefined || args[2] === undefined) {
				message.reply('Please enter the 3 players who won');
			} else if (args[0].length !== 22 || !args[0].startsWith('<') || args[1].length !== 22 || !args[1].startsWith('<') || args[2].length !== 22 || !args[2].startsWith('<')) {
				message.reply('Make sure you are @mentioning the players who won');
			} else {
				for (var i = mafia.length - 1; i >= 0; i--) {
					if (votes[mafia[i]] < 3) {
						if (!mafia.includes(players.indexOf(args[0].substring(3,21))) && !mafia.includes(players.indexOf(args[1].substring(3,21))) && !mafia.includes(players.indexOf(args[2].substring(3,21)))) {
							scores[mafia[i]] += 3;
						}
					}
				}
				for (var i = players.length - 1; i >= 0; i--) {
					for (var j = mafia.length - 1; j >= 0; j--) {
						if (players[votedFor[i]] === players[mafia[j]] && !mafia.includes(i)) {
							scores[i]++;
							var argsshort = [];
							for (var k = args.length - 1; k >= 0; k--) {
								argsshort[k] = args[k].substring(3,21);
							}
							if (argsshort.includes(players[i])) {
								scores[i]++;
							}
						}
					}
				}

				nextRound(message);
			}
		} else if (cmd === 'help') {
			output = '```';
			if (args[0] === undefined) {
				output += '!clear\n"Restarts" the game, clears all the players and scores out of memory.\n!winner {Player} {Player} {Player}\nLists the 3 players who won the rocket league game, must be @messages\n!score\nReplys with the current score of the player who used the command.\n!leaderboard\nReplys with the scores of all players in the game.\n!join\nAdds the user of the command to the game.\n!vote {Player}\nCasts a vote for a player, used at the end of the Rocket League game. Must be @mentions to work properly.\n!num-mafia {Number}\nSets the number of mafia, the game cannot be start with a higher number of mafia than number of players.\n!start\nStarts the game by sending a direct message to everyone with their role.\n!help {command}\nLists commands and descriptions or specific command if one is specified.';
			} else {
				for (var i = 0; i < args.length; i++) {
					output += help(args[i]) + '\n';
				}
			}
			output += '```';
			message.channel.send(output);
		} 
	}
});

bot.login(DISCORDJS_BOT_TOKEN);