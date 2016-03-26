import _ from 'lodash';

function OwnerCommands(message, bot, Data, Config) {
	try {
		if(/^lol status/.test(message.content)) {
			console.log('>Received status command.');
			if(message.author.id !== Config.owner) {
				throw new Error('Unauthorized');
			}
			const status = message.content.split(' ').slice(2).join(' ');
			bot.setStatus(
				'online',
				status
			);
			bot.sendMessage(
				message.channel,
				'lol ok'
			);
			console.log('>Set status.');
			console.log('================================================================');
			console.log('Status: ' + status);
			console.log('================================================================');
		}
		else if(/^lol reload$/.test(message.content)) {
			console.log('>Received reload command.');
			if(message.author.id !== Config.owner) {
				throw new Error('Unauthorized');
			}
			Data.loadData();
			bot.sendMessage(
				message.channel,
				'lol ok'
			);
			console.log('>Reloaded data.');
		}
		else if(/^lol listen/.test(message.content)) {
			console.log('>Received listen command.');
			if(message.author.id !== Config.owner) {
				throw new Error('Unauthorized');
			}
			if(/^lol listen(\s*<@\d+>\s*)+$/.test(message.content)){
				const users = _.map(message.mentions, (user) => _.pick(user, ['id', 'username']));
				const usersString = _.map(users, 'username').join(', ');
				Data.admin = _.unionBy(Data.admin, users, 'id');
				console.log('>Added admin.');
				console.log('================================================================');
				console.log('Users: ' + usersString);
				console.log('Time: ' + new Date());
				console.log('================================================================');
				Data.writeData();
				bot.sendMessage(
					message.channel,
					'lol ok'
				);
			}
			else {
				throw new Error('Invalid parameters');
			}
		}
		else if(/^lol unlisten/.test(message.content)) {
			console.log('>Received unlisten command.');
			if(message.author.id !== Config.owner) {
				throw new Error('Unauthorized');
			}
			if(/^lol unlisten(\s*<@\d+>\s*)+$/.test(message.content)){
				const users = _.map(message.mentions, (user) => _.pick(user, ['id', 'username']));
				const usersString = _.map(users, 'username').join(', ');
				Data.admin = _.differenceBy(Data.admin, users, 'id');
				console.log('>Removed admin.');
				console.log('================================================================');
				console.log('Users: ' + usersString);
				console.log('Time: ' + new Date());
				console.log('================================================================');
				Data.writeData();
				bot.sendMessage(
					message.channel,
					'lol ok'
				);
			}
			else {
				throw new Error('Invalid parameters');
			}
		}
		else if(/^lol admin$/.test(message.content)) {
			console.log('>Received admin command.');
			const adminList = _.map(Data.admin, (user) => {
				return `- ${user.username} (${user.id})`;
			});
			bot.sendMessage(
				message.channel,
				'**Administrators:**\n' + adminList.join('\n')
			);
			console.log('>Posted admin list.');
		}
		else if(/^lol ignore/.test(message.content)) {
			console.log('>Received ignore command.');
			if(message.author.id !== Config.owner) {
				throw new Error('Unauthorized');
			}
			if(/^lol ignore(\s*<@\d+>\s*)+$/.test(message.content)){
				const users = _.map(message.mentions, (user) => _.pick(user, ['id', 'username']));
				const usersString = _.map(users, 'username').join(', ');
				Data.blacklist = _.unionBy(Data.blacklist, users, 'id');
				console.log('>Ignored users.');
				console.log('================================================================');
				console.log('Users: ' + usersString);
				console.log('Time: ' + new Date());
				console.log('================================================================');
				Data.writeData();
				bot.sendMessage(
					message.channel,
					'lol ok'
				);
			}
			else {
				throw new Error('Invalid parameters');
			}
		}
		else if(/^lol unignore/.test(message.content)) {
			console.log('>Received unignore command.');
			if(message.author.id !== Config.owner) {
				throw new Error('Unauthorized');
			}
			if(/^lol unignore(\s*<@\d+>\s*)+$/.test(message.content)){
				const users = _.map(message.mentions, (user) => _.pick(user, ['id', 'username']));
				const usersString = _.map(users, 'username').join(', ');
				Data.blacklist = _.differenceBy(Data.blacklist, users, 'id');
				console.log('>Unignored users.');
				console.log('================================================================');
				console.log('Users: ' + usersString);
				console.log('Time: ' + new Date());
				console.log('================================================================');
				Data.writeData();
				bot.sendMessage(
					message.channel,
					'lol ok'
				);
			}
			else {
				throw new Error('Invalid parameters');
			}
		}
		else if(/^lol blacklist$/.test(message.content)) {
			console.log('>Received blacklist command.');
			const blacklist = _.map(Data.blacklist, (user) => {
				return `- ${user.username} (${user.id})`;
			});
			bot.sendMessage(
				message.channel,
				'**Blacklist:**\n' + blacklist.join('\n')
			);
			console.log('>Posted blacklist.');
		}
		else if(/^lol join/.test(message.content)) {
			console.log('>Received join command.');
			if(message.author.id !== Config.owner) {
				throw new Error('Unauthorized');
			}
			if(/^lol join(\s*https?:\/\/discord\.gg\/[A-Za-z0-9]+\s*)+$/.test(message.content)) {
				const invites = message.content.match(/https?:\/\/discord\.gg\/[A-Za-z0-9]+/gi);
				_.forEach(invites, (invite) => {
					bot.joinServer(invite);
				});
				console.log('>Joined servers.');
				bot.sendMessage(
					message.channel,
					'lol ok'
				);
			}
			else {
				throw new Error('Invalid parameters');
			}
		}
	}
	catch(err) {
		console.log('>An error occurred.');
		console.log('================================================================');
		console.log('Message: ' + err.message);
		console.log('================================================================');
		bot.sendMessage(
			message.channel,
			'lol nope'
		);
	}
}

export default OwnerCommands;