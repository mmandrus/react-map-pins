import React from 'react';
import './App.css';
import LoginPrompt from './login-prompt/LoginPrompt';
import SplitPanel from './split-panel/SplitPanel';
import persist from './persist-service';

class App extends React.Component {	

	constructor(props) {
		super(props);
		this.state = {
			loggedInUser: null
		};
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		
		if(!!sessionStorage.getItem('loggedInUser')) {
			this.handleLogin(sessionStorage.getItem('loggedInUser'));
		}
	}
	
	handleLogin(username) {
		persist.getPoints(username)
			.then((json) => {
				this.setState({initialPoints: json.points});
			})
			.always(() => {
				this.setState({loggedInUser: username});
				sessionStorage.setItem('loggedInUser', username);
			});

	}
	
	handleLogout(e) {
		e.preventDefault();
		this.setState({
			initialPoints: null,
			loggedInUser: null
		});
		sessionStorage.removeItem('loggedInUser');
	}
  
	render() { 
		return (
			<div className="App">
				{!this.state.loggedInUser ? 
					<LoginPrompt handleLogin={this.handleLogin}/> : <SplitPanel loggedInUser={this.state.loggedInUser} initialPoints={this.state.initialPoints} handleLogout={this.handleLogout}/>}
			</div>
		);
	}
}

export default App;
