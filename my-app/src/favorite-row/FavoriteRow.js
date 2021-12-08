import React from 'react';
import './FavoriteRow.css';

class FavoriteRow extends React.Component {
	
	render() {
		return (
			<table className="favorite-row">
				<tbody>
					<tr >
						<td className="circle">
							<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
							  <circle style={{fill: this.props.markerColor, fillOpacity: '0.7', stroke: 'black', strokeWidth: 1}} cx="5" cy="5" r="4"/>
							</svg>
						</td>
						<td className="text">
							<span className="marker-name">{this.props.markerName}</span>
						</td>
						<td className="links">
							<span className="url" onClick={() => this.props.flyToPoint(this.props.marker)}>zoom</span> <br />
							<span className="url" onClick={(e) => this.props.editPoint(e, this.props.marker, this.props.markerColor, this.props.markerName, this.props.uuid)}>edit</span>
						</td>
					</tr>
				</tbody>
			</table>
		);
	}
}

export default FavoriteRow;