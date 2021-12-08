import $ from 'jquery';

class PersistService {
	
	savePoint(user, coordinates, color, name) {
		return $.post('http://localhost:8000/savePoint', {
			user, coordinates, color, name
		});
	}
	
	getPoints(user) {
		return $.get(`http://localhost:8000/getPoints?user=${user}`);
	}
	
	updatePoint(user, coordinates, color, name, uuid) {
		return $.ajax(`http://localhost:8000/updatePoint`, {
			type: 'PUT',
			data: {
				user, coordinates, color, name, uuid
			}
		});
	}
	
	deletePoint(user, uuid) {
		return $.ajax(`http://localhost:8000/deletePoint?user=${user}&uuid=${uuid}`, {
			method: 'DELETE'
		});
	}

};



export default new PersistService();