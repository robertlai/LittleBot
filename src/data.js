import fs from 'fs';

const DATA_FILE_NAME = './data.json';

var Data = {
	admin: [],
	blacklist: [],
	commands: [],
	loadData() {
		console.log('>Loading data...');
		try {
			const data = JSON.parse(fs.readFileSync(DATA_FILE_NAME));
			for(var i in data) {
				this[i] = data[i];
			}
			console.log('>Successfully loaded data.');
		}
		catch(err) {
			console.log('>An error occurred.');
			console.log('================================================================');
			console.log('Message: ' + err.message);
			console.log('================================================================');
		}
	},
	writeData() {
		console.log('>Writing data...');
		try {
			const data = JSON.stringify(this, null, '\t');
			fs.writeFile(DATA_FILE_NAME, data);
			console.log('>Successfully wrote data.');
		}
		catch(err) {
			console.log('>An error occurred.');
			console.log('================================================================');
			console.log('Message: ' + err.message);
			console.log('================================================================');
		}
	}
};

Data.loadData();

export default Data;