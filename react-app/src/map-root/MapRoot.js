import React from 'react';
import '../public/leaflet.css';
import '../public/leaflet.draw.css';
import L from 'leaflet';
import './MapRoot.css';


class MapRoot extends React.Component {
	constructor(props) {
		super(props);
		
	}
	
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
			this.props.pointAddedToMap({
				circleMarker,
				containerPoint: this.myMap.latLngToContainerPoint(circleMarker.getLatLng())
			});
		});
		
		this.props.initialMarkers.forEach(marker => {
			this.featureGroup.addLayer(marker.circleMarker);
		});
		this.props.mapAndLayerSet(this.myMap, this.featureGroup);
	}
	
	render() {
		return (
			<div id="map"></div>
		);
	};
}

export default MapRoot;