import _ from 'lodash';

function AdminCommands(message, bot, Data) {
	try {
		const tokens = message.content.split(' ');
		if(/^lol add/.test(message.content)) {
			console.log('Received add command.');
			if(_.findIndex(Data.admin, {id: message.author.id}) === -1) {
				throw new Error('Unauthorized');
			}
			var newCommand = {};
			if(tokens[2] === 'advanced') {
				const objString = tokens.slice(3).join(' ');
				newCommand = JSON.parse(objString);
				if(!newCommand.out || !newCommand.in || !newCommand.name) {
					throw new Error('Invalid parameters');
				}
			}
			else {
				const hasName = tokens.indexOf('-n') === 2;
				if(tokens.length < (hasName ? 6 : 4)) {
					throw new Error('Invalid parameters');
				}
				var params = tokens.slice(2);
				var name = params[0];
				if(hasName) {
					name = params[1];
					params = params.slice(2);
				}
				newCommand = {
					case: true,
					in: '^' + params[0] + '$',
					out: params.slice(1).join(' '),
					name: name
				};
			}
			if(_.findIndex(Data.commands, {name: newCommand.name}) !== -1){
				throw new Error('Command already exists');
			}
			else {
				Data.commands.push(newCommand);
				Data.writeData();
			}
			console.log('>Added command.');
			console.log('================================================================');
			console.log('Name: ' + newCommand.name);
			console.log('Input: ' + newCommand.in);
			console.log('Output: ' + newCommand.out);
			console.log('================================================================');
			bot.sendMessage(
				message.channel,
				'lol ok'
			);
		}
		else if(/^lol remove/.test(message.content)) {
			console.log('>Received remove command.');
			if(_.findIndex(Data.admin, {id: message.author.id}) === -1) {
				throw new Error('Unauthorized');
			}
			const toRemove = tokens.slice(2).join(' ');
			const removed = _.remove(Data.commands, {name: toRemove});
			if(!_.isEmpty(removed)) {
				Data.writeData();
			}
			else {
				throw new Error('Command does not exist');
			}
			console.log('>Removed command.');
			console.log('================================================================');
			console.log('Name: ' + toRemove);
			console.log('================================================================');
			bot.sendMessage(
				message.channel,
				'lol ok'
			);
		}
		else if(/^lol commands/.test(message.content)) {
			console.log('>Received commands command.');
			if(_.findIndex(Data.admin, {id: message.author.id}) === -1) {
				throw new Error('Unauthorized');
			}
			const list = _.map(Data.commands, (command) => {
				return `- ${command.name}: ${command.in} -> ${command.out}`;
			});
			bot.sendMessage(
				message.channel,
				'**Commands:**\n' + list.join('\n')
			);
			console.log('>Posted command list.');
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

export default AdminCommands;