import React from 'react';
import '../public/leaflet.css';
import '../public/leaflet.draw.css';
import L, { CircleMarker } from 'leaflet';
import './MapRoot.css';

/** @class MapRoot the component used for rendering the Leaflet map */
class MapRoot extends React.Component {

	/**
	 * @constructor
	 * @param {Object} props - constructor properties
	 * @param {Function} props.pointAddedToMap - passed in handler for a new marker draw event
	 * @param {Function} props.mapAndLayerSet - passed in handler to set the map and layer properties on the parent component
	 * @param {Object[]} props.initialMarkers - the initial set of markers to render
	 * @param {string} props.initialMarkers[].markerColor - the marker color
	 * @param {string} props.initialMarkers[].markerName - the marker name
	 * @param {string} props.initialMarkers[].uuid - the marker uuid
	 * @param {CircleMarker} props.initialMarkers[].circleMarker - the Leaflet marker
	 * @param {Object} props.circleMarkerProperties set of properties to initialize the draw control with
	 */
	constructor(props) {
		super(props);
	}
	
	/**
	 * After the component renders, use the Leaflet API to render a map on the component <div>
	 */
	componentDidMount() {
		this.myMap = L.map("map").setView([42.3601, -71.0589], 12);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(this.myMap);
		this.featureGroup = new L.FeatureGroup();
		this.myMap.addLayer(this.featureGroup);
		this.drawControl = new L.Control.Draw({
			draw: {
				polyline: false,
				polygon: false,
				rectangle: false,
				circle: false,
				marker: false,
				circlemarker: this.props.circleMarkerProperties
			}
		});
		this.myMap.addControl(this.drawControl);
		this.myMap.on('draw:created', (e) => {
			let circleMarker = e.layer;
			this.featureGroup.addLayer(circleMarker);
			//bubble up event so that it is added to local state and persisted
			this.props.pointAddedToMap({
				circleMarker,
				containerPoint: this.myMap.latLngToContainerPoint(circleMarker.getLatLng())
			});
		});
		
		//Add previous markers to the map
		this.props.initialMarkers.forEach(marker => {
			this.featureGroup.addLayer(marker.circleMarker);
		});
		//Set the map and circle marker layer on the parent component
		this.props.mapAndLayerSet(this.myMap, this.featureGroup);
	}
	
	render() {
		return (
			<div id="map"></div>
		);
	};
}

export default MapRoot;