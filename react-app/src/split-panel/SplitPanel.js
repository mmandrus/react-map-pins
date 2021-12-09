import React from 'react';
import L, { CircleMarker, FeatureGroup, Map, Point } from 'leaflet';
import * as $ from 'jquery';
import './SplitPanel.css';
import MapRoot from '../map-root/MapRoot';
import * as Draw from 'leaflet-draw';
import CreateEditPopover from '../create-edit-popover/CreateEditPopover';
import ProfileHeader from '../profile-header/ProfileHeader';
import FavoritesList from '../favorites-list/FavoritesList';
import persist from '../persist-service';

const circleMarkerProperties = {
	color: 'black',
	fillColor: 'white',
	fillOpacity: 0.7,
	opacity: 1.0
};

/** @class SplitPanel the top level view for a logged in user, which contains the majority of the app logic */
class SplitPanel extends React.Component {
	#map; //the MapRoot Map
	#featureGroup; //the MapRoot FeatureGroup
	
	/**
	 * @constructor
	 * @param {Object} props - constructor properties
	 * @param {string} props.loggedInUser - the logged in user
	 * @param {Object[]} props.initialPoints - the previously persisted map markers
	 * @param {string} props.initialPoints[].color - the marker color
	 * @param {string} props.initialPoints[].name - the marker name
	 * @param {string} props.initialPoints[].uuid - the marker uuid
	 * @param {Object} props.initialPoints[].coordinates - the marker coordinates
	 * @param {string} props.initialPoints[].coordinates.lat - the marker latitude
	 * @param {string} props.initialPoints[].coordinates.lng - the marker longitude
	 * @param {Function} props.handleLogout - a function passed in from the parent to handle log out
	 */
	constructor(props) {
		super(props);
		//Map from JSON markers to internal marker format
		let markerEntries = props.initialPoints.map(point => {
			let circleMarker = L.circleMarker(L.latLng(point.coordinates), {...circleMarkerProperties, fillColor: point.color});
			return {
				circleMarker,
				uuid: point.uuid,
				markerName: point.name,
				markerColor: point.color
			};
		});
		this.state = {
			markerToEdit: null,
			listOfMarkers: [...markerEntries]
		};
		this.pointAddedToMap = this.pointAddedToMap.bind(this);
		this.pointFinalized = this.pointFinalized.bind(this);
		this.pointCanceled = this.pointCanceled.bind(this);
		this.mapAndLayerSet = this.mapAndLayerSet.bind(this);
		this.flyToPoint = this.flyToPoint.bind(this);
		this.editPoint = this.editPoint.bind(this);
		this.deletePoint = this.deletePoint.bind(this);
		this.showAllPoints = this.showAllPoints.bind(this);
		
	}
	
	/**
	 * Handler for a point being added to the map
	 * Displays marker edit popup in the correct location
	 * @param {Object} obj - the added marker metadata
	 * @param {Point} obj.containerPoint - the screen location of the new marker
	 * @param {CircleMarker} obj.circleMarker - the new CircleMarker added to the map
	 */
	pointAddedToMap(obj) {
		//find the position of this popup
		let position = $('#map').position();
		let left = obj.containerPoint.x + position.left + 10;
		if(left + 250 > $(window).width()) {
			left = left - 270;
		}
		let top = obj.containerPoint.y + position.top + 10;
		if(top + 100 > $(window).height()) {
			top = top - 120;
		}
		let screenPoint = { left, top };
		
		this.setState({
			markerToEdit: obj.circleMarker,
			isEditMarker: false,
			screenPoint
		});
		this.toggleDrawingButtonEnabledState(false);
	}
	
	/**
	 * Handles the completion of a marker edit by persisting it to the server
	 * and updating the marker metadata in the local state
	 * @param {Object} circleMarkerWrapper object containing marker metadata
	 * @param {CircleMarker} circleMarkerWrapper.circleMarker the Leaflet CircleMarker
	 * @param {string} circleMarkerWrapper.markerColor the marker color
	 * @param {string} circleMarkerWrapper.markerName the marker name
	 * @param {string} [circleMarkerWrapper.markerUuid] the marker uuid, if editing a previous marker
	 */
	pointFinalized(circleMarkerWrapper) {
		if(!!circleMarkerWrapper.markerUuid) { 	//edit of a previous point
			persist.updatePoint(this.props.loggedInUser, {...circleMarkerWrapper.circleMarker.getLatLng()}, circleMarkerWrapper.markerColor, 
					circleMarkerWrapper.markerName, circleMarkerWrapper.markerUuid)
				.then(() => {
					circleMarkerWrapper.circleMarker.setStyle({
						fillColor: circleMarkerWrapper.markerColor
					})
				})
				.always(() => {
					this.toggleDrawingButtonEnabledState(true);
					this.setState({
						markerToEdit: null,
						listOfMarkers: [...this.state.listOfMarkers.map(marker => {		//update local state with changes
							if(marker.uuid === circleMarkerWrapper.markerUuid) {
								circleMarkerWrapper.uuid = circleMarkerWrapper.markerUuid;
								delete circleMarkerWrapper.markerUuid;
								return circleMarkerWrapper;
							} else {
								return marker;
							}
						})]
					});
				});
		} else {  //creation of a new point
			persist.savePoint(this.props.loggedInUser, {...circleMarkerWrapper.circleMarker.getLatLng()}, circleMarkerWrapper.markerColor, circleMarkerWrapper.markerName)
				.then((response) => {
					circleMarkerWrapper.uuid = response.uuid;
				})
				.always(() => {
					this.toggleDrawingButtonEnabledState(true);
					this.setState({
						markerToEdit: null,
						listOfMarkers: [...this.state.listOfMarkers, circleMarkerWrapper]
					});
				});
		}

	}
	
	/**
	 * Cancels the editing of an existing or new marker and remove it from the map if new
	 */
	pointCanceled() {
		let markerToEdit = this.state.markerToEdit;
		this.setState({
			markerToEdit: null
		});
		if(!this.state.isEditMarker) {
			//delete this point since we canceled
			this.#featureGroup.removeLayer(markerToEdit);
		}
		this.toggleDrawingButtonEnabledState(true);
	}
	
	/**
	 * Used to save a copy of the MapRoot's Map object and FeatureGroup object on this class
	 * Passed in as a property to MapRoot
	 * @param {Map} map the MapRoot internal map
	 * @param {FeatureGroup} featureGroup the MapRoot internal FeatureGroup
	 */
	mapAndLayerSet(map, featureGroup) {
		/** @private */ this.#map = map;
		/** @private */ this.#featureGroup = featureGroup;
	}
	
	/**
	 * Zooms to a given circlemarker
	 * @param {CircleMarker} circleMarker the circlemarker to zoom to
	 */
	flyToPoint(circleMarker) {
		this.#map.flyTo(circleMarker.getLatLng(), 15);
	}
	
	/**
	 * Sets map extent to show all circlemarkers
	 */
	showAllPoints() {
		let bounds = L.latLngBounds(this.state.listOfMarkers.map(marker => {
			return marker.circleMarker.getLatLng()
		}));
		this.#map.fitBounds(bounds);
	}
	
	/**
	 * Begins editing an existing user marker by updating the component state to edit mode
	 * @param {import('react').SyntheticEvent} e the react button click event
	 * @param {CircleMarker} circleMarker the CircleMarker to edit
	 * @param {string} markerColor the color of the CircleMarker to edit
	 * @param {string} markerName the name of the CircleMarker to edit
	 * @param {string} markerUuid the uuid of the CircleMarker to edit
	 */
	editPoint(e, circleMarker, markerColor, markerName, markerUuid) {
		this.setState({
			markerToEdit: circleMarker,
			isEditMarker: true,
			markerMeta: {
				markerColor,
				markerName,
				markerUuid
			},
			screenPoint: {
				left: e.clientX + 10,
				top: e.clientY + 10
			}
		});
		this.toggleDrawingButtonEnabledState(false);
	}
	
	/**
	 * Deletes an existing CircleMarker removing it from server persistence and deleting it from the map and local state
	 * @param {string} uuid the uuid of the marker to delete
	 * @param {CircleMarker} circleMarker the CircleMarker to remove from the map layer
	 */
	deletePoint(uuid, circleMarker) {
		persist.deletePoint(this.props.loggedInUser, uuid)
			.then(() => {
				this.#featureGroup.removeLayer(circleMarker);
				this.setState({
					markerToEdit: null,
					listOfMarkers: this.state.listOfMarkers.filter(marker => {
						return marker.uuid !== uuid;
					})
				});
			});
	}
	
	/**
	 * Enables or disables the CircleMarker icon on the map Draw control
	 * There is no way to do this through the Leaflet Draw API
	 * @param {boolean} state whether the button should be enabled
	 */
	toggleDrawingButtonEnabledState(state) {
		document.getElementsByClassName('leaflet-draw-draw-circlemarker').item(0).classList[state ? 'remove' : 'add']('disabled');
	}
	
	render() {
		return (
			<div id="parent">
				<div id="left" className="panel">
					<ProfileHeader handleLogout={this.props.handleLogout} name={this.props.loggedInUser}/>
					<FavoritesList favorites={this.state.listOfMarkers} flyToPoint={this.flyToPoint} editPoint={this.editPoint} showAllPoints={this.showAllPoints} />
				</div>
				<div id="right" className="panel">
					<MapRoot pointAddedToMap={this.pointAddedToMap} mapAndLayerSet={this.mapAndLayerSet} initialMarkers={this.state.listOfMarkers} circleMarkerProperties={circleMarkerProperties}/>
				</div>
				{this.state.markerToEdit && <CreateEditPopover marker={this.state.markerToEdit} markerMeta={this.state.markerMeta} screenPoint={this.state.screenPoint} 
					isEdit={this.state.isEditMarker} editDone={this.pointFinalized} editCanceled={this.pointCanceled} deletePoint={this.deletePoint}/>}
			</div>
		);
	}
}

export default SplitPanel;