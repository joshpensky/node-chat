import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { receiveMessage } from 'actions/messages';
import { registerUser } from 'actions/websockets';
import { Message, TypeIndicator } from 'components';

const Container = styled.section`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc(100% - ${props => props.offset}px);
  overflow: auto;
`;

const List = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
  padding-bottom: 3px;
  box-sizing: border-box;
`

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

const CONTINUE_EXPIRE = 1000 * 30;

class MessageLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: this.props.offset,
      logCount: this.props.logCount,
    };
    
    this.bottomScroll = this.bottomScroll.bind(this);
  }

  componentDidMount() {
    this.observer = new MutationObserver(this.bottomScroll);
    this.observer.observe(this.list, {
      childList: true,
    });
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.offset !== this.state.offset || nextProps.logCount !== this.state.logCount) {
      this.setState({
        offset: nextProps.offset,
        logCount: nextProps.logCount
      }, this.bottomScroll);
    }
  }

  bottomScroll() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  render() {
    const { typers } = this.props;
    return (
      <Container innerRef={r => this.container = r} offset={this.props.offset}>
        <List innerRef={r => this.list = r}>
          {this.props.log.omniMap((i, last, msg, next) => {
            const { data, ...metaData } = msg,
                  chainedLast = last === null ? false : last.from === msg.from && this.props.history[msg.from][msg.created_at].chained,
                  chainedNext = next === null ? false : next.from === msg.from && this.props.history[next.from][next.created_at].chained;
            return (
              <Message
                key={i}
                {...metaData}
                chainedLast={chainedLast}
                chainedNext={chainedNext}
                clientSent={msg.from === this.props.userId}
                >
                {data}
              </Message>
            );
          })}
          {typers.length > 0 && <TypeIndicator />
            /*`${typers.join(', ')} ${typers.length > 1 ? 'are': 'is'} typing`*/}
        </List>
      </Container>
    );
  }
}

MessageLog.propTypes = {
  ws: PropTypes.object.isRequired,
  log: PropTypes.array.isRequired,
  logCount: PropTypes.number.isRequired,
  typers: PropTypes.array.isRequired,
  offset: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  ws: state.websockets.ws,
  history: state.messages.history,
  log: state.messages.log,
  logCount: state.messages.log.length,
  typers: Array.from(state.messages.typers),
  offset: state.messages.sendbarHeight,
  userId: state.websockets.id,
});

export default connect(
  mapStateToProps,
  {
    receiveMessage,
    registerUser,
  })(MessageLog);