import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';

export default class Radio extends Component {
  render() {
    const { label, style, value } = this.props;
    return (
      <TouchableOpacity style={[styles.content, style ? style: {}]} 
      onPress={()=>{
        if (value) return;
        this.props.onChange && this.props.onChange()
        }}>
        { value ?
          <View style={styles.selected}>
            <View style={styles.selectCircle}/>
          </View>
          :
          <View style={styles.unSelected}/>
        }
        <Text style={{color: '#333',fontSize: 12}}>{label}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  unSelected: {
    width: 16,
    height: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',marginRight: 10
  },
  selected: {
    width: 16,
    height: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#4B74FF',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectCircle: {
    width: 9,
    height: 9,
    borderRadius: 50,
    backgroundColor: '#4B74FF'
  }
})