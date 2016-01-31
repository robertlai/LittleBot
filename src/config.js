import fs from 'fs';
import _ from 'lodash';

const configFileName = 'little.conf';

var Config = {
	addCommand(input) {
		this.commands.push(input);
		saveConfig();
	},
	removeCommand(input) {
		_.remove(this.commands, (command) => {
			return (command.name == input || command.exp == input);
		});
		saveConfig();
	},
	save() {
		saveConfig();
	},
	toggle(prop) {
		this[prop] = !this[prop];
	}
};

function loadConfig() {
	fs.exists(configFileName, (exists) => {
		if (exists) {
			fs.readFile(configFileName, 'utf8', (err, data) => {
				if (err) throw err;
				Config = _.assignIn(Config, JSON.parse(data));
			});
		}
	});
}

function saveConfig() {
	fs.writeFile(configFileName, JSON.stringify(Config), (err) => {
		if (err) throw err;
		console.log('Config saved.');
	});
}

console.log('Loading config...');

var data = fs.readFileSync(configFileName, 'utf8');
Config = _.assignIn(Config, JSON.parse(data));

console.log('Done.');

fs.watch(configFileName, {
	persistent: true
}, () => {
	loadConfig();
});

export default Config;
