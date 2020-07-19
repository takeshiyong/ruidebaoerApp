import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Modal} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-datepicker';
import {ECharts} from 'react-native-echarts-wrapper';
import moment from 'moment';
import Picker from 'react-native-wheel-picker';
import SplashScreen from 'react-native-splash-screen';

const PickerItem = Picker.Item;
const {width, height} = Dimensions.get('window');
class SelectModal extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state= {
        changData: {},
        selectedItem: 0
    }

    onPickerChange = (index) => {
      this.setState({
        changData: this.props.itemList[index]
      })
    }

    render() {
         return (
            <Modal
              animationType={'fade'}
              transparent
              visible={this.props.showPicker}
              onRequestClose={() => {}}
            >
              <View style={styles.modalStyle}>
                  <View style={styles.selectModalTop}>
                      <View style={styles.selectModalBody}>
                          <TouchableOpacity
                          onPress={() => {
                              this.props.onCancel();
                              this.setState({changData: {}})
                          }}
                          >
                          <Text style={{ fontSize: 14, color: '#508DCE' ,marginLeft: 8}}>取消</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                              onPress={()=>{
                                this.props.onCancel();
                                this.props.onOK(this.state.changData);
                              }}
                          >
                          <Text style={{ fontSize: 14, color: '#508DCE' ,marginRight: 8 }}>确定</Text>
                          </TouchableOpacity>
                      </View>
                      {
                        this.props.pickerList.length != 0 ?
                        <Picker
                          style={{ width: width, height: 180 }}
                          itemStyle={{ color: 'black', fontSize: 22 }}
                          selectedValue={this.state.selectedItem}
                          onValueChange={(index) => this.onPickerChange(index)}>
                          { this.props.pickerList.map((value, i) => (
                              <PickerItem label={value} value={i} key={value}/>
                          ))}
                        </Picker> : null
                      }
                      
                  </View>
              </View>
          </Modal>
        );
    }
}


export default SelectModal;

const styles = StyleSheet.create({
    hideLine: {
      width: '100%',
      borderBottomWidth: 2,
      borderBottomColor: '#fff',
      position: 'absolute',
      bottom: 13
    },
    modalStyle: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      alignItems: 'center'
    },
    selectModalTop: {
        width: width,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0
      },
    selectModalBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 5,
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1
    },
});
