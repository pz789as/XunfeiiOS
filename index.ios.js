/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import XunfeiISE from './XunfeiISE';

// import PracticeInterface from './PracticeInterface';

class XunfeiiOS extends Component {
  render() {
    return (
      <View style={styles.container}>
        <XunfeiISE></XunfeiISE>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent('XunfeiiOS', () => XunfeiiOS);
