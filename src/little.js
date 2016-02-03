import Config from './config';
import DiscordClient from 'discord.io';
import _ from 'lodash';

var bot = new DiscordClient(Config.discord);

function roll(num) {
	var max = 100;
	if (/^[0-9]+$/.test(num)){
		max = num;
	}
	return Math.floor((Math.random() * max) + 1);
}

function transform(value, pct, hash) {
	value = value.replace('%', pct);
	value = value.replace('#', hash);
	return value;
}
 
bot.on('ready', () => {
	console.log('Bot: ' + bot.username + ' - (' + bot.id + ')');
	console.log('Started: ' + new Date());
	bot.setPresence({
		game: Config.status
	});
	console.log('Status: ' + Config.status);
});

bot.on('presence', (user, userID, status, gameName, rawEvent) => {
	if (Config.notifsEnabled){
		var notif = Config.notifications[userID];
		if(!notif) { return; }
		if(notif.enabled == true) {
			if(notif.online == false && status == 'online') {
				notif.online = true;
				bot.sendMessage({
					to: Config.little,
					message: notif.username + ' is online'
				});
				console.log('Notif: ' + notif.username + ' is online');
			}
			else if(notif.online == true && status == 'offline') {
				notif.online = false;
				bot.sendMessage({
					to: Config.little,
					message: notif.username + ' is offline'
				});
				console.log('Notif: ' + notif.username + ' is offline');
			}
		}
	}
});

bot.on('message', (user, userID, channelID, message, rawEvent) => {
	if(userID == bot.id) { return; }

	if(/^lol/.test(message)) {
		try {
			if(userID != Config.little) {
				throw new Error('Not authorized');
			}

			var tokens = message.split(' ');

			if(!tokens[1]) {
				throw new Error('Invalid command');
			}
			if(tokens[1] == 'add') {
				if(!tokens[2] || !tokens[3]) {
					throw new Error('Invalid params');
				}
				var newCommand;
				if(tokens[2] == 'advanced' && userID == Config.little) {
					newCommand = JSON.parse(tokens.slice(3).join(' '));
					Config.addCommand(newCommand);
					console.log('Added command: ' + newCommand.name || newCommand.exp);
				}
				else {
					newCommand = {
						admin: false,
						args: tokens.slice(3).join(' '),
						case: true,
						exp: '^' + tokens[2] + '$',
						func: 'say',
						name: tokens[2]
					};
					Config.addCommand(newCommand);
					console.log('Added command: ' + newCommand.name);
				}
			}
			else if(tokens[1] == 'list') {
				bot.sendMessage({
					to: channelID,
					message: JSON.stringify(Config.commands, null, '	')
				});
			}
			else if(tokens[1] == 'remove') {
				if(!tokens[2]) {
					throw new Error('Invalid params');
				}
				Config.removeCommand(tokens[2]);
				console.log('Removed command: ' + tokens[2]);
			}
			else if(tokens[1] == 'subscribe' && userID == Config.little) {
				if(!tokens[2] || !tokens[3]) {
					throw new Error('Invalid params');
				}
				Config.addNotif(tokens[2], tokens.slice(3).join(' '));
				console.log('Subscribed to: ' + tokens[2]);
			}
			else if(tokens[1] == 'unsubscribe' && userID == Config.little) {
				if(!tokens[2]) {
					throw new Error('Invalid params');
				}
				Config.removeNotif(tokens[2]);
				console.log('Unsubscribed from: ' + tokens[2]);
			}
			else {
				throw new Error ('Invalid command');
			}

			bot.sendMessage({
				to: channelID,
				message: 'lol ok'
			});
		}
		catch(e) {
			console.log(e);

			if(e.message == 'Invalid params' || e.message == 'Not authorized'){
				bot.sendMessage({
					to: channelID,
					message: 'lol nope'
				});
			}
		}
	}

	_.forEach(Config.commands, (command) => {
		if(!command.admin || userID == Config.little) {
			var exp = new RegExp(command.exp, (!command.case ? 'i' : ''));
			if(exp.test(message)) {
				var output = command.args;
				var pct = message.substring(message.split(' ')[0].length);
				var hash = '<@' + userID + '>';

				if(command.func == 'say') {
					if(command.special) {
						output = transform(output, pct, hash);
					}
					bot.sendMessage({
						to: channelID,
						message: output,
						tts: command.tts
					});
				}
				else if(command.func == 'roll') {
					pct = roll(pct);
					if(command.special) {
						output = transform(output, pct, hash);
					}
					bot.sendMessage({
						to: channelID,
						message: output,
						tts: command.tts
					});
				}
				else if(command.func == 'toggle') {
					Config.toggle(command.args);
				}
				else if(command.func == 'status') {
					if(command.special) {
						output = transform(output, pct, hash);
					}
					Config.setStatus(output);
					bot.setPresence({
						game: output
					});
				}
				console.log('Message: ' + userID + ' - ' + message);
				console.log('Output: ' + output);
			}
		}
	});

	if(Config.following && userID == Config.little && !(/^!follow$/.test(message))) {
		bot.sendMessage({
			to: channelID,
			message: message
		});
	}
});