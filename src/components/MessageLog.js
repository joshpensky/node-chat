import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { receiveMessage } from 'actions/messages';
import { registerUser } from 'actions/websockets';
import { Message } from 'components';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  height: inherit;
  flex: 1;
  padding: 20px 20px 0;
  box-sizing: border-box;
`;

Array.prototype.omniMap = function(callback) {
  var result = [];
  var last = null;
  var next = null;
  for (var i = 0; i < this.length; i++) {
    next = this.length > (i + 1) ? this[i + 1] : null;
    result.push(callback(i, last, this[i], next));
    last = this[i];
  }
  return result;
}

class MessageLog extends Component {
  render() {
    const { typers, log } = this.props;
    return (
      <Container>
        {log.omniMap((i, last, msg, next) => {
          const { data, ...metaData } = msg;
          const continuedLast = last !== null ? (last.from === msg.from) : false,
                continuedNext = next !== null ? (next.from === msg.from) : false;
          return (
            <Message
              key={i}
              {...metaData}
              continuedLast={continuedLast}
              continuedNext={continuedNext}
              clientSent={msg.received_at === undefined}
              >
              {data}
            </Message>
          );
        })}
        {typers.length > 0 && `${typers.join(', ')} ${typers.length > 1 ? 'are': 'is'} typing`}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  ws: state.websockets.ws,
  log: state.messages.log,
  typers: state.messages.users,
});

export default connect(
  mapStateToProps,
  {
    receiveMessage,
    registerUser,
  })(MessageLog);