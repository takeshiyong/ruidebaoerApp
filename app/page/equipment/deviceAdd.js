import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, Modal,TextInput,Image,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../../components/header';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import deviceService from '../../service/deviceServer';
import Toast from '../../components/toast';
import Picker from 'react-native-wheel-picker';
import { parseDate, parseTime } from '../../utils/handlePhoto'

const { width, height } = Dimensions.get('window');
const PickerItem = Picker.Item;
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        typeData: {
            index: 0,
            fId: '',
            fName: '请选择设备类型'
        },
        levelData: {
            index: 0,
            fId: '',
            fName: '请选择设备级别'
        },
        areaData: {
            index: 0,
            fId: '',
            fName: '请选择设备区域'
        },
        showPicker: false,
        pickerList: [],
        changeData: {},
        diviceName: '',
        diviceNum: '',
        picArr: [],
        deviceLevel: [],
        deviceArea: [],
        deviceType: [],
        itemList: [],
        pickerType: 0, //0: 区域，1.级别 2.类型
    }

    componentDidMount() {
      
      SplashScreen.hide();
        this.getDeviceEquipmentLevelSelectAll();
        this.getDeviceEquipmentAreaSelectAll();
        this.getDeviceType()
    }
    //查询设备级别
    getDeviceEquipmentLevelSelectAll = async () => {
        const res = await deviceService.getDeviceEquipmentLevelSelectAll();
        if(res.success){
            this.setState({
                deviceLevel: res.obj
            })
        }else{
            console.log(res.msg)
        }
    }
    getDeviceEquipmentAreaSelectAll = async () => {
        const res = await deviceService.getDeviceEquipmentAreaSelectAll();
        if(res.success){
            this.setState({
                deviceArea: res.obj
            })
        }else{
            console.log(res.msg)
        }
    }
    getDeviceType = async () => {
        const res = await deviceService.getDeviceType();
        if(res.success){
            this.setState({
                deviceType: res.obj
            })
        }else{
            console.log(res.msg)
        }
    }
    //设备区域
    chooseDeviceArea = () => {
        const {deviceArea} = this.state;
        if(deviceArea.length > 0){
            const selectList = deviceArea.map((data, index)=>{
                return {
                    index: index,
                    fId: data.fId,
                    fName: data.fAreaName
                }
            });
            
            this.setState({
                itemList: selectList,
                pickerList: selectList.map((data)=>(data.fName)),
                changeData: selectList[deviceArea.index],
                showPicker: true,
                pickerType: 0
            });
        } 
    }
    //设备级别
    chooseDeviceLevel = () => {
        const {deviceLevel} = this.state;
        if(deviceLevel.length > 0){
            const selectList = deviceLevel.map((data, index)=>{
                return {
                    index: index,
                    fId: data.fId,
                    fName: data.fLevelName
                }
            });
            
            this.setState({
                itemList: selectList,
                pickerList: selectList.map((data)=>(data.fName)),
                changeData: selectList[deviceLevel.index],
                showPicker: true,
                pickerType: 1
            });
        } 
    }
    //设备类型
    chooseDeviceType = () => {
        const {deviceType} = this.state;
        if(deviceType.length > 0){
            const selectList = deviceType.map((data, index)=>{
                return {
                    index: index,
                    fId: data.fId,
                    fName: data.fTypeName
                }
            });
            console.log(selectList)
            this.setState({
                itemList: selectList,
                pickerList: selectList.map((data)=>(data.fName)),
                changeData: selectList[deviceType.index],
                showPicker: true,
                pickerType: 2
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
                fName: pickerType == 2 ?changeData.fName: typeData.fName,
                fId: pickerType == 2 ?changeData.fId: typeData.fId,
            },
            levelData: {
                index: levelData.index,
                fName: pickerType == 1 ?changeData.fName: levelData.fName,
                fId: pickerType == 1 ?changeData.fId: levelData.fId,
            },
            areaData: {
                index: areaData.index,
                fName: pickerType == 0 ?changeData.fName: areaData.fName,
                fId: pickerType == 0?changeData.fId: areaData.fId,
            }
        })
        
    }

    // picker滚动的时候改值
    onPickerChange = (index) => {
        const { changeData, itemList } = this.state;
        this.setState({
            changeData: itemList[index]
        });
    }

    toNextPage = () => {
        const { diviceName, diviceNum, areaData, levelData, typeData, picArr} = this.state;
        if(diviceName.trim().length == 0){
            Toast.show('设备名称不能为空');
            return;
        }
        if(diviceNum.trim().length == 0){
            Toast.show('设备编号不能为空');
            return;
        }
        if(areaData.fId.length == 0){
            Toast.show('设备区域不能为空');
            return;
        }
        if(levelData.fId.length == 0){
            Toast.show('设备级别不能为空');
            return;
        }
        if(typeData.fId.length == 0){
            Toast.show('设备类型不能为空');
            return;
        }
        if(picArr.length == 0){
            Toast.show('设备图片不能为空');
            return;
        }
        this.props.navigation.navigate('DevideNextAdd',{diviceName, diviceNum, areaData,levelData,typeData,picArr,onRefresh:this.props.navigation.state.params.onRefresh})
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
                    <View style={[styles.item,{height: 47}]}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Image source={require("../../image/deviceAdd/appsBig.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                            <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                <Text style={{color: 'red'}}>*</Text>
                                设备名称
                                </Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <TextInput
                                    style={{height: "100%", borderWidth: 0,color: "#333",textAlign: "right"}}
                                    placeholder="请输入设备名称"
                                    multiline={false}
                                    maxLength={18}
                                    placeholderTextColor= "#999"
                                    value={this.state.diviceName}
                                    onChangeText={(text)=>{
                                        this.setState({
                                            diviceName: text.trim()
                                        });
                                    }}
                                />
                        </View>
                    </View>
                    <View style={[styles.item,{height: 47}]}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Image source={require("../../image/deviceAdd/calendar.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                            <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                <Text style={{color: 'red'}}>*</Text>
                                设备编号
                                </Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <TextInput
                                    style={{height: "100%", borderWidth: 0,color: "#333",textAlign: "right"}}
                                    placeholder="请输入设备编号"
                                    multiline={false}
                                    maxLength={18}
                                    placeholderTextColor= "#999"
                                    value={this.state.diviceNum}
                                    onChangeText={(text)=>{
                                        this.setState({
                                            diviceNum: text.trim()
                                        });
                                    }}
                                />
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.item,{height: 50}]} onPress={() => {this.chooseDeviceArea()}}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/deviceAdd/mapMarker.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    设备区域
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontSize: 14, color: "#666"}}>{this.state.areaData ? this.state.areaData.fName : '请选择设备区域'}</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 5 }}/>
                            </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.item,{height: 50}]} onPress={() => {this.chooseDeviceLevel()}}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/deviceAdd/lever.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    设备级别
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontSize: 14, color: "#666"}}>{this.state.levelData ? this.state.levelData.fName : '请选择设备级别'}</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 5 }}/>
                            </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.item,{height: 50}]} onPress={() => {this.chooseDeviceType()}}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require("../../image/deviceAdd/lever.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    设备类型
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontSize: 14, color: "#666"}}>{this.state.typeData ? this.state.typeData.fName : '请选择设备类型'}</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 5 }}/>
                            </View>
                    </TouchableOpacity>
                    <View>
                        <View style={{flexDirection: "row",alignItems: "center",marginTop: 20,marginBottom: 10}}>
                            <Image source={require("../../image/deviceAdd/filePencil.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                            <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                <Text style={{color: 'red'}}>*</Text>
                                    设备图片
                            </Text>
                        </View>
                       <View style={{flexDirection: "row",marginTop: 5,flexWrap: "wrap"}}>
                            <CameraUpload
                                limit = {1}
                                value={this.state.picArr}
                                onChange={(picArr)=>this.setState({picArr})}
                                imgStyle={{width: width*0.26, height: width*0.26}}
                            />
                        </View>
                    </View>
                    <View style={{paddingBottom: 26}}>
                        <View style={{flexDirection: "row",alignItems: "center",marginTop: 20,marginBottom: 10}}>
                            <Image source={require("../../image/deviceAdd/mapMarker.png")} style={{width: 16, height: 16,marginRight: 4}}/> 
                            <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>设备区域</Text>
                        </View>
                        <Text style={{color: "#666666",fontSize: 14,marginBottom: 16}}>西环广场铺西路100米</Text>
                       <View style={{width: "100%",height: 72,backgroundColor: "#F0F1F6"}}>
                            
                       </View>
                    </View>
                </View>
            </ScrollView>
            <View style={{paddingLeft: 16,paddingRight: 16}}>
              <TouchableOpacity style={styles.bottomButton} onPress={ () => {this.toNextPage()}}>
                  <Text style={{color: "#fff", fontSize: 16}}>下一步</Text>
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
