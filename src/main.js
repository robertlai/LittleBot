import Discord from 'discord.js';

import Config from '../config.conf';

import Data from './data';

import CommonCommands from './commands/commonCommands';
import AdminCommands from './commands/adminCommands';
import OwnerCommands from './commands/ownerCommands';

var bot = new Discord.Client();

bot.on('ready', () => {
	console.log('>Logged in.');
	console.log('================================================================');
	console.log('Username: ' + bot.internal.user.username);
	console.log('UserID: ' + bot.internal.user.id);
	console.log('Server count: ' + bot.internal.servers.length);
	console.log('Channel count: ' + bot.internal.channels.length);
	console.log('Time: ' + new Date());
	console.log('================================================================');
	console.log('>Listening...');
});

bot.on('message', (message) => {
	if(message.author.id === bot.internal.user.id) {
		return;
	}
	OwnerCommands(message, bot, Data, Config);
	AdminCommands(message, bot, Data);
	CommonCommands(message, bot, Data);

	console.log('>Received a message.');
	console.log('================================================================');
	console.log('Server: ' + message.channel.server.name + '(' + message.channel.server.id + ')');
	console.log('Channel: ' + message.channel.name + '(' + message.channel.id + ')');
	console.log('Author: ' + message.author.username + '(' + message.author.id + ')');
	console.log('Content: ' + message.content);
	console.log('================================================================');
});

bot.login(Config.email, Config.password, () => {
	console.log('>Logging in...');
});