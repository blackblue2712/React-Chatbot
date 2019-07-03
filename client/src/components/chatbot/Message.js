import React from 'react';

const Message = (props) => {
    if(props.speaks === 'bot') {
        return (
            <div className="col s12 m8 offset-m2 l6 offset-l3">
                <div className="card-panel grey lighten-5 z-depth-1">
                    <div className="row valign-wrapper">
                        {props.speaks==='bot' &&
                        <div className="col s2">
                            <a href="#" className="btn-floating btn-large waves-effect waves-light red">{props.speaks}</a>
                        </div>
                        }
                        <div className="col s10">
                        <span className="black-text">
                            {props.text}
                        </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="col s12 m8 offset-m2 l6 offset-l3" >
                <div className="card-panel z-depth-1" style={{backgroundColor: "#e2e0e0"}}>
                    <div className="row valign-wrapper">
                        <div className="col s10">
                        <span className="black-text">
                            {props.text}
                        </span>
                        </div>
                        <div className="col s2">
                            <a className="btn-floating btn-large waves-effect waves-light red">{props.speaks}</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Message;
