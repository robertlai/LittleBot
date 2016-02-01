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
	console.log(bot.username + ' - (' + bot.id + ')');
	console.log(new Date());
	bot.setPresence({
		game: Config.status
	});
});

bot.on('presence', (user, userID, status, gameName, rawEvent) => {
	console.log(user);
	console.log(status);
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
			}
			else if(notif.online == true && status == 'offline') {
				notif.online = false;
				bot.sendMessage({
					to: Config.little,
					message: notif.username + ' is offline'
				});
			}
		}
	}
});

bot.on('message', (user, userID, channelID, message, rawEvent) => {
	console.log(user);
	console.log(message);
	if(userID == bot.id) { return; }

	if(/^lol /.test(message)){
		try {
			var tokens = message.split(' ').slice(2);
			if(/^lol add\s/.test(message)) {
				if(tokens[0] == 'advanced' && userID == Config.little) {
					Config.addCommand(JSON.parse(tokens.slice(1).join(' ')));
				}
				else {
					Config.addCommand({
						admin: false,
						args: tokens.slice(1).join(' '),
						case: true,
						exp: '^' + tokens[0] + '$',
						func: 'say',
						name: tokens[0]
					});
				}
			}
			else if(/^lol remove\s/.test(message)) {
				Config.removeCommand(tokens[0]);
			}
			else if(/^lol subscribe\s/.test(message) && userID == Config.little) {
				Config.addNotif(tokens[0], tokens.slice(1).join(' '));
			}
			else if(/^lol unsubscribe\s/.test(message) && userID == Config.little) {
				Config.removeNotif(tokens[0]);
			}

			bot.sendMessage({
				to: channelID,
				message: 'lol ok'
			});
		}
		catch(e) {
			bot.sendMessage({
				to: channelID,
				message: 'lol nope'
			});
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