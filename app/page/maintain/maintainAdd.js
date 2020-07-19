import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image,TextInput,Modal} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-datepicker';
import {ECharts} from 'react-native-echarts-wrapper';
import moment from 'moment';
import Picker from 'react-native-wheel-picker';
import SplashScreen from 'react-native-splash-screen';

import SelectPeople from '../../components/selectPeople';
import Header from '../../components/header';
import CameraUpload from '../../components/ImageAbout/CameraUpload'
import { parseTime,  parseDate} from '../../utils/handlePhoto';
import deviceService from '../../service/deviceServer';
import Toast from 'react-native-root-toast';

const PickerItem = Picker.Item;
const {width, height} = Dimensions.get('window');
class DeviceRecord extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state= {
        date: null,
        date1: null,
        showPicker: false,
        typeData: {
            index: 0,
            fId: '',
            fName: '请选择维修类型'
        },
        selectDep: {},
        changeData: {},
        pickerList: [],
        itemList: [],
        participationArr: [],
        picArr: [],
        contentText: '',
        recordArr: [],
        service: [''],
        infomation: [],
        selectPeople: null,
        MaintenanceType: [],
        showPicker: false,
        showPress : true
    }

    componentDidMount() {
      SplashScreen.hide();
        this.getMaintenanceType()
      if (this.props.navigation.state.params && this.props.navigation.state.params.getDetailId) {
        this.setState({
          id: this.props.navigation.state.params.getDetailId,
          showPress: false
        },()=>{this.getDetailByFid(this.state.id)})
      }
    }
    //根据维修记录id查询维修记录详情
    getDetailByFid = async(id) => {
        const res = await deviceService.getDetailByFid(id);
        if(res.success){
            let service = [];
            for(let item of res.obj.maintenanceItems){
                service.push(item.fCount);
            }
            console.log(service);
            let infomation = [];
            if(res.obj.replaceParts.length > 0){
                for(let item of res.obj.replaceParts){
                    if(item.fPartName != null){
                        infomation.push({
                            fCause: item.fCause?item.fCause: '无',
                            fNumber: item.fNumber,
                            fPartName: item.fPartName
                        });
                    }
                }
            }
            console.log(infomation);
            let picArr = [];
            res.obj.tFileModels ? picArr = res.obj.tFileModels.map((item) => ({
                    path: item.fFileLocationUrl,
                    fileName: item.fFileName,
                    status: "success",
                    type: 1,
                })): null
            this.setState({
                date: parseDate(res.obj.fBeginTime,'YYYY-MM-DD HH:mm'),
                date1:parseDate(res.obj.fEndTime,'YYYY-MM-DD HH:mm'),
                typeData: {fId: res.obj.fMaintenanceTypeId,fName: res.obj.fMaintenanceTypeName},
                selectDep: {fId: res.obj.fDepId, fName: res.obj.fDepName},
                participationArr: res.obj.maintenanceUsers.map((item) => ({
                    'fId': item.fId, 
                    'fUserName': item.fUserName
                })), 
                picArr,
                contentText: res.obj.fCause,
                service: service,
                infomation,
                selectPeople: {fId: res.obj.fAcceptanceUserId, fName: res.obj.fAcceptanceUserName}
            })
        }else{
            console.log(res.msg);
            Toast.show(res.msg);
        }
        console.log(res)
    }
    //获取验收人
    chooseReportPerson = () => {
        this.props.navigation.navigate('selectPeopleByDep',{surePeople: this.getReportPeople})
    }
    // 获取选中验收人员数据
    getReportPeople = (data) => {
        this.setState({
            selectPeople: {fId: data.fId, fName: data.fUserName}
        });
    }
    // 选择部门单位
    chooseReportDept = () => {
        this.props.navigation.navigate('SelectDep',{sureDepId: this.getReportDept})
    }
    // 获取选中上报单位数据
    getReportDept = (dept) => {
        this.setState({
            selectDep: {fId: dept.fId, fName: dept.fName}
            
        });
    }
    //查询全部维修类型信息
    getMaintenanceType = async() => {
        const res= await deviceService.getMaintenanceType();
        if(res.success){
            this.setState({
                MaintenanceType: res.obj
            })
        }else{
            console.log(res.msg)
        }
    }
    //picker确认改值
    onPickerSelect = () => {
        const {typeData, changeData} = this.state;
        this.setState({
            showPicker: false,
            typeData: {
                index: typeData.index,
                fName: changeData.fName?changeData.fName: typeData.fName,
                fId: changeData.fId?changeData.fId: typeData.fId,
            },
        })
        
    }
    // 展开选择维修
    showMaintenanceType = () => {
        const { MaintenanceType,typeData } = this.state;
        if(MaintenanceType.length > 0){
            const selectList = MaintenanceType.map((data, index)=>{
                return {
                    index: index,
                    fId: data.fId,
                    fName: data.fName
                }
            });
            
            this.setState({
                itemList: selectList,
                pickerList: selectList.map((data)=>(data.fName)),
                changeData: selectList[typeData.index],
                showPicker: true,
            });
        } 
        
    }
    // picker滚动的时候改值
    onPickerChange = (index) => {
        const { changeData, itemList } = this.state;
        this.setState({
            changeData: itemList[index]
        });
    }
    //新增维修input输入值
    setContent = (text,indexs) => {
        let service = [...this.state.service]
        for(let index in this.state.service){
            if(index == indexs){
                service[indexs] = text.trim()
                this.setState({
                    service
                })
            }
        }
    }
    //新增维修input输入值
    setInfoContent = (text,indexs) => {
        let infomation = [...this.state.infomation]
        for(let index in this.state.infomation){
            if(index == indexs){
                infomation[indexs] = text.trim()
                this.setState({
                    infomation
                })
            }
        }
    }
    //新增维修新增条目
    addContentItem = () => {
            let service = [...this.state.service]
            service.push('');
            this.setState({
                service
            })
    }
    //新增换件新增条目
    addInfoItem = () => {
        this.props.navigation.push('AddInfoItem',{getValue: this.getValue});
        
    }
    changeInfoItem = (value,index) => {
        this.props.navigation.push('AddInfoItem',{value,getValue: this.getValue,index});
    }
    getValue = (value) => {
        if(value.index == null){
            if(this.state.infomation){
                let infomation = [...this.state.infomation]
                infomation.push(value)
                this.setState({
                    infomation
                })
            }else{
                let infomation = []
                infomation.push(value);
                this.setState({
                    infomation
                })
            }
        }else{
            let infomation = [...this.state.infomation];
            infomation[value.index] = {
                fCause: value.fCause,
                fNumber: value.fNumber,
                fPartName: value.fPartName,
            }
            this.setState({
                infomation
            })
        }
        
    }
    //新增维修删除条目
    delectContentItem = (index) => {
        let service = [...this.state.service]
        let  item = service.splice(index, 1);
        this.setState({
            service
        })
    }
    //新增换件删除条目
    delectInfotItem = (index) => {
        let infomation = [...this.state.infomation]
        let  item = infomation.splice(index, 1);
        this.setState({
            infomation
        })
    }
    //新增设备维修
    addInsertRecord = async() => {
        const { date, date1, typeData, selectDep, participationArr, picArr,selectPeople, contentText,service,infomation} = this.state;
        if(selectDep == null){
            Toast.show('维修部门不能为空');
            return
        }else if(selectDep&&selectDep.fId == null){
            Toast.show('维修部门不能为空');
            return
        }
        if(date == null){
            Toast.show('开始时间不能为空');
            return
        }
        if(date1 == null){
            Toast.show('结束时间不能为空');
            return
        }
        if(typeData&&typeData.fId == null){
            Toast.show('维修级别不能为空');
            return
        }
        
        if(participationArr.length == 0){
            Toast.show('维修人不能为空');
            return
        }
        
        if(new Date(date.replace(/-/g, '/')).getTime() < new Date(moment().format('YYYY/MM/DD')).getTime()){
            Toast.show('开始时间不能小于当前时间，请核对');
            return;
        }
        if(new Date(date.replace(/-/g, '/')).getTime() > new Date(date1.replace(/-/g, '/')).getTime()){
            Toast.show('开始时间不能大于结束时间，请核对');
            return;
        }
        if(picArr.length == 0){
            Toast.show('维修图片不能为空');
            return
        }
        
        if(contentText.trim().length == 0){
            Toast.show('维修原因不能为空');
            return
        }
        
        if(selectPeople && selectPeople.fId == null){
            Toast.show('验收人不能为空');
            return
        }
        let maintenanceItems = []
        for(let item of service){
            if(item.trim() != ''){
                maintenanceItems.push({fCount:item});
            }
        }
        
        if(maintenanceItems.length == 0){
            Toast.show('维修内容不能为空');
            return
        }
        
        let fUserIds = []
        participationArr.map((item) => {
            fUserIds.push(item.fId)
        })
        let finishFile = [];
        for (let obj of picArr) {
            if (obj.status == 'success') {
                finishFile.push({
                    // fCoursewareTitle: "string",
                    fFileLocationUrl: obj.path,
                    fFileName: obj.fileName,
                    fType: 1
                  })
                
            } else if (obj.status == 'uploading') {
                Toast.show('图片上传中，请稍后');
                return;
            }
        }
        
        const res = await deviceService.addInsertRecord({
            fBeginTime: new Date(date.replace(/-/g, '/')).getTime(),
            fEndTime: new Date(date1.replace(/-/g, '/')).getTime(),
            fDepId: selectDep.fId,
            fMaintenanceTypeId: typeData.fId,
            fUserIds: fUserIds,
            fileModels: finishFile,
            fCause: contentText,
            maintenanceItems,
            replaceParts: infomation&&infomation.length !== 0?infomation: [],
            fAcceptanceUserId: selectPeople.fId,
            fEquipmentbId: this.props.navigation.state.params.fId
        });
        if(res.success){
            this.props.navigation.state.params.initData();
            this.props.navigation.pop();
            Toast.show(res.msg)
        }else{
            Toast.show(res.msg)
            console.log(res.msg)
        }
    }
    render() {
        
         return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText={this.state.showPress? '维修记录新增': '维修记录详情'}
                    props={this.props}
                    // hidePlus= {this.state.type == 1? true: false}
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
                {
                    this.state.showPress ? 
                        <ScrollView style={styles.content}>
                            <View style={{paddingLeft: 16,paddingRight: 16,backgroundColor: "#fff",marginBottom: 30}}>
                                <View style={[styles.itemStyle]}>
                                    <View style={{flexDirection: "row"}}>
                                        <Image source={require('../../image/workStatus/start.png')} style={{marginRight: 3}}/>
                                        <Text style={{color: 'red'}}>*</Text>
                                    </View>
                                <View style={styles.contentView}>
                                    <Text style={styles.leftText}>开始日期</Text>
                                    
                                    <DatePicker
                                        style={{width: 180}}
                                        date={this.state.date}
                                        mode="datetime"
                                        placeholder="请选择开始时间"
                                        format="YYYY-MM-DD HH:mm"
                                        minDate={moment(new Date()).format('YYYY-MM-DD HH:mm')}
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
                                                color: '#666'
                                            },
                                            placeholderText: {
                                                color: '#666'
                                            }
                                        }}
                                        iconComponent={<AntDesign name="right" size={12} style={{ color: '#666',marginLeft: 10 }}/>}
                                        onDateChange={(date) => {this.setState({date: date})}}
                                    />
                                </View>
                                </View> 
                                <View style={styles.itemStyle}>
                                    <View style={{flexDirection: "row"}}>
                                        <Image source={require('../../image/workStatus/stop.png')} style={{marginRight: 3}}/>
                                        <Text style={{color: 'red'}}>*</Text>
                                    </View>
                                <View style={styles.contentView}>
                                    <Text style={styles.leftText}>结束日期</Text>
                                    <DatePicker
                                        style={{width: 190}}
                                        date={this.state.date1}
                                        mode="datetime"
                                        placeholder="请选择结束时间"
                                        format="YYYY-MM-DD HH:mm"
                                        minDate={this.state.date? moment(parseTime(this.state.date)+60000).format('YYYY-MM-DD HH:mm'): moment().format('YYYY-MM-DD HH:mm')}
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
                                                color: '#666'
                                            },
                                            placeholderText: {
                                                color: '#666'
                                            }
                                        }}
                                        iconComponent={<AntDesign name="right" size={12} style={{ color: '#666',marginLeft: 10 }}/>}
                                        onDateChange={(date) => {this.setState({date1: date})}}
                                    />
                                </View>
                                </View>
                                <TouchableOpacity style={[styles.itemStyle, {paddingBottom: 5}]} onPress ={() => {this.showMaintenanceType()}}>
                                    <View style={{flexDirection: "row"}}>
                                        <Image source={require('../../image/troubleDetails/leavel.png')} style={{marginRight: 3}}/>
                                        <Text style={{color: 'red'}}>*</Text>
                                    </View>
                                <View style={[styles.contentView]}>
                                    <Text style={styles.leftText}>维修类型</Text>
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <Text style={{color: "#666666",marginRight: 2,paddingRight: 10}}>{this.state.typeData&&this.state.typeData.fName?this.state.typeData.fName:'请选择维修类型'}</Text>
                                        <AntDesign name="right" color="#666666"/>
                                    </View>
                                </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.itemStyle, {paddingBottom: 5}]} onPress={this.chooseReportDept}>
                                    <View style={{flexDirection: "row"}}>
                                        <Image source={require('../../image/workStatus/user.png')} style={{marginRight: 3}}/>
                                        <Text style={{color: 'red'}}>*</Text>
                                    </View>
                                
                                <View style={[styles.contentView]}>
                                    <Text style={styles.leftText}>维修部门</Text>
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <Text style={{color: "#666666",marginRight: 2,paddingRight: 10}}>{this.state.selectDep.fName ? this.state.selectDep.fName : '请选择维修部门'}</Text>
                                        <AntDesign name="right" color="#666666"/>
                                    </View>
                                </View>
                                </TouchableOpacity>
                                <View style={{marginTop: 10,borderBottomColor: "#E0E0E0",borderBottomWidth: 1,}}>
                                    <SelectPeople title="维修人"  showPeople={true} required={true} value={this.state.participationArr} onChange={(arr)=>this.setState({participationArr: arr})}/>
                                </View>
                                <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,}}>
                                    <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                        <Image source={require("../../image/workStatus/filePencil.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                        <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                            <Text style={{color: 'red'}}>*</Text>
                                                维修原因
                                            </Text>
                                        </View>
                                    <TextInput
                                        style={{height: 70,textAlignVertical: "top"}}
                                        onChangeText={(text) => this.setState({contentText: text.trim()})}
                                        placeholder="请输入维修原因"
                                        multiline={true}
                                        value={this.state.contentText}
                                        />
                                    <View style={{flexDirection: "row",marginTop: 5,flexWrap: "wrap"}}>
                                            <CameraUpload
                                                value={this.state.picArr}
                                                onChange={(picArr)=>this.setState({picArr},() => {console.log('bbbbbbbbbbbbbbbbb',this.state.picArr)})}
                                                imgStyle={{width: width*0.26, height: width*0.26}}
                                            />
                                        </View>
                                </View>
                                <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,paddingBottom: 10}}>
                                    <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                        <Image source={require("../../image/workStatus/appsSelect.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                        <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                            <Text style={{color: 'red'}}>*</Text>
                                                维修内容
                                        </Text>
                                    </View>
                                        {
                                            this.state.service.map((item,index) => {
                                                return (<View style={styles.conTextInput}>
                                                    <Text style={{color: "#333",marginTop: 10}}>{index+1}:</Text>
                                                    {
                                                        index == 0? null: 
                                                        <TouchableOpacity style={{position: "absolute",top: 5, right: -5,width: 20,height: 20}} onPress ={() => {this.delectContentItem(index)}}>
                                                            <Image source={require('../../image/workStatus/delect.png')} style={{width: 20,height: 20}}/>
                                                        </TouchableOpacity>
                                                    }
                                                    
                                                    <TextInput
                                                        style={{height: 80,textAlignVertical: "top",flex: 1,color: "#333"}}
                                                        onChangeText={(text) => this.setContent(text,index)}
                                                        placeholder="请输入新增维修条目"
                                                        multiline={true}
                                                        value={item}
                                                        />
                                                </View>)
                                            })
                                        }
                                    <TouchableOpacity style={styles.addButton} onPress ={() => {this.addContentItem()}}>
                                        <Text style={{color: "#4058FD",fontSize: 14}}>新增维修内容</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,paddingBottom: 10}}>
                                    <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                        <Image source={require("../../image/workStatus/Select.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                        <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                            {/* <Text style={{color: 'red'}}>*</Text> */}
                                                换件信息
                                        </Text>
                                    </View>
                                        {
                                            this.state.infomation&&this.state.infomation.length !==0 ?this.state.infomation.map((item,index) => {
                                                return (<View style={styles.conTextInput}>
                                                    <TouchableOpacity style={{position: "absolute",top: 5, right: -5,width: 20,height: 20}} onPress ={() => {this.delectInfotItem(index)}}>
                                                        <Image source={require('../../image/workStatus/delect.png')} style={{width: 20,height: 20}}/>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{paddingTop: 5,flex: 1}} onPress= {() => {this.changeInfoItem(item,index)}}>
                                                        <View style={[styles.infoItem,{flexDirection: "row"}]}>
                                                            <Text style={styles.infoItemLeft}>零件名称:</Text>
                                                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.infoItemRight,{marginLeft:0}]}>{item.fPartName}</Text>
                                                        </View>
                                                        <View style={[styles.infoItem,{flexDirection: "row"}]}>
                                                            <Text style={styles.infoItemLeft}>更换数量:</Text>
                                                            <Text  style={styles.infoItemNumRight}>{item.fNumber}</Text>
                                                        </View>
                                                        <View style={styles.infoItem}>
                                                            <Text style={styles.infoItemLeft}>更换原因:</Text>
                                                            <Text numberOfLines={3} ellipsizeMode={'tail'} style={styles.infoItemRight}>{item.fCause?item.fCause: "无"}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    
                                                </View>)
                                            }): null
                                        }
                                    <TouchableOpacity style={styles.addButton} onPress ={() => {this.addInfoItem()}}>
                                        <Text style={{color: "#4058FD",fontSize: 14}}>新增换件内容</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                <TouchableOpacity style={[styles.item,{height: 50}]} onPress={this.chooseReportPerson}>
                                    <View style={{flexDirection: "row",alignItems: "center"}}>
                                        <View style={{flexDirection: "row"}}>
                                            <Image source={require('../../image/troubleQuery/user.png')} style={{marginRight: 3}}/>
                                            <Text style={{color: 'red'}}>*</Text>
                                        </View>
                                        <Text style={{color: "#333333", fontSize: 14}}>验收人</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <Text style={{fontSize: 14, color: "#999999"}}>{this.state.selectPeople ? this.state.selectPeople.fName : '请选择验收人'}</Text>
                                        {
                                            this.state.selectPeople ? 
                                            <TouchableOpacity onPress={()=>this.setState({ selectPeople: null })}>
                                                <AntDesign name="closecircleo" size={12} style={{ color: '#C1C1C1',marginLeft: 10 }} />
                                            </TouchableOpacity>
                                            :
                                            <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{width: width,paddingLeft: 16,paddingRight: 16}}>
                                <TouchableOpacity style={styles.bottom} onPress={() => {this.addInsertRecord()}}>
                                    <Text style={{color: "#fff", fontSize: 16}}>保存</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView> : null
                }
                {
                    !this.state.showPress ? 
                        <ScrollView style={styles.content}>
                            <View style={{paddingLeft: 16,paddingRight: 16,backgroundColor: "#fff",marginBottom: 30}}>
                                <View style={[styles.itemStyle]}>
                                    <View style={{flexDirection: "row"}}>
                                        <Image source={require('../../image/workStatus/start.png')} style={{marginRight: 3}}/>
                                    </View>
                                <View style={styles.contentView}>
                                    <Text style={styles.leftText}>开始日期</Text>
                                    <Text>{this.state.date}</Text>
                                </View>
                                </View> 
                                <View style={styles.itemStyle}>
                                    <View style={{flexDirection: "row"}}>
                                        <Image source={require('../../image/workStatus/stop.png')} style={{marginRight: 3}}/>
                                    </View>
                                <View style={styles.contentView}>
                                    <Text style={styles.leftText}>结束日期</Text>
                                    <Text>{this.state.date1}</Text>
                                </View>
                                </View>
                                <View style={[styles.itemStyle, {paddingBottom: 5}]} >
                                    <View style={{flexDirection: "row"}}>
                                        <Image source={require('../../image/troubleDetails/leavel.png')} style={{marginRight: 3}}/>
                                    </View>
                                <View style={[styles.contentView]}>
                                    <Text style={styles.leftText}>维修级别</Text>
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <Text style={{color: "#666666",marginRight: 2,paddingRight: 10}}>{this.state.typeData&&this.state.typeData.fName?this.state.typeData.fName:'请选择维修级别'}</Text>
                                    </View>
                                </View>
                                </View>
                                <View style={[styles.itemStyle, {paddingBottom: 5}]} onPress={this.chooseReportDept}>
                                    <View style={{flexDirection: "row"}}>
                                        <Image source={require('../../image/workStatus/user.png')} style={{marginRight: 3}}/>
                                    </View>
                                
                                <View style={[styles.contentView]}>
                                    <Text style={styles.leftText}>维修部门</Text>
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <Text style={{color: "#666666",marginRight: 2,paddingRight: 10}}>{this.state.selectDep.fName ? this.state.selectDep.fName : '请选择维修部门'}</Text>
                                    </View>
                                </View>
                                </View>
                                <View style={{marginTop: 10,borderBottomColor: "#E0E0E0",borderBottomWidth: 1,}}>
                                    <SelectPeople title="维修人" disabled={true} showPeople={true} required={true} value={this.state.participationArr} onChange={(arr)=>this.setState({participationArr: arr})}/>
                                </View>
                                <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,}}>
                                    <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                        <Image source={require("../../image/workStatus/filePencil.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                        <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                                维修原因
                                            </Text>
                                        </View>
                                        <Text style={{marginTop: 5,marginBottom: 5,color: "#333"}}>{this.state.contentText}</Text>
                                    <View style={{flexDirection: "row",marginTop: 5,flexWrap: "wrap"}}>
                                            <CameraUpload
                                                disabled={true}
                                                value={this.state.picArr}
                                                onChange={(picArr)=>this.setState({picArr})}
                                                imgStyle={{width: width*0.26, height: width*0.26}}
                                            />
                                        </View>
                                </View>
                                <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,paddingBottom: 10}}>
                                    <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                        <Image source={require("../../image/workStatus/appsSelect.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                        <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                                维修内容
                                        </Text>
                                    </View>
                                        {
                                            this.state.service.map((item,index) => {
                                                return (<View style={styles.conTextInput}>
                                                    <Text style={{color: "#333",marginTop: 5}}>{index+1}:</Text>
                                                    {/* {
                                                        index == 0? null: 
                                                        <TouchableOpacity style={{position: "absolute",top: 5, right: -5,width: 20,height: 20}} onPress ={() => {this.delectContentItem(index)}}>
                                                            <Image source={require('../../image/workStatus/delect.png')} style={{width: 20,height: 20}}/>
                                                        </TouchableOpacity>
                                                    } */}
                                                    <Text style={{paddingTop: 5,paddingBottom: 5,textAlignVertical: "top",flex: 1,color: "#333"}}>{item}</Text>
                                                </View>)
                                            })
                                        }
                                </View>
                                <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,paddingBottom: 10}}>
                                    <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                        <Image source={require("../../image/workStatus/Select.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                        <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                                换件信息
                                        </Text>
                                    </View>
                                        {
                                            this.state.infomation&&this.state.infomation.length !==0 ?this.state.infomation.map((item,index) => {
                                                return (<View style={styles.conTextInput}>
                                                    <View style={{paddingTop: 5,flex: 1}}>
                                                        <View style={[styles.infoItem,{flexDirection: "row"}]}>
                                                            <Text style={styles.infoItemLeft}>零件名称:</Text>
                                                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.infoItemRight,{marginLeft:0}]}>{item.fPartName}</Text>
                                                        </View>
                                                        <View style={[styles.infoItem,{flexDirection: "row"}]}>
                                                            <Text style={styles.infoItemLeft}>更换数量:</Text>
                                                            <Text  style={{color: "#333"}}>{item.fNumber}</Text>
                                                        </View>
                                                        <View style={styles.infoItem}>
                                                            <Text style={styles.infoItemLeft}>更换原因:</Text>
                                                            <Text numberOfLines={3} ellipsizeMode={'tail'} style={styles.infoItemRight}>{item.fCause?item.fCause: "无"}</Text>
                                                        </View>
                                                    </View>
                                                    
                                                </View>)
                                            }): <Text style={{marginTop: 5,marginBottom: 5,marginLeft: 10}}>无换件</Text>
                                        }
                                   
                                </View>
                                
                                <View style={[styles.item,{height: 50}]} onPress={this.chooseReportPerson}>
                                    <View style={{flexDirection: "row",alignItems: "center"}}>
                                        <View style={{flexDirection: "row"}}>
                                            <Image source={require('../../image/troubleQuery/user.png')} style={{marginRight: 3}}/>
                                        </View>
                                        <Text style={{color: "#333333", fontSize: 14}}>验收人</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <Text style={{fontSize: 14, color: "#999999"}}>{this.state.selectPeople ? this.state.selectPeople.fName : '不限'}</Text>
                                        {
                                            this.state.selectPeople ? 
                                            <TouchableOpacity onPress={()=>this.setState({ selectPeople: null })}>
                                            </TouchableOpacity>
                                            : null
                                        }
                                    </View>
                                </View>
                            </View>
                        </ScrollView> : null
                }
            </View>
        );
    }
}


export default DeviceRecord;

const styles = StyleSheet.create({
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 50,
    },
    contentView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        
    },
    
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    content: {
        backgroundColor: '#F4F4F4',
        
    },
    leftText: {
        color:'#333333',
        fontWeight: "600"
    },
    bottom: {
        width: '100%',
         bottom: 10, 
         height: 44,
         alignItems: "center",
         justifyContent: "center",
         backgroundColor: "#4058FD", 
         borderRadius: 5
    },
    conTextInput: {
        width: "100%",
        // height: 80,
        position: "relative",
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#F6F6F6",
        borderRadius: 5,
        paddingLeft: 5,
        paddingRight:20,
        marginTop: 5,
        marginBottom: 5
    },
    addButton: {
        width: "100%",
        height: 44,
        backgroundColor: "#F6F6F6",
        borderRadius: 4,
        marginTop: 10,
        alignItems: "center",
        justifyContent:"center"
    },
    item: {
        borderBottomColor: "#F6F6F6",
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between"
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
    },
    infoItem: {
        
        marginBottom: 4
    },
    infoItemLeft: {
        color: "#333",
        fontSize: 14,
        fontWeight: "500",
        marginRight: 5
    },
    infoItemRight: {
        lineHeight: 18,
        color: "#333",
        marginLeft: 15
    }
    
});
