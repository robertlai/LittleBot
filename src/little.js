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
			if(/^lol add /.test(message)) {
				if(/^lol add advanced /.test(message) && userID == Config.little) {
					Config.addCommand(JSON.parse(message.substring(17)));
				}
				else {
					Config.addCommand({
						admin: false,
						args: message.substring(9 + message.split(' ')[2].length),
						case: true,
						exp: '^' + message.split(' ')[2] + '$',
						func: 'say',
						name: message.split(' ')[2]
					});
				}
			}
			else if(/^lol remove /.test(message)) {
				Config.removeCommand(message.split(' ')[2]);
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