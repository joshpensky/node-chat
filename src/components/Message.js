import React, { Component, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { bgGray, black, blue, fontSize, radiusMd, radiusSm, latoFont, white } from 'style/constants';
import { newlineResolver } from 'utils';

const Container = styled.li`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-${props => props.clientSent ? 'end': 'start'};
  margin-bottom: ${props => props.chainedNext ? '2px' : '6px'};

  ${props => !props.clientSent && css`
    & + .type-indicator {
      margin-top: -4px;
    }
  `}
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 75%;
  align-items: flex-${props => props.clientSent ? 'end': 'start'};
`;

const Bubble = styled.div`
  padding: 6px 12px 8px;
  box-sizing: border-box;
  color: ${props => props.clientSent ? white : black};
  background-color: ${props => props.clientSent ? blue : bgGray};
  border-radius: ${radiusMd};
  ${props => props.chainedLast && css`
    border-top-${props => props.clientSent ? 'right': 'left'}-radius: ${radiusSm};
  `}
  ${props => props.chainedNext && css`
    border-bottom-${props => props.clientSent ? 'right': 'left'}-radius: ${radiusSm};
  `}
  font-family: ${latoFont};
  font-size: ${fontSize};
  line-height: 18px;
  vertical-align: middle;
`;

const SubMessage = styled.p`
  font-size: 12px;
  line-height: 12px;
  color: #9f9f9f;
  font-family: ${latoFont};
  padding-top: 4px;
`;

class Message extends Component {
  render() {
    const { clientSent, chainedLast, chainedNext, created_at, received_at, delivered } = this.props;
    return (
      <Container
        clientSent={clientSent}
        chainedNext={chainedNext}
        >
        <Wrapper clientSent={clientSent}>
          <Bubble
            clientSent={clientSent}
            chainedLast={chainedLast}
            chainedNext={chainedNext}
            >
            {newlineResolver(this.props.children)}
          </Bubble>
          {/*(clientSent && !chainedNext) && <SubMessage>Delivered</SubMessage>*/}
        </Wrapper>
      </Container>
    );
  }
}

export default Message;