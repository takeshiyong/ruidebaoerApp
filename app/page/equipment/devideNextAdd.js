import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions,Modal,TouchableOpacity, TextInput,Image,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../../components/header';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import deviceService from '../../service/deviceServer';
import Picker from 'react-native-wheel-picker';

import Toast from '../../components/toast';

const PickerItem = Picker.Item;
const { width, height } = Dimensions.get('window');

export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      diviceVersion: '',
      diviceProduceNum: null,
      divicePower: null,
      powerDate: '',
      navigationParams: {},
      objItem: [],
      showPicker: false,
      pickerList: [],
      changeData: {},
      itemList: [],
      typeData: {
        index: 0,
        fId: '',
        fName: '请选择设备型号'
      },
      deviceNumber: []
    //   manufacturer: {}
    }

    componentDidMount() {
    this.getDeviceEquipmentTypeModelSelectAll();
    const { fId } = this.props.navigation.state.params.typeData
      SplashScreen.hide();
      this.getEquipmentAttribute(fId);
      this.setState({
        navigationParams: this.props.navigation.state.params
      },() => {console.log(this.state.navigationParams)})
    }
    //根据设备类型id查询属性信息
    getEquipmentAttribute = async (id) => {
        const res = await deviceService.getEquipmentAttribute(id);
        console.log(res)
        if(res.success){
            this.setState({
                objItem: res.obj
            })
        }else{
            console.log(res.msg);
            Toast.show(res.msg)
        }
    }
    setManuFacturer = (item) => {
      console.log(item)
      this.setState({
        manufacturer: item
      })
    }
    //判断是不是纯数字
    checknumber (String) {
        var reg = /^[0-9]+.?[0-9]*$/;
        if (reg.test(String)) {
          return true
        }
        return false
      }
    //获取设备型号
    getDeviceEquipmentTypeModelSelectAll = async () => {
        const res = await  deviceService.getDeviceEquipmentTypeModelSelectAll();
        console.log('deviceNumber',res);
        if(res.success){
            this.setState({
                deviceNumber: res.obj
            })
        }else{
            console.log(res.msg)
        }
    }
    //设备新建
    addDevice = async() => {
        const { objItem, diviceVersion, diviceProduceNum, typeData,divicePower, powerDate, navigationParams} = this.state;
        if(typeData.fId == ""){
            Toast.show('设备型号不能为空');
            return;
        }
        if(divicePower.trim().length == 0){
            Toast.show('额定功率不能为空');
            return;
        }else{
            let a = this.checknumber(divicePower);
            if(!a){
                Toast.show('额定功率只能为数字类型');
                return;
            }
        }
        if(diviceProduceNum.trim().length == 0){
            Toast.show('生产能力不能为空');
            return;
        }else{
            let b= this.checknumber(diviceProduceNum);
            if(!b){
                Toast.show('额定功率只能为数字类型');
                return;
            }
        }
        if(powerDate.trim().length == 0){
            Toast.show('生产日期不能为空');
            return;
        }
        if(this.state.manufacturer == null){
            Toast.show('制造商不能为空');
            return;
        }
        let infoList = [];
        if(this.state.objItem.length !== 0){
            for(let item of this.state.objItem){
                if(this.state[item.fId]&&this.state[item.fId].trim().length == 0){
                    Toast.show(`请输入设备属性${item.fAttributeName}`);
                    return;
                }
                console.log(item);
                infoList.push({
                    fAttributeId: item.fId,
                    fEquipmentId: item.fEquipmentTypeInfoId,
                    fValue: this.state[item.fId] ? this.state[item.fId]: '',
                    attributeName: item.fAttributeName
                })
            }
        }
        const res = await deviceService.addDevice({
            fAreaId: navigationParams.areaData.fId,
            fEquipmentName: navigationParams.diviceName,
            fEquipmentTypeInfoId: navigationParams.typeData.fId,
            fLevelId: navigationParams.levelData.fId,
            fManufacturerId: this.state.manufacturer.fId,
            fProductionDate:  new Date(powerDate.replace(/-/g, '/')).getTime(),
            fRatedPower: divicePower,
            fProductionCapacity: diviceProduceNum,
            fImageUrl: navigationParams.picArr[0].path,
            infoList: infoList,
            fEquipmentModel: navigationParams.diviceNum,
            fEquipmentType: typeData.fId,
            // manufacturerAddress: this.state.manufacturer.fManufacturerAddress?this.state.manufacturer.fManufacturerAddress: '',
            // manufacturerName: this.state.manufacturer.fManufacturerName?this.state.manufacturer.fManufacturerName: '',
            // manufacturerPhone: this.state.manufacturer.fPhone?this.state.manufacturer.fPhone: null
        })
        if(res.success){
            this.props.navigation.state.params.onRefresh()
            this.props.navigation.pop(2)
            Toast.show(res.msg)
        }else{
            console.log(res.msg);
            Toast.show(res.msg)
        }
    }
    //设备型号
    chooseDeviceType = () => {
        const {deviceNumber} = this.state;
        if(deviceNumber.length > 0){
            const selectList = deviceNumber.map((data, index)=>{
                return {
                    index: index,
                    fId: data.fId,
                    fName: data.fEquipmentType
                }
            });
            console.log(selectList)
            this.setState({
                itemList: selectList,
                pickerList: selectList.map((data)=>(data.fName)),
                changeData: selectList[deviceNumber.index],
                showPicker: true,
            });
        } 
    }
    //picker确认改值
    onPickerSelect = () => {
        const {typeData, changeData, pickerType, levelData, areaData} = this.state;
        this.setState({
            showPicker: false,
            typeData: {
                index: typeData.index,
                fName: changeData.fName,
                fId: changeData.fId,
            },
        })
        
    }

    // picker滚动的时候改值
    onPickerChange = (index) => {
        const { changeData, itemList } = this.state;
        this.setState({
            changeData: itemList[index]
        });
    }
    render() {
      const { typeList } = this.state;
        return (
          <View style={styles.container}>
              
            <Header 
              titleText="设备添加"
              backBtn={true}
              hidePlus={true}
            />
            <Modal
                    animationType={'fade'}
                    transparent
                    visible={this.state.showPicker}
                    onRequestClose={() => {}}
                    >
                    <View style={styles.modalStyle}>
                        <View style={styles.selectModalTop}>
                            <View style={styles.selectModalBody}>
                                <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        showPicker: false,
                                        changeData: {}
                                    })
                                }}
                                >
                                <Text style={{ fontSize: 14, color: '#508DCE' ,marginLeft: 8}}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.onPickerSelect}
                                >
                                <Text style={{ fontSize: 14, color: '#508DCE' ,marginRight: 8 }}>确定</Text>
                                </TouchableOpacity>
                            </View>
                            <Picker
                                style={{ width: width, height: 180 }}
                                itemStyle={{ color: 'black', fontSize: 22 }}
                                selectedValue={this.state.selectedItem}
                                onValueChange={(index) => this.onPickerChange(index)}>
                                {this.state.pickerList.map((value, i) => (
                                    <PickerItem label={value} value={i} key={value}/>
                                ))}
                            </Picker>
                        </View>
                    </View>
                </Modal>
            <ScrollView>
                <View style={{paddingLeft: 16,paddingRight: 16,marginTop: 12,backgroundColor: '#FFF',}}>
                    <TouchableOpacity style={[styles.item,{height: 47}]} onPress={() => {this.chooseDeviceType()}}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Image source={require("../../image/deviceAdd/appsBig.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                            <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                <Text style={{color: 'red'}}>*</Text>
                                设备型号
                                </Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Text style={{fontSize: 14, color: "#666"}}>{this.state.typeData ? this.state.typeData.fName : '请选择设备型号'}</Text>
                            <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 5 }}/>
                        </View>
                    </TouchableOpacity>
                    {
                        this.state.objItem.length !== 0 ? this.state.objItem.map((item) => {
                            return(<View style={[styles.item,{height: 47}]}>
                                <View style={{flexDirection: "row",alignItems: "center"}}>
                                    <Image source={require("../../image/deviceAdd/mapMark.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                        <Text style={{color: 'red'}}>*</Text>
                                        {item.fAttributeName? item.fAttributeName: '--'}
                                        </Text>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <TextInput
                                            style={{height: "100%", borderWidth: 0,color: "#666666",textAlign: "right"}}
                                            placeholder={`请输入${item.fAttributeName?item.fAttributeName: '--' }`}
                                            multiline={false}
                                            maxLength={18}
                                            placeholderTextColor= "#666666"
                                            value={this.state[item.fId]}
                                            onChangeText={(text)=>{
                                                this.setState({
                                                    [item.fId]: text.trim()
                                                });
                                            }}
                                        />
                                    {this.state[item.fId]&&this.state[item.fId].trim().length > 0? <Text>{item.fUnit}</Text> : null}
                                </View>
                            </View>)
                        }): null
                    }
                    <View style={[styles.item,{height: 47}]}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Image source={require("../../image/deviceAdd/power.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                            <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                <Text style={{color: 'red'}}>*</Text>
                                额定功率
                                </Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <TextInput
                                    style={{height: "100%", borderWidth: 0,color: "#666666",textAlign: "right"}}
                                    placeholder="请输入额定功率"
                                    multiline={false}
                                    maxLength={18}
                                    placeholderTextColor= "#666666"
                                    value={this.state.divicePower}
                                    onChangeText={(text)=>{
                                        this.setState({
                                          divicePower: text.trim()
                                        });
                                    }}
                                />
                                {this.state.divicePower&&this.state.divicePower.trim().length > 0? <Text>kw</Text> : null}
                        </View>
                    </View>
                    <View style={[styles.item,{height: 47}]}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Image source={require("../../image/deviceAdd/produce.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                            <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                <Text style={{color: 'red'}}>*</Text>
                                生产能力
                                </Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <TextInput
                                    style={{height: "100%", borderWidth: 0,color: "#666666",textAlign: "right"}}
                                    placeholder="请输入生产能力"
                                    multiline={false}
                                    maxLength={18}
                                    placeholderTextColor= "#666666"
                                    value={this.state.diviceProduceNum}
                                    onChangeText={(text)=>{
                                        this.setState({
                                          diviceProduceNum: text.trim()
                                        });
                                    }}
                                />
                            {this.state.diviceProduceNum&&this.state.diviceProduceNum.trim().length > 0? <Text>吨/h</Text> : null}
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.item,{height: 47}]}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/deviceAdd/date.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    生产日期
                                </Text>
                            </View>
                            <View style={{alignItems: "flex-end",flex: 1,justifyContent: 'center'}}>
                                    <DatePicker
                                            style={{width: 160,marginLeft: -35}}
                                            date={this.state.powerDate}
                                            mode="date"
                                            placeholder="请选择生产日期"
                                            format="YYYY-MM-DD"
                                            confirmBtnText="确定"
                                            cancelBtnText="取消"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 4,
                                                    marginLeft: 0
                                                },
                                                dateTouchBody: {
                                                    borderWidth: 0
                                                },
                                                dateInput: {
                                                    marginLeft: 36,
                                                    borderWidth: 0,
                                                    alignItems: 'flex-end',
                                                    paddingRight: 2
                                                },
                                                dateText: {
                                                    color: '#666666'
                                                },
                                                placeholderText: {
                                                    color: '#666666'
                                                }
                                            }}
                                            iconComponent={<AntDesign name="right" color="#666666"/>}
                                            onDateChange={(date) => {this.setState({powerDate: date})}}
                                        />
                            </View>
                        </TouchableOpacity>
                    <TouchableOpacity style={[styles.item]} onPress={() => {this.props.navigation.push('ManufacturerList',{getManuFacturer: this.setManuFacturer})}}>
                            <View style={{flexDirection: "row",flex: 6,paddingTop: 10}}>
                                <Image source={require("../../image/deviceAdd/people.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    制  造  商
                                </Text>
                            </View>
                            
                              {
                                this.state.manufacturer? 
                                <View style={{flexDirection: "row", alignItems: "center",paddingTop: 10,paddingBottom: 10,flex: 4,justifyContent: "space-between"}}>
                                  <View>
                                    <Text style={{fontSize: 14, color: "#666666",marginBottom:5}}>名称: {this.state.manufacturer.fManufacturerName? this.state.manufacturer.fManufacturerName: '--'}</Text>
                                    <Text style={{fontSize: 14, color: "#666666",marginBottom:5}}>电话: {this.state.manufacturer.fPhone? this.state.manufacturer.fPhone: '--'}</Text>
                                    <Text style={{fontSize: 14, color: "#666666"}}>地址: {this.state.manufacturer.fManufacturerAddress? this.state.manufacturer.fManufacturerAddress: '--'}</Text>
                                  </View>
                                  <AntDesign name={'right'} size={12} style={{ color: '#666666',marginLeft: 5 }}/>
                                </View> : (<View style={{flexDirection: "row", alignItems: "center",paddingTop: 10,paddingBottom: 10}}>
                                    <Text style={{fontSize: 14, color: "#666666"}}>请选择制造商</Text>
                                    <AntDesign name={'right'} size={12} style={{ color: '#666666',marginLeft: 5 }}/>
                                </View>)
                              }
                            
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{paddingLeft: 16,paddingRight: 16}}>
              <TouchableOpacity style={styles.bottomButton} onPress= { () => {this.addDevice()}}>
                  <Text style={{color: "#fff", fontSize: 16}}>提交</Text>
              </TouchableOpacity> 
            </View>
            
          </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6',
     
    },
    item: {
        borderBottomColor: "#F6F6F6",
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    bottomButton: {
      width: '100%', 
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#4058FD",
      borderRadius: 4,
      bottom: 10 
    },
     //picker
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
    publishButton: {
        width: width-32,
        height:44,
        backgroundColor: "#4058FD",
        borderRadius: 5,
        marginTop: 17,
        alignItems: "center",
        justifyContent: "center"
    }
    
});
