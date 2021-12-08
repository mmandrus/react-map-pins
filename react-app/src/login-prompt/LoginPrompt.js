import React from 'react';
import './LoginPrompt.css';

class LoginPrompt extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			username: ""
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleType = this.handleType.bind(this);
	}
	
	handleClick(e) {
		e.preventDefault();
		this.props.handleLogin(this.state.username);
	}
	
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