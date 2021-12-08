const fs = require('fs');
const NodeRestServer = require('node-rest-server');
const { v4: uuidv4 } = require('uuid');

try {
	fs.mkdirSync('user_markers');
} catch (e) {}
let users = fs.readdirSync('user_markers')
	.map((fn) => fn.substring(0, fn.indexOf('.')));
console.log(`list of users: ${users}`);

const routeConfig = {
	'/savePoint': {
		method: 'POST',
		status: 200,
		controller: async (requestData) => {
			let requestBody = requestData.body;
			let dataForUser = [];
			if(users.indexOf(requestBody.user) !== -1) {
				dataForUser = JSON.parse(fs.readFileSync(`user_markers/${requestBody.user}.json`, 'utf-8'));
			} else {
				users.push(requestBody.user);
			}				
			requestBody.uuid = uuidv4();
			dataForUser.push(requestBody);
			fs.writeFileSync(`user_markers/${requestBody.user}.json`, JSON.stringify(dataForUser));
			return {
				uuid: requestBody.uuid
			};
		}
	},
	
	'/getPoints': {
		method: 'GET',
		status: 200,
		controller: async (requestData) => {
			let queryParams = requestData.queryParams;
			let user = queryParams.user;
			let dataForUser = [];
			if(users.indexOf(user) !== -1) {
				dataForUser = JSON.parse(fs.readFileSync(`user_markers/${user}.json`, 'utf-8'));
			}
			return {
				points: dataForUser
			};
		}
	},
	
	'/updatePoint': {
		method: 'PUT',
		status: 204,
		controller: async (requestData) => {
			let requestBody = requestData.body;
			let dataForUser = JSON.parse(fs.readFileSync(`user_markers/${requestBody.user}.json`, 'utf-8'));
			dataForUser = dataForUser.map((datum) => {
				if(datum.uuid === requestBody.uuid) {
					return requestBody;
				} else {
					return datum;
				}
			});
			fs.writeFileSync(`user_markers/${requestBody.user}.json`, JSON.stringify(dataForUser));
			return;
		}
	},
	
	'/deletePoint': {
		method: 'DELETE',
		status: 204,
		controller: async (requestData) => {
			let queryParams = requestData.queryParams;
			let user = queryParams.user;
			let uuid = queryParams.uuid;
			let dataForUser = JSON.parse(fs.readFileSync(`user_markers/${user}.json`, 'utf-8'));
			dataForUser = dataForUser.filter((datum) => {
				return datum.uuid !== uuid;
			});
			fs.writeFileSync(`user_markers/${user}.json`, JSON.stringify(dataForUser));
			return;
		}
	}
};

NodeRestServer(routeConfig);