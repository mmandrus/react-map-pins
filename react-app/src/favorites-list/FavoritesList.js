import React from 'react';
import './FavoritesList.css';
import FavoriteRow from '../favorite-row/FavoriteRow';
import { CircleMarker } from 'leaflet';

/** @class FavoritesList displays a list of the logged in user's map markers */
class FavoritesList extends React.Component {
	
	/**
	 * @constructor
	 * @param {Object} props constructor properties
	 * @param {Object[]} props.favorites - the initial set of markers to render
	 * @param {string} props.favorites[].markerColor - the marker color
	 * @param {string} props.favorites[].markerName - the marker name
	 * @param {string} props.favorites[].uuid - the marker uuid
	 * @param {CircleMarker} props.favorites[].circleMarker - the Leaflet marker
	 * @param {Function} props.flyToPoint - passed in handler to zoom to a marker
	 * @param {Function} props.editPoint - passed in handler to edit a marker
	 * @param {Function} props.showAllPoints - passed in handler to set map extent to contain all markers
	 */
	constructor(props) {
		super(props);
	}

	render() {
		let listElements = this.props.favorites.map(fave => {
			return <FavoriteRow key={fave.uuid} markerName={fave.markerName} markerColor={fave.markerColor} marker={fave.circleMarker}  uuid={fave.uuid}
				flyToPoint={this.props.flyToPoint} editPoint={this.props.editPoint} deletePoint={this.props.deletePoint}/>
		});
		return (
			<div id="element-list">
				<table className="favorite-row">
					<tbody>
						<tr >
							<td className="circle"></td>
							<td className="text"></td>
							<td className="links" style={{width: '60px'}}>
								<span className="url" onClick={this.props.showAllPoints}>show all</span> <br />
							</td>
						</tr>
					</tbody>
				</table>
				{listElements}
			</div>
		);
	}
}

export default FavoritesList;