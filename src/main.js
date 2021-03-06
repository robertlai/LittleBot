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
});

bot.login(Config.email, Config.password, () => {
	console.log('>Logging in...');
});