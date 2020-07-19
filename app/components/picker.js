import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Modal } from 'react-native';
import Picker from 'react-native-wheel-picker';

//向内传入 itemList 数据   showPicker 是否显示
var PickerItem = Picker.Item;
const {width, height} = Dimensions.get('window');
export default class MessageMain extends Component {
    static navigationOptions = () => ({
        header: ()=> {
            return  null;
        }
        
    });
    state = {
        changeValue: "",
        selectedItem: 0,
        show: false
    }
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.showPicker != this.state.showPicker) {
    //       this.setState({
    //         showPicker: nextProps.showPicker
    //       });
    //     }
    // }
    //picker改变触发
    hiden = () => {
        this.setState({
            show: false
        })
    }
    show = () => {
        console.log(this.props.itemList)
        this.setState({
            show: true
        })
    }
    onPickerSelect = (index) => {
		this.setState({
            selectedItem: index,
            changeValue: this.props.itemList[index]
		})
    }
    render() {
        return (
                <Modal
                    animationType={'fade'}
                    transparent
                    visible={this.state.show}
                    onRequestClose={() => {}}
                    >
                    <View style={styles.modalStyle}>
                    
                        <View style={styles.selectModalTop}>
                            <View style={styles.selectModalBody}>
                                <TouchableOpacity
                                onPress={() => {
                                    this.hiden()
                                }}
                                >
                                <Text style={{ fontSize: 14, color: '#508DCE' ,marginLeft: 8}}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                onPress={() => {
                                    this.props.getPickerCon(this.state.changeValue)
                                    this.hiden()
                                }}
                                >
                                <Text style={{ fontSize: 14, color: '#508DCE' ,marginRight: 8 }}>确定</Text>
                                </TouchableOpacity>
                            </View>
                            <Picker
                                style={{ width: width, height: 180 }}
                                itemStyle={{ color: 'black', fontSize: 22 }}
                                selectedValue={this.state.selectedItem}
                                onValueChange={(index) => this.onPickerSelect(index)}>
						            {this.props.itemList.map((value, i) => (
							        <PickerItem label={value} value={i} key={"money"+value}/>
						        ))}
                            </Picker>
                        </View>
                    </View>
                </Modal>
        );
    }
}

const styles = StyleSheet.create({
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
