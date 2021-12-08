import React from 'react';
import './FavoritesList.css';
import FavoriteRow from '../favorite-row/FavoriteRow';

class FavoritesList extends React.Component {
	
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