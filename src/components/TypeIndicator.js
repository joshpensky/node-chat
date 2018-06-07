import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import { black, bgGray, outlineGray, radiusMd, radiusSm, latoFont, white } from 'style/constants';

const Container = styled.div.attrs({
  className: 'type-indicator',
})`
  display: flex;
  flex-direction: row;
  align-self: flex-start;
  box-sizing: border-box;
  padding: 7px 12px;
  margin-bottom: 2px;
  color: ${props => props.clientSent ? white : black};
  background-color: ${bgGray};
  border-radius: 17px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: ${bgGray};
    border-radius: 50%;
    width: 14px;
    height: 14px;
    transform: translate(-1px, 1px);
  }
`;

const dotPulse = keyframes`
  0% {
    background-color: ${outlineGray};
  }
  50% {
    background-color: #d0d0d0;
  }
  100% {
    background-color: ${outlineGray};
  }
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  background-color: ${outlineGray};
  margin: 4px 0;
  margin-right: 5px;
  border-radius: 50%;
  animation: ${dotPulse} 1s ${props => props.delay}s ease-in-out infinite;

  &:last-child {
    margin-right: 0;
  }
`;

class TypeIndicator extends Component {
  render() {
    return (
      <Container>
        {[0, 1, 2].map(i => (
          <Dot key={i} delay={i / 3} />
        ))}
      </Container>
    );
  }
}

export default TypeIndicator;