import React from 'react';
import './CreateEditPopover.css';

class CreateEditPopover extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			markerName: this.props.markerMeta ? this.props.markerMeta.markerName : '',
			markerColor: this.props.markerMeta ? this.props.markerMeta.markerColor : this.randomColor()
		};
		this.props.marker.setStyle({
			fillColor: this.state.markerColor
		});
		
		this.submitButtonClicked = this.submitButtonClicked.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}
	
	submitButtonClicked() {
		let payload = {
			circleMarker: this.props.marker,
			markerColor: this.state.markerColor,
			markerName: this.state.markerName
		};
		if(this.props.isEdit) {
			payload.markerUuid = this.props.markerMeta.markerUuid;
		}
		this.props.editDone(payload);
	}
	
	handleNameChange(e) {
		e.preventDefault();
		this.setState({
			markerName: e.target.value
		});
	}
	
	handleColorChange(e) {
		e.preventDefault();
		this.setState({
			markerColor: e.target.value
		});
		if(!this.props.isEdit) {
			this.props.marker.setStyle({
				fillColor: e.target.value
			});
		}
	}
	
	handleDelete() {
		window.confirm('Are you sure you want to delete this favorite?') && this.props.deletePoint(this.props.markerMeta.markerUuid, this.props.marker);
	}
	
	randomColor() {
		return '#'+Math.floor(Math.random()*16777215).toString(16);
	}
	
	render() {
		return (
			<div id="popup" style={this.props.screenPoint}>
				<div id="contents">
					<div id="form">
						<div className="form-row">
							<span className="label">Name:</span>
							<input type="text" name="markername" placeholder="New Marker" autoComplete="off" value={this.state.markerName} onChange={this.handleNameChange}/>
						</div>
						<div className="form-row">
							<span className="label">Color:</span>
							<input type="color" name="markercolor" value={this.state.markerColor} onChange={this.handleColorChange}></input>
						</div>
					</div>
					<div id="buttons">
						<button className="createEditButton" onClick={this.props.editCanceled}>Cancel</button>
						{this.props.isEdit && 
							<button className="createEditButton" onClick={this.handleDelete}>Delete</button>}
						<button className="createEditButton" onClick={this.submitButtonClicked} disabled={this.state.markerName.length === 0}>Submit</button>
					</div>
				</div>
			</div>
		);
	}
}

export default CreateEditPopover;