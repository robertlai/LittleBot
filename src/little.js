import Config from './config';
import Lol from './lol';
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
					to: Config.owner,
					message: notif.username + ' is online'
				});
				console.log('Notif: ' + notif.username + ' is online');
			}
			else if(notif.online == true && status == 'offline') {
				notif.online = false;
				bot.sendMessage({
					to: Config.owner,
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
			var tokens = message.split(' ');
			if(Lol[tokens[1]]) {
				if(userID == Config.owner || _.keys(Config[Lol[tokens[1]].auth]).indexOf(userID) > -1 || (Lol[tokens[1]].auth == 'admin' && Config.freeForAll)) {
					Lol[tokens[1]].func(Config, tokens, bot, channelID);
				}
				else {
					throw new Error('Unauthorized');
				}

				bot.sendMessage({
					to: channelID,
					message: 'lol ok'
				});
			}
		}
		catch(e) {
			console.log(e);

			bot.sendMessage({
				to: channelID,
				message: 'lol nope'
			});
		}
	}

	_.forEach(Config.commands, (command) => {
		if(!command.admin || userID == Config.owner) {
			var exp = new RegExp(command.exp, (!command.case ? 'i' : ''));
			if(exp.test(message)) {
				var output = command.args;
				var pct = message.split(' ').slice(1).join(' ');
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
				console.log('Message: ' + user + ' (' + userID + ') - ' + message);
				console.log('Response: ' + output);
			}
		}
	});

	if(Config.following && userID == Config.owner && !(/^!follow$/.test(message))) {
		bot.sendMessage({
			to: channelID,
			message: message
		});
	}
});