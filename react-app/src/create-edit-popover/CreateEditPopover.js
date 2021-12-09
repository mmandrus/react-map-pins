import { CircleMarker } from 'leaflet';
import React from 'react';
import './CreateEditPopover.css';

/** @class CreateEditPopover displays a small dialog to assign a name and color to a new or existing map marker */
class CreateEditPopover extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props - constructor properties
	 * @param {CircleMarker} props.marker - the Leaflet CircleMarker being edited
	 * @param {Object} [props.markerMeta] - the additional metadata associated with the CircleMarker being edited (or null if new)
	 * @param {string} props.markerMeta.markerColor - the color associated with the CircleMarker being edited
	 * @param {string} props.markerMeta.markerName - the name associated with the CircleMarker being edited
	 * @param {string} props.markerMeta.markerUuid - the uuid associated with the CircleMarker being edited
	 * @param {Object} props.screenPoint - the screen point where this dialog should be rendered
	 * @param {number} props.screenPoint.left - the X coord
	 * @param {number} props.screenPoint.top - the Y coord
	 * @param {boolean} props.isEdit - whether this is an edit of an existing marker or the creation of a new one
	 * @param {Function} props.editDone - passed in handler for edit completion
	 * @param {Function} props.editCanceled - passed in handler for edit cancelation
	 * @param {Function} props.deletePoint - passed in handler for point deletion
	 */
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
	
	/**
	 * Handler for the submit button clicked
	 * Bubbles up to parent component
	 */
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
	
	/**
	 * Handler for the text input change event
	 * @param {import('react').SyntheticEvent} e the react event
	 */
	handleNameChange(e) {
		e.preventDefault();
		this.setState({
			markerName: e.target.value
		});
	}
	
	/**
	 * Handler for the color input change event
	 * Updates the dialog and the marker if it is new
	 * @param {import('react').SyntheticEvent} e the react event
	 */
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
	
	/**
	 * Handler for marker deletion. 
	 * If confirmed, bubbles up to parent component
	 */
	handleDelete() {
		window.confirm('Are you sure you want to delete this favorite?') && this.props.deletePoint(this.props.markerMeta.markerUuid, this.props.marker);
	}
	
	/**
	 * Generate a random new hex color
	 * @returns a hex string
	 */
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