import React, { Component } from 'react';
import axios from 'axios/index';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';
import Message from './Message';
import Card from './Card';
import { resolve } from 'dns';
import QuickReplies from './QuickReplies';
import { withRouter } from 'react-router-dom';

import './index.css';

require('dotenv').config();

const cookies = new Cookies()

class Chatbot extends Component {
    messageEnd;
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            isShow: true,
            isWelcomeShopSent: false
        }

        this.renderMessages = this.renderMessages.bind(this);
        this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
        this.handleQuickRepliePayload = this.handleQuickRepliePayload.bind(this);
        this.toggleShowBot = this.toggleShowBot.bind(this);

        if(cookies.get("uesrId") === undefined) {
            cookies.set('userId', uuid(), { path: '/'});
        }
    }

    async df_text_query (queryText) {
        let msg;
        let says = {
            speaks: 'user',
            msg: {
                text : {
                    text: queryText
                }
            }
        }
        this.setState({ messages: [...this.state.messages, says]});

        try {
            const res = await axios.post('http://localhost:5000/api/df_text_query',  {text: queryText, userId: cookies.get("userId")});
            const queryResult = res.data[0].queryResult;

            if (queryResult.fulfillmentMessages ) {
                for (let i = 0; i < queryResult.fulfillmentMessages.length; i++) {
                    msg = queryResult.fulfillmentMessages[i];
                    says = {
                        speaks: 'bot',
                        msg: msg
                    }

                    this.setState({ messages: [...this.state.messages, says]});
                }
            }
        } catch(err) {
            says = {
                speaks: 'bot',
                msg: {
                    text: {
                        text: "I'm having troubles. I need to termanate and will be back late"
                    }
                }
            }
            this.setState({ messages: [...this.state.messages, says]});
            setTimeout( () => {
                this.setState( {isShow: false} )
            }, 2000)    
        }
        
    };


    async df_event_query(eventName) {

        try{
            const res = await axios.post('http://localhost:5000/api/df_event_query',  {event: eventName, userId: cookies.get("userId")});
            let msg, says = {};

            if (res.data.fulfillmentMessages ) {
                for (let i=0; i<res.data.fulfillmentMessages.length; i++) {
                    msg = res.data.fulfillmentMessages[i];
                    says = {
                        speaks: 'bot',
                        msg: msg
                    }

                    this.setState({ messages: [...this.state.messages, says]});
                }
            }
        } catch(err) {
            let says = {
                speaks: 'bot',
                msg: {
                    text: {
                        text: "I'm having troubles. I need to termanate and will be back late"
                    }
                }
            }
            this.setState({ messages: [...this.state.messages, says]});
            setTimeout( () => {
                this.setState( {isShow: false} )
            }, 2000)    
        }
        
    };

    renderCards(cards) {
        return cards.map( (card, index) => {
            return <Card key={index} props={card.structValue} />
        })
    }

    renderOneMessage(mes, index) {
        if(mes.msg && mes.msg.text && mes.msg.text.text) {
            return <Message key={index} speaks={mes.speaks} text={mes.msg.text.text}></Message>
        } else if(mes.msg && mes.msg.payload && mes.msg.payload.fields.cards) {
            return <div key={index}>
                <div className="card-panel grey lighten-5 z-depth-1">
                    <div style={{overflow: "hidden"}}>
                        <div className="col s2">
                            <a href="#" className="btn-floating btn-large waves-effect waves-light red">BOT</a>
                        </div>
                        <div id="prods" style={{overflow: 'auto', 'overflowY': 'scroll', display: "flex", "flex-direction": "column"}}>
                            <div style={{height: "400px", width: mes.msg.payload.fields.cards.listValue.values.length * 170}}>
                                {this.renderCards(mes.msg.payload.fields.cards.listValue.values)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        } else if(mes.msg && mes.msg.payload && mes.msg.payload.fields.quick_replies) {
            return <QuickReplies
                text={mes.msg.payload.fields.text ? mes.msg.payload.fields.text : null}
                replyClick={this.handleQuickRepliePayload}
                key={index}
                speaks={mes.speaks}
                payload={mes.msg.payload.fields.quick_replies.listValue.values}
            />
        }
    }

    renderMessages(messageState) {
        if(messageState) {
            return messageState.map( (mes, index) => {
                return this.renderOneMessage(mes, index);
            })
        } else {
            return null;
        }
    }

    handleInputKeyPress(e) {
        if(e.key === "Enter") {
            let textQuery = e.target.value;
            this.df_text_query(textQuery);
            e.target.value = '';
        }
    }

    handleQuickRepliePayload(payload, text) {
        console.log(payload)
        switch(payload.stringValue) {
            case "recommended_yes":
                this.df_event_query("SHOW_RECOMMENDATIONS");
            break;
            case "training_masterclass":
                this.df_event_query(text);
            break;
            default: 
                this.df_text_query(text);
            break;
        }
    }

    toggleShowBot() {
        this.setState( {isShow: !this.state.isShow} )
    }

    waitAfterXSeconds(x = 1) {
        return new Promise( resolve => {
            setTimeout(() => {
                resolve();
            }, x*1000)
        })
    }

    componentDidMount() {
        this.df_event_query("Welcome");
        
       
    }

    async componentDidUpdate() {
        this.messageEnd.scrollIntoView( {behavior: "smooth"} );

        if(window.location.path === '/shop' && !this.state.isWelcomeShopSent) {
            await this.waitAfterXSeconds(1);
            this.df_event_query("WELCOME_SHOP");
            this.setState( {isShow: true, isWelcomeShopSent: true} );
        }

        if(this.props.history.location.pathname === '/shop' && !this.state.isWelcomeShopSent) {
            await this.waitAfterXSeconds(1);
            this.df_event_query("WELCOME_SHOP");
            this.setState( {isShow: true, isWelcomeShopSent: true} );
        }
    }




    render() {
        const { messages, isShow } = this.state;
        if(isShow) {
            return (
                <div style={{position: "absolute", height: 500, width: 400, bottom: 0, right: 0, border: "1px solid lightgrey"}}>
                    <nav>
                        <div className="nav-wrapper">
                            <a href="#" className="brand-logo">ChatBot</a>
                            <ul id="nav-mobile" className="right hide-on-med-and-down">
                                <li><a onClick={this.toggleShowBot}>Close</a></li>
                            </ul>
                        </div>
                    </nav>
                    <div id="chatbot" style={{width: "100%", height: "388px", overflow: "auto"}}>
                        {this.renderMessages(messages)}
                        <div 
                            ref={(ele) => {this.messageEnd = ele}}
                            style={{float: "left", clear: "both"}}
                        ></div>
                    </div>
                    <div className="col s12">
                        <input
                            type="text" onKeyPress={this.handleInputKeyPress}
                            style={{
                                margin: 0,
                                paddingLeft: "1%",
                                paddingRight: "1%",
                                width: "98%",
                            }}
                            placeholder="Type a message"
                        />
                    </div>
                </div>
            )
        } else {
            return (
                <div style={{position: "absolute", height: 50, width: 400, bottom: 0, right: 0, border: "1px solid lightgrey"}}>
                    <nav>
                        <div className="nav-wrapper">
                            <a href="#" className="brand-logo">ChatBot</a>
                            <ul id="nav-mobile" className="right hide-on-med-and-down">
                                <li><a onClick={this.toggleShowBot}>Show</a></li>
                            </ul>
                        </div>
                    </nav>
                    <div 
                        ref={(ele) => {this.messageEnd = ele}}
                        style={{float: "left", clear: "both"}}
                    ></div>
                </div>
            )
        }
    }
}

export default withRouter(Chatbot);