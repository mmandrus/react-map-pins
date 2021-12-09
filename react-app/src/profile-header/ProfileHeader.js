import React from 'react';
import './ProfileHeader.css';

/** @class ProfileHeader used to display username and logout link */
class ProfileHeader extends React.Component {
	
	/**
	 * @constructor
	 * @param {Object} props constructor properties
	 * @param {string} props.name the logged in username
	 * @param {Function} props.handleLogout the passed in logout handler
	 */
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="header">
				<span className="url" onClick={this.props.handleLogout}>log out</span>
				<br />
				<span className="title">{this.props.name}'s favorites</span>
				<br />
				<hr />
			</div>
		);
	}
}

export default ProfileHeader;