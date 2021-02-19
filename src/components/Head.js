import React, { Component } from 'react';

import { StyleSheet, Text } from 'react-native';
import { colorPallet } from '../util.js';

class Head extends Component {
  render() {
    return (
      <Text>
      heell0
      </Text>
    );
  }
}

const styles = StyleSheet.create({
    header:{
        width: '100%',
        backgroundColor: colorPallet.grey
    }
})

export default Head;