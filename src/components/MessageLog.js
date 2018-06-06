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

function omniMap(arr, callback) {
  var result = [];
  var last = null;
  var next = null;
  for (var i = 0; i < arr.length; i++) {
    next = arr.length > (i + 1) ? arr[i + 1] : null;
    result.push(callback(i, last, arr[i], next));
    last = arr[i];
  }
  return result;
}

class MessageLog extends Component {
  render() {
    const { typers } = this.props;
    return (
      <Container>
        {omniMap(this.props.log, (i, last, msg, next) => {
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