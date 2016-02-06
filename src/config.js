import fs from 'fs';
import _ from 'lodash';

const configFileName = 'little.conf';
const defaultConfigFileName = 'default.conf';

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
	addNotif(id, name) {
		id = id.replace(/^<@|>$/g, '');
		name = name.replace(/^<@|>$/g, '');
		this.notifications[id] = { username: name };
		saveConfig();
	},
	removeNotif(val) {
		val = val.replace(/^<@|>$/g, '');
		this.notifications = _.transform(this.notifications, (result, value, key) => {
			if(key != val && value.username != val){
				result[key] = value;
			}
		});
		saveConfig();
	},
	setStatus(status) {
		this.status = status;
		saveConfig();
	},
	toggle(prop) {
		this[prop] = !this[prop];
		saveConfig();
	}
};

function loadConfig() {
	fs.exists(configFileName, (exists) => {
		if (exists) {
			fs.readFile(configFileName, 'utf8', (err, data) => {
				if (err) throw err;
				Config = _.assignIn(Config, JSON.parse(data));
				console.log('Config loaded.');
			});
		}
	});
}

function saveConfig() {
	fs.writeFile(configFileName, JSON.stringify(Config, null, '\t'), (err) => {
		if (err) throw err;
		console.log('Config saved.');
	});
}

console.log('Loading config...');

try{
	var stats = fs.lstatSync(configFileName);
	var data;
	if(stats.isFile()) {
		data = fs.readFileSync(configFileName, 'utf8');
		Config = _.assignIn(Config, JSON.parse(data));
	}
	else {
		data = fs.readFileSync(defaultConfigFileName, 'utf8');
		Config = _.assignIn(Config, JSON.parse(data));
	}
}
catch(e){
	console.log('Failed to get config.');
}

console.log('Done.');

fs.watch(configFileName, {
	persistent: true
}, () => {
	loadConfig();
});

export default Config;
