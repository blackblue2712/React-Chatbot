import React from 'react';


const Card = (props) => {
    return (
        <div  style={{ height: 200, paddingRight:30, float: 'left'}}>
            <div className="card" style={{width: 140}}>
                <div className="card-image" style={{ width: 140}}>
                    <img alt={props.props.fields.header.stringValue} src={props.props.fields.image.stringValue} />
                    <span className="card-title">{props.props.fields.header.stringValue}</span>
                </div>
                <div className="card-content">
                    {props.props.fields.description.stringValue}
                    <p> <a href="/">{props.props.fields.price.stringValue}</a></p>
                </div>
                <div className="card-action">
                    <a target="_blank" rel="noopener noreferrer" href={props.props.fields.link.stringValue}>GET NOW</a>
                </div>
            </div>
        </div>
    );
};

export default Card;