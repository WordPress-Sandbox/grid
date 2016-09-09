import React, {Component, PropTypes} from 'react';
import { ItemTypes } from '../constants';
import { DragSource } from 'react-dnd';


const boxSource = {
	beginDrag(props){
		console.log("begin drag");
		return {
			id: props.id,
			index: props.index
		};
	},
	endDrag(props, monitor) {
		console.log("end drop");
		const item = monitor.getItem();
		const dropResult = monitor.getDropResult();

		if (dropResult) {
			// window.alert( // eslint-disable-line no-alert
			//   `You dropped ${item.name} into ${dropResult.name}!`
			// );
		}
	}
};

function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging()
	}
}

class Box extends Component{
	constructor(props){
		super(props);
	}
	render(){
		const { connectDragSource, connectDragPreview, isDragging } = this.props;
		const class_name = "grid-box ";
		let title = "";
		if(this.props.titleurl){
			title = <h3>{this.props.titleurl}<a href={this.props.titleurl} className="box-title">{this.props.title}</a></h3>
		} else {
			title = <h3>{this.props.title}</h3>
		}
		return connectDragPreview(
		  <div className={class_name}>
			  <div className="grid-box-content">
				  {title}
				  <div className="prolog">{this.props.prolog}</div>
				  <div className="content" dangerouslySetInnerHTML={{__html: this.props.html}} ></div>
				  <div className="epilog">{this.props.epilog}</div>
				  <p className="readmore">
					  <a href={this.props.readmoreurl} >{this.props.readmore}</a>
				  </p>
			  </div>
			  {connectDragSource(<div className="grid-box-controls grid-box-movable">
				  <i className="grid-box-drag icon-drag" />
				  <div className="grid-box-control-button grid-box-edit">
					  <div className="grid-box-control-wrapper">
						  <i className="icon-edit" />
						  <span className="grid-box-control-text">Edit</span>
					  </div>
				  </div>
				  <div className="grid-box-reused">Reused box <i className="icon-reuse" /></div>
				  <div className="grid-box-control-button grid-box-delete">
					  <div className="grid-box-control-wrapper">
						  <i className="icon-trash" />
						  <span className="grid-box-control-text">Delete</span>
					  </div>
				  </div>
			  </div>)}
		  </div>
		)
	}
}

Box.propTypes = {
	connectDragSource: PropTypes.func.isRequired,
	connectDragPreview: PropTypes.func.isRequired,
	isDragging: PropTypes.bool.isRequired,
	id: PropTypes.any.isRequired
};

export default DragSource(ItemTypes.BOX, boxSource, collect)(Box);