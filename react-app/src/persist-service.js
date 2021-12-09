import $ from 'jquery';

/** @class PersistService for performing REST calls to the back-end persistence service */
class PersistService {
	
	/**
	 * Persist a new map marker for a user
	 * @param {string} user the username to add this marker for 
	 * @param {Object} coordinates the marker coordinate for this map marker
	 * @param {string} coordinates.lat the marker latitude
	 * @param {string} coordinates.lng the marker longitude
	 * @param {string} color a hex string for this marker's color
	 * @param {string} name the marker's name
	 * @returns {JQueryXHR} a jQuery promise resolved with a UUID for the new marker
	 */
	savePoint(user, coordinates, color, name) {
		return $.post('http://localhost:8000/savePoint', {
			user, coordinates, color, name
		});
	}
	
	/**
	 * Retrieves a user's persisted map markers
	 * @param {string} user the username to retrieve markers for
	 * @returns {JQueryXHR} a jQuery promise resolved with JSON containing the user's map markers
	 */
	getPoints(user) {
		return $.get(`http://localhost:8000/getPoints?user=${user}`);
	}
	
	/**
	 * Update a previously persisted map marker for a user
	 * @param {string} user the username to update this marker for 
	 * @param {Object} coordinates the marker coordinate for this map marker
	 * @param {string} coordinates.lat the marker latitude
	 * @param {string} coordinates.lng the marker longitude
	 * @param {string} color a hex string for this marker's color
	 * @param {string} name the marker's name
	 * @param {string} uuid the UUID of the existing marker
	 * @returns {JQueryXHR} empty promise
	 */
	updatePoint(user, coordinates, color, name, uuid) {
		return $.ajax(`http://localhost:8000/updatePoint`, {
			type: 'PUT',
			data: {
				user, coordinates, color, name, uuid
			}
		});
	}
	
	/**
	 * Delete an existing persisted map marker for a user
	 * @param {string} user the username to delete this marker for 
	 * @param {string} uuid the UUID of the marker to delete
	 * @returns {JQueryXHR} empty promise
	 */
	deletePoint(user, uuid) {
		return $.ajax(`http://localhost:8000/deletePoint?user=${user}&uuid=${uuid}`, {
			method: 'DELETE'
		});
	}

};



export default new PersistService();