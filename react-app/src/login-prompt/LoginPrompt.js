import React from 'react';
import './LoginPrompt.css';

/** @class LoginPrompt displays a modal login form */
class LoginPrompt extends React.Component {
	
	/**
	 * @constructor
	 * @param {Object} props constructor properties
	 * @param {Function} props.handleLogin login handler passed in from parent
	 */
	constructor(props) {
		super(props);
		
		this.state = {
			username: ""
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleType = this.handleType.bind(this);
	}
	
	/**
	 * Handler for the submit button click.
	 * Bubbles up to passed-in handler
	 * @param {import('react').SyntheticEvent} e button click event
	 */
	handleClick(e) {
		e.preventDefault();
		this.props.handleLogin(this.state.username);
	}
	
	/**
	 * Handler for typing in the username field
	 * @param {import('react').SyntheticEvent} e text input change event 
	 */
	handleType(e) {
		this.setState({
			username: e.target.value
		});
	}
	
	render() {
		return (
			<div className="prompt">
				<div className="login-text">
					<h2>Login</h2>
				</div>
				<div className="login-input">
					<input type="text" name="username" placeholder="username" autoComplete="off"
						value={this.state.username} onChange={this.handleType}/>
					<input className="submit-button" type="button" name="submit" 
						value="Login" onClick={this.handleClick}/>
				</div>
			</div>
		);
	}
}

export default LoginPrompt;