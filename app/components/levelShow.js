import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class LevelShow extends React.Component {
  render() {
    return (
      <View>
        <LinearGradient start={{x: 0.0, y: 0.5}} end={{x: 1.0, y:0.5}} colors={['#FF632E', '#FF8949']} style={styles.linearGradient}>
          <Text style={styles.buttonText}>
            {this.props.level}
          </Text>
        </LinearGradient>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    borderTopLeftRadius: 4,
    borderBottomRightRadius: 4,
    paddingLeft: 10,
    paddingRight: 10,
    width: 45
  },
  buttonText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center'
  }
});