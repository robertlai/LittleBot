import _ from 'lodash';

var Lol = {
	add: {
		auth: 'admin',
		func: (config, tokens, bot, channel) => {
			if(!tokens[2] || !tokens[3]) {
				throw new Error('Invalid params');
			}

			var newCommand;
			if(tokens[2] == 'advanced') {
				newCommand = JSON.parse(tokens.slice(3).join(' '));
			}
			else {
				newCommand = {
					args: tokens.slice(3).join(' '),
					case: true,
					exp: '^' + tokens[2] + '$',
					func: 'say',
					name: tokens[2]
				};
			}

			var currentCommands = _(config.commands).map((command) => {
				return [command.name, command.exp];
			})
			.flatten()
			.compact()
			.value();

			if(currentCommands.indexOf(newCommand.name) + currentCommands.indexOf(newCommand.exp) > -2) {
				throw new Error('Conflict error');
			}
			else {
				config.addCommand(newCommand);
				console.log('Added command: ' + newCommand.name || newCommand.exp);
			}
		}
	},
	list: {
		auth: 'admin',
		func: (config, tokens, bot, channel) => {
			bot.sendMessage({
				to: channel,
				message: JSON.stringify(config.commands, null, '\t')
			});
		}
	},
	remove: {
		auth: 'admin',
		func: (config, tokens, bot, channel) => {
			if(!tokens[2]) {
				throw new Error('Invalid params');
			}
			config.removeCommand(tokens[2]);
			console.log('Removed command: ' + tokens[2]);
		}
	},
	subscribe: {
		auth: 'owner',
		func: (config, tokens, bot, channel) => {
			if(!tokens[2] || !tokens[3]) {
				throw new Error('Invalid params');
			}
			config.addNotif(tokens[2], tokens.slice(3).join(' '));
			console.log('Subscribed to: ' + tokens[2]);
		}
	},
	unsubscribe: {
		auth: 'owner',
		func: (config, tokens, bot, channel) => {
			if(!tokens[2]) {
				throw new Error('Invalid params');
			}
			config.removeNotif(tokens[2]);
			console.log('Unsubscribed from: ' + tokens[2]);
		}
	},
	listen: {
		auth: 'owner',
		func: (config, tokens, bot, channel) => {
			if(!tokens[2] || !tokens[3]) {
				throw new Error('Invalid params');
			}
			config.addAdmin(tokens[2], tokens.slice(3).join(' '));
			console.log('Added admin: ' + tokens[2]);
		}
	},
	unlisten: {
		auth: 'owner',
		func: (config, tokens, bot, channel) => {
			if(!tokens[2]) {
				throw new Error('Invalid params');
			}
			config.removeAdmin(tokens[2]);
			console.log('Removed admin: ' + tokens[2]);
		}
	}
};

export default Lol;
