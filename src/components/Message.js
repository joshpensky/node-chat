import React, { Component, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { black, radiusMd, radiusSm, systemFont, white } from 'style/constants';
import { newlineResolver } from 'utils';

const Container = styled.li`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-${props => props.clientSent ? 'end': 'start'};
  margin-bottom: ${props => props.continuedNext ? '2px' : '6px'};
`;

const Bubble = styled.div`
  max-width: 75%;
  padding: 8px 12px;
  box-sizing: border-box;
  color: ${props => props.clientSent ? white : black};
  background-color: ${props => props.clientSent ? '#0000ff' : '#e6e6e6'};
  border-radius: ${radiusMd};
  ${props => (props.continuedLast || props.continuedNext) && css`
    border-top-${props => props.clientSent ? 'right': 'left'}-radius: ${radiusSm};
  `}
  ${props => props.continuedNext && css`
    border-bottom-${props => props.clientSent ? 'right': 'left'}-radius: ${radiusSm};
  `}
  font-family: ${systemFont};
  font-size: 16px;
  line-height: 18px;
  vertical-align: top;
`;

const SubMessage = styled.p`
  font-size: 12px;
  line-height: 12px;
  color: #9f9f9f;
  font-family: ${systemFont};
  padding-top: 4px;
`;

class Message extends Component {
  render() {
    const { clientSent, continuedLast, continuedNext, created_at, received_at, delivered } = this.props;
    return (
      <Container
        clientSent={clientSent}
        continuedNext={continuedNext}
        >
        <Bubble
          clientSent={clientSent}
          continuedLast={continuedLast}
          continuedNext={continuedNext}
          >
          {newlineResolver(this.props.children)}
        </Bubble>
        {(clientSent && !continuedNext) && <SubMessage>Delivered</SubMessage>}
      </Container>
    )
  }
}

export default Message;