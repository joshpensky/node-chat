import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { updateHeadHeight } from 'actions/websockets';
import PropTypes from 'prop-types';
import { black, latoFont, outlineGray, white } from 'style/constants';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px 20px 12px;
  box-sizing: border-box;
  border-bottom: 1px solid ${outlineGray};
  background-color: ${white};
  z-index: 100;
`;

const Title = styled.h1`
  font-family: ${latoFont};
  font-size: 20px;
  font-weight: 600;
  color: ${black};

  &::before {
    content: '#';
  }
`;

class Head extends React.Component {
  componentDidMount() {
    this.props.updateHeadHeight(this.container.offsetHeight);
  }

  render() {
    return (
      <Container innerRef={r => this.container = r}>
        <Title>{this.props.name}</Title>
      </Container>
    );
  }
}

Head.propTypes = {
  updateHeadHeight: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  name: state.websockets.channel,
});

export default connect(mapStateToProps, { updateHeadHeight })(Head);