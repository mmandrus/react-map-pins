import React from 'react';
import L from 'leaflet';
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
class SplitPanel extends React.Component {
	
	#map;
	#featureGroup;
	
	constructor(props) {
		super(props);
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
	
	pointFinalized(circleMarkerWrapper) {
		if(!!circleMarkerWrapper.markerUuid) {
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
						listOfMarkers: [...this.state.listOfMarkers.map(marker => {
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
		} else {
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
	
	mapAndLayerSet(map, featureGroup) {
		this.#map = map;
		this.#featureGroup = featureGroup;
	}
	
	flyToPoint(circleMarker) {
		this.#map.flyTo(circleMarker.getLatLng(), 15);
	}
	
	showAllPoints() {
		let bounds = L.latLngBounds(this.state.listOfMarkers.map(marker => {
			return marker.circleMarker.getLatLng()
		}));
		this.#map.fitBounds(bounds, {
			//padding: L.point(50, 50)
		});
	}
	
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
					<MapRoot pointAddedToMap={this.pointAddedToMap} mapAndLayerSet={this.mapAndLayerSet} drawControl={this.drawControl} initialMarkers={this.state.listOfMarkers} circleMarkerProperties={circleMarkerProperties}/>
				</div>
				{this.state.markerToEdit && <CreateEditPopover marker={this.state.markerToEdit} markerMeta={this.state.markerMeta} screenPoint={this.state.screenPoint} 
					isEdit={this.state.isEditMarker} editDone={this.pointFinalized} editCanceled={this.pointCanceled} deletePoint={this.deletePoint}/>}
			</div>
		);
	}
}

export default SplitPanel;