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
				var params = tokens.slice(2);
				var name = null;
				var caseSensitive = true;
				var done = false;
				while(!done) {
					var next = params.shift();
					if(next === '-n') {
						name = params.shift();
					}
					else if(next === '-i') {
						caseSensitive = false;
					}
					else {
						done = true;
					}
				}
				if(!next || params.length === 0) {
					throw new Error('Invalid parameters');
				}
				new RegExp('^' + next + '$');
				if(!name) {
					name = next;
				}
				newCommand = {
					case: caseSensitive,
					in: '^' + next + '$',
					out: params.join(' '),
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
		else if(/^lol print/.test(message.content)) {
			console.log('>Received print command.');
			if(_.findIndex(Data.admin, {id: message.author.id}) === -1) {
				throw new Error('Unauthorized');
			}
			const toPrint = tokens.slice(2).join(' ');
			const printed = _.find(Data.commands, {name: toPrint});
			if(printed) {
				bot.sendMessage(
					message.channel,
					`\`\`\`${JSON.stringify(printed, null, '\t')}\`\`\``
				);
			}
			else {
				throw new Error('Command does not exist');
			}
			console.log('>Printed command.');
			console.log('================================================================');
			console.log('Name: ' + toPrint);
			console.log('================================================================');
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