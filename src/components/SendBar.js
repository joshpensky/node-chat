import React, { Component } from 'react';
import styled, { extend } from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sendMessage, toggleTyping, updateSendBarHeight } from 'actions/messages';
import { bgGray, blue, disabled, fontSize, outlineGray, radiusMd, radiusLg, systemFont, white } from 'style/constants';
import { newlineResolver } from 'utils';

const Container = styled.section`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 15px;
  //background-color: ${bgGray};
  //border-top: 1px solid ${outlineGray};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  position: relative;
`;

const TextBox = styled.textarea`
  width: 100%;
  border: 1px solid ${outlineGray};
  background-color: ${white};
  border-radius: ${radiusMd};
  border-top-right-radius: ${radiusLg};
  border-bottom-right-radius: ${radiusLg};
  outline: none;
  padding: 8px 12px;
  padding-right: 42px;
  box-sizing: border-box;
  line-height: 20px;
  font-size: ${fontSize};
  height: ${props => props.height}px;
  font-family: ${systemFont};
  resize: none;
  overflow: hidden;
  caret-color: ${blue};
`;

const ShadowInput = styled.div`
  border: 1px solid red;
  background-color: red;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  padding: 8px 12px;
  padding-right: 42px;
  box-sizing: border-box;
  font-family: ${systemFont};
  font-size: ${fontSize};
  line-height: 20px;
  min-height: ${props => props.minHeight}px;
  pointer-events: none;
  word-wrap: break-word;
  text-wrap: unrestricted;
  visibility: hidden;
`;

const Submit = styled.div`
  position: absolute;
  top: 6px;
  right: 10px;
  width: 26px;
  height: 26px;
  background-color: ${props => props.clickable ? blue : disabled};
  border-radius: 50%;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
`;

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 3px;
  height: 14px;
  border-radius: 1px;
  background-color: ${white};

  &::before, &::after {
    content: '';
    position: absolute;
    background-color: ${white};
  }

  &::before {
    left: 0;
    top: 0;
    width: 2px;
    height: 8px;
    border-radius: 1px;
    transform-origin: top center;
    transform: rotate(45deg) translate(0px, 1px);
  }

  &::after {
    left: 0;
    top: 0;
    width: 8px;
    height: 2px;
    border-radius: 1px;
    transform-origin: top center;
    transform: rotate(45deg) translate(3px, 1px);
  }
`

class SendBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      defaultHeight: 40,
      height: 40,
      scrollbarPresent: false,
      fontSize: parseInt(fontSize),
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.newLineHandler = this.newLineHandler.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
  }

  componentDidMount() {
    this.textBox.focus();
    const newLines = JSON.stringify(this.state.message).split(/\r\n|\r|\n/).length;
    this.updateHeight(this.state.height + (this.state.message.length > 0 ? this.state.fontSize * newLines : 0));
  }

  sendMessage(e) {
    e.preventDefault();
    const { message } = this.state;
    if (message.trim().length > 0) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
      const msg = {
        data: message,
        created_at: Date.now().toString(),
      };
      this.props.sendMessage(msg);
      this.setState({
        message: '',
      }, () => {
        this.textBox.focus();
      });
    }
  }

  updateHeight(height, callback) {
    this.setState({
      height: height,
    }, () => {
      this.props.updateSendBarHeight(this.container.offsetHeight);
      if (callback) callback();
    });
  }

  updateMessage(e) {
    const { value } = e.target;
    if (value.trim().length <= 0) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
      if (this.props.typing) {
        this.props.toggleTyping(false);
      }
      this.updateHeight(this.state.defaultHeight);
    } else if (!this.props.typing && this.timeout === undefined) {
      this.timeout = setTimeout(() => {
        this.timeout = null;
        this.props.toggleTyping(true);
      }, 250);
    }
    this.setState({
      message: value,
    }, () => {
      const shadowHeight = this.shadowInput.offsetHeight;
      if (shadowHeight !== this.state.height) {
        this.updateHeight(shadowHeight, () => {
          this.setState({
            scrollbarPresent: this.textBox.clientHeight < this.textBox.scrollHeight
          });
        });
      }
    });
  }

  newLineHandler(e) {
    if (e.keyCode === 13) {
      if (e.shiftKey) {
        this.updateHeight(this.state.height + this.state.fontSize);
      } else {
        this.sendMessage(e);
        this.updateHeight(this.state.defaultHeight);
      }
    }
  }

  render() {
    return (
      <Container innerRef={r => this.container = r}>
        <Wrapper>
          <ShadowInput
            innerRef={r => this.shadowInput = r}
            minHeight={this.state.defaultHeight}
            scrollbarPresent={this.state.scrollbarPresent}
            >
            {newlineResolver(this.state.message)}
          </ShadowInput>
          <TextBox
            innerRef={r => this.textBox = r}
            placeholder="Web Message"
            value={this.state.message}
            onChange={this.updateMessage}
            onKeyDown={this.newLineHandler}
            height={this.state.height}
            />
          <Submit onClick={this.sendMessage} clickable={this.state.message.trim().length > 0}>
            <Arrow />
          </Submit>
        </Wrapper>
      </Container>
    );
  }
}

SendBar.propTypes = {
  typing: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  typing: state.messages.typing,
})

export default connect(
  mapStateToProps,
  {
    sendMessage,
    toggleTyping,
    updateSendBarHeight,
  },
)(SendBar);