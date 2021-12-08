import React from 'react';
import './ProfileHeader.css';

class ProfileHeader extends React.Component {
	
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