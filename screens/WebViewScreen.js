import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default class WebViewScreen extends Component {
  render() {
    const { url } = this.props.navigation.state.params;
    return (
      <WebView source={{ uri: url }} />
    );
  }
}