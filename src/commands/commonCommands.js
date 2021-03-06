import _ from 'lodash';

function roll(max) {
	const maxNum = parseInt(max);
	const random = Math.ceil(Math.random() * (!_.isNaN(maxNum) ? maxNum : 100));
	return random - (maxNum < 0 ? 1 : 0);
}

function testCommand(message, bot, command) {
	return new Promise((resolve, reject) => {
		const exp = new RegExp(command.in, (!command.case ? 'i' : ''));
		if(!exp.test(message.content)) {
			reject();
		}
		else {
			var output = command.out;
			_.forEach(command.replace, (replace) => {
				let newString = replace.new;
				if(/^\$roll\(.*\)$/.test(newString)) {
					const param = newString.match(/\$roll\(([^)]+)\)/);
					const input = message.content.split(' ')[1];
					if(param) {
						newString = roll(param[1]);
					}
					else if(input){
						newString = roll(input);
					}
					else {
						newString = roll(100);
					}
				}
				else if(newString === '$user') {
					newString = '<@' + message.author.id + '>';
				}
				else if(newString === '$userid') {
					newString = message.author.id;
				}
				else if(newString === '$username') {
					newString = message.author.username;
				}
				else if(newString === '$msg') {
					newString = message.content;
				}
				else if(newString === '$now') {
					newString = new Date();
				}
				output = output.split(replace.old).join(newString);
			});
			bot.sendMessage(
				message.channel,
				output,
				{
					tts: command.tts
				},
				() => {
					console.log('>Executed command.');
					console.log('================================================================');
					console.log('Channel: ' + message.channel.name + '(' + message.channel.server.name + ')');
					console.log('Author: ' + message.author.username + '(' + message.author.id + ')');
					console.log('Input: ' + message.content);
					console.log('Output: ' + output);
					console.log('================================================================');
					resolve();
				}
			);
		}
	});
}

function CommonCommands(message, bot, Data) {
	if(_.findIndex(Data.blacklist, {id: message.author.id}) !== -1) {
		return;
	}
	else {
		_.forEach(Data.commands, (command) => {
			testCommand(message, bot, command);
		});
	}
}

export default CommonCommands;