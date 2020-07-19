import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  NativeModules,
  processColor,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions
} from 'react-native';
import WebView from 'react-native-webview';

const { width, height } = Dimensions.get('window');
export default class LiveWeb extends Component {
    constructor(props) {
      super(props);
      this.state = {showbar: true, degree: 0 , mirror: false, volume: 0.5};
    }

    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    render() {
      return (
      <View style={[styles.container]}>
        <WebView
            style={{borderWidth: 1,borderColor: 'red',flex: 1}}
            originWhitelist={["*"]}
            scrollEnabled={false}
            source={{uri: "http://125.76.235.75:10080/share.html?id=1401&amp;type=live"}}
            onError={syntheticEvent => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
            onLoadProgress={({ nativeEvent }) => {
              console.log('nativeEvent.progress', nativeEvent.progress);
            }}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'black',
  },
  
});