import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { sendMessage, toggleTyping } from 'actions/messages';
import { bgGray, outlineGray, radiusMd, radiusLg, systemFont, white } from 'style/constants';

const Container = styled.section`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 15px;
  background-color: ${bgGray};
  border-top: 1px solid ${outlineGray};
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
  box-sizing: border-box;
  line-height: 18px;
  font-size: 16px;
  height: 38px;
  font-family: ${systemFont};
  resize: none;
`;

const Submit = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  background-color: #0000ff;
  border-radius: 50%;
  cursor: pointer;
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
    height: 10px;
    border-radius: 1px;
    transform-origin: top center;
    transform: rotate(45deg);
  }

  &::after {
    left: 0;
    top: 0;
    width: 10px;
    height: 2px;
    border-radius: 1px;
    transform-origin: top center;
    transform: rotate(45deg) translate(2px, 2px);
  }
`

class SendBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.newLineHandler = this.newLineHandler.bind(this);
  }

  componentDidMount() {
    this.textBox.focus();
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

  updateMessage(e) {
    const { value } = e.target;
    if (value.trim().length <= 0) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
      if (this.props.typing) {
        this.props.toggleTyping(false);
      }
    } else if (!this.props.typing && this.timeout === undefined) {
      this.timeout = setTimeout(() => {
        this.timeout = null;
        this.props.toggleTyping(true);
      }, 250);
    }
    this.setState({
      message: value,
    });
  }

  newLineHandler(e) {
    if (e.keyCode === 13) {
      if (!e.shiftKey) {
        this.sendMessage(e);
      }
    }
  }

  render() {
    return (
      <Container innerRef={r => this.container = r}>
        <Wrapper>
          <TextBox
            innerRef={r => this.textBox = r}
            placeholder="Web Message"
            value={this.state.message}
            onChange={this.updateMessage}
            onKeyDown={this.newLineHandler}
            />
          <Submit onClick={this.sendMessage}>
            <Arrow />
          </Submit>
        </Wrapper>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  typing: state.messages.typing,
})

export default connect(mapStateToProps, { sendMessage, toggleTyping })(SendBar);