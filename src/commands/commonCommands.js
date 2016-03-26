import _ from 'lodash';

function roll(max) {
	return Math.floor((Math.random() * max) + 1);
}

function CommonCommands(message, bot, Data) {
	if(_.findIndex(Data.blacklist, {id: message.author.id}) !== -1) {
		return;
	}
	else {
		_.forEach(Data.commands, (command) => {
			const exp = new RegExp(command.in, (!command.case ? 'i' : ''));
			if(exp.test(message.content)) {
				var output = command.out;
				_.forEach(command.replace, (replace) => {
					var newString = replace.new;
					if(/^\$roll\(\d*\)$/.test(newString)) {
						const input = message.content.split(' ')[1];
						newString = roll(newString.match(/\d+/) || input.match(/\d+/) || 100);
					}
					else if(newString === '$user') {
						newString = '<@' + message.author.id + '>';
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
					}
				);
				console.log('>Executed command.');
				console.log('================================================================');
				console.log('Channel: ' + message.channel.name + '(' + message.channel.server.name + ')');
				console.log('Author: ' + message.author.username + '(' + message.author.id + ')');
				console.log('Input: ' + message.content);
				console.log('Output: ' + output);
				console.log('================================================================');
			}
		});
	}
}

export default CommonCommands;