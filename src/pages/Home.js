import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { H1 } from 'style';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ws: new WebSocket('ws://localhost:4000'),
      message: '',
      log: [],
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
  }

  componentDidMount() {
    const { ws } = this.state;
    ws.onmessage = e => {
      this.setState({
        log: [...this.state.log, e.data],
      });
    }
  }

  componentWillUnmount() {
    this.state.ws.close();
  }

  sendMessage() {
    const { ws, message } = this.state;
    if (message.trim().length > 0) {
      ws.send(message);
      this.setState({
        message: '',
        log: [...this.state.log, message],
      });
    }
  }

  updateMessage(e) {
    this.setState({
      message: e.target.value,
    });
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <H1>Welcome to node-chat</H1>
        <input type="text" name="message" value={this.state.message} onChange={this.updateMessage} />
        <button onClick={this.sendMessage}>Send Message</button>
        <hr />
        <H1>Log</H1>
        <ul>
          {this.state.log.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </Fragment>
    );
  }
}

export default Home;