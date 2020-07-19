import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, TextInput,Image,Modal,Switch} from 'react-native';
import TipModal from '../../components/tipModal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../../components/header';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import SelectPeople from '../../components/selectPeople';
import Picker from 'react-native-wheel-picker';
import { parseTime, parseDate } from '../../utils/handlePhoto';
import Toast from '../../components/toast';
import maintainServer from '../../service/deviceServer';

const PickerItem = Picker.Item;
const { width, height } = Dimensions.get('window');

export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        showModal: false,
        name: "asasa",
        workText: '',
        index: null,
        date: null,
        fSpaceDay: null,
        fWeekDay: null,
        dayNum: null, 
        weekNum: null, 
        week: null,
        weekList: [0,1,2,3,4,5,6],
        current: 0,
        monthNum: null, 
        monthTime: null, 
        yearNum: null, 
        yearTime: null,
        showPicker: false,
        participationArr: [],
        changeData: {},
        pickerList: [],
        itemList: [],
        pickerNum: true,
        typeData: {
            index: 0,
            fId: null,
            fName: '请选择保养级别'
            },
        isFront: false,
        deviceList: [],
        ItemIdList: 0,
    }

    componentDidMount() {
        
    }
    
    //picker确认改值
    onPickerSelect = () => {
        const {typeData, changeData} = this.state;
        console.log(changeData);
        if(this.state.deviceList.length > 0){
            this.setState({
                 deviceList: []
            })
        }
        this.setState({
            showPicker: false,
            typeData: {
                index: changeData.index,
                fName: changeData.fName?changeData.fName: typeData.fName,
                fId: changeData.fId != null?changeData.fId: typeData.fId,
            },
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
    // 展开选择保养类型
    showTypeDataList = () => {
        let typeDataList = [{fId: 0,fName: "日"},{fId: 1,fName: "周"},{fId: 2,fName: "月"},{fId: 3,fName: "年"}]
        const { typeData } = this.state;
        if(typeDataList.length > 0){
            const selectList = typeDataList.map((data, index)=>{
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
                showDouble: false
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
    //设备新建
    addDevice = async() => {
        const { deviceList,isFront, date,workText,fNextTime,participationArr, typeData, dayNum, weekNum, monthNum, monthTime, yearNum, yearTime} = this.state;
        console.log(typeData)
        let fSpaceDay = null;
        let fWeekDay = null;
        if(date == null) {
            Toast.show('请选择开始时间');
            return;
        }
        if(new Date(date.replace(/-/g, '/')).getTime() < new Date(moment().format('YYYY/MM/DD')).getTime()){
            Toast.show('开始时间不能小于当前时间，请核对');
            return;
        }
        if(typeData.fId === null){
            Toast.show('保养级别不能为空');
            return;
        }
        if(isFront){
            if(typeData.fId == 0){
                if(dayNum != null&&dayNum != ''){
                    if(isNaN(dayNum*1)){
                        Toast.show('重复日只能为数字类型');
                        return;
                    }else{
                           fSpaceDay = (dayNum+'');
                           fWeekDay = null
                    }
                }else{
                    Toast.show('请填写重复日期,或者关闭重复按钮');
                    return;
                }
            }
            if(typeData.fId == 1){
                if(weekNum != null&&weekNum != ''){
                    if(isNaN(weekNum*1)){
                        Toast.show('重复周数量只能为数字类型');
                        return;
                    }else{
                       
                         fSpaceDay = (weekNum*7+'');
                         fWeekDay = (this.state.current+'')
                       
                    }
                }else{
                    Toast.show('请填写重复日期,或者关闭重复按钮');
                    return;
                }
            }
            if(typeData.fId == 2){
                if(monthNum != null&&monthTime != null){
                    if(isNaN(monthNum*1) || isNaN(monthTime*1)){
                        Toast.show('重复月数量或者重复月次数只能为数字类型');
                        return;
                    }else if(monthTime>(monthNum*31)){
                        Toast.show('重复月次数超过了总共月的天数');
                        return;
                    }else{
                        
                       fSpaceDay = (((monthNum*30)/monthTime).toFixed(0)+'');
                       fWeekDay =  null
                       
                    }
                }else{
                    Toast.show('请填写重复日期,或者关闭重复按钮');
                    return;
                }
            }
            if(typeData.fId == 3){
                if(yearNum != null&&yearTime != null){
                    if(isNaN(yearNum*1) || isNaN(yearTime*1)){
                        Toast.show('重复年数量或者重复年次数只能为数字类型');
                        return;
                    }else if(yearTime>(yearNum*365)){
                        Toast.show('重复年次数超过了总共年的天数');
                        return;
                    }else{
                           fSpaceDay = (((yearNum*365)/yearTime).toFixed(0)+'');
                           fWeekDay =  null
                    }
                }else{
                    Toast.show('请填写重复日期,或者关闭重复按钮');
                    return;
                }
            }
        }
        if(workText == ''){
            Toast.show('请选择任务标题');
            return;
        }
        
        if(participationArr.length == 0){
            Toast.show('保养人不能为空');
            return;
        }
        let people = [];
        for(let item of participationArr){
            people.push(item.fId)
        }
        let maintainPlanEquipmentReqList = [];
        for(let item of deviceList){
            let fMaintenancePlanItemIdList = []
            item.fMaintenancePlanItemIdList.map((item) => {
                if(item.select){
                    fMaintenancePlanItemIdList.push(item.fMaintainItemsId) 
                }
            })
            maintainPlanEquipmentReqList.push({
                fEquipmentId: item.fId,
                fMaintenancePlanItemIdList 
            })
        }
        global.loading.show();
        const res = await maintainServer.insertAdd({
            "fIsMaintainRule": this.state.isFront,
            "fMaintainLevel": typeData.fId,
            "fMaintainPlanTitle": workText,
            "fMaintainTaskDate": parseTime(date),
            "fSpaceDay": fSpaceDay,
            'fWeekDay': fWeekDay == null ? null: (fWeekDay == 0 ?  7 : fWeekDay),
            "maintainPlanEquipmentReqList": maintainPlanEquipmentReqList,
            "maintainPlanUserList": people
        })
        global.loading.hide();
        if(res.success){
            Toast.show(res.msg)
            this.props.navigation.state.params.initData()
            this.props.navigation.pop();
        }else{
            Toast.show(res.msg)
            console.log(res.msg);
        }
        
        
    }
    //获取设备信息
    getDevice = () => {
        if(this.state.typeData.fId == null){
            Toast.show("请先选择保养级别")
            return;
        }else{
            this.props.navigation.push('DevicesChoose',{getValue: this.getValue});
        }
    }
    //获取保养项
    getValue = async(value) => {
        console.log(value)
        let deviceList = [...this.state.deviceList];
        for(let item of deviceList){
            if(item.fId == value.fId){
                Toast.show('请不要选择同一设备');
                return
            }
        }
        const res = await maintainServer.selectAllByEquipmentId(value.fId,this.state.typeData.fId);
        if(res.success){
            let fMaintenancePlanItemIdList = [...res.obj];
            for(let item of fMaintenancePlanItemIdList){
                item.select = true
            }
            let ItemIdList = fMaintenancePlanItemIdList.length;
            deviceList.push({
                fId: value.fId,
                fEquipmentName: value.fEquipmentName,
                fMaintenancePlanItemIdList,
                ItemIdList
            })
            
            this.setState({
                deviceList,
                
            },() => {console.log(this.state.deviceList)})
        }
    }
    
    
    delectContent = () => {
        let deviceList = [...this.state.deviceList];
        let item = deviceList.splice(this.state.index,1)
        this.setState({
            deviceList,
            showModal: false
        })
    }
    getCarshopItem = (index,fMaintenancePlanItemIdList) => {
        this.setState({
            currentIndex: index
        },()=>{this.props.navigation.push('CarshopsItems',{getCarshopItems: this.getCarshopItems,fMaintenancePlanItemIdList});})
    }
    getCarshopItems = (value) => {
        let num = 0;
        for(let item of value){
            if(item.select){
                num += 1;
            }
        }
        let deviceList = [...this.state.deviceList];
        for(let index in deviceList){
            if(index == this.state.currentIndex){
                let fMaintenancePlanItemIdList = [...value];
                deviceList[index].fMaintenancePlanItemIdList = fMaintenancePlanItemIdList;
                deviceList[index].num = num;
            }
        }
        this.setState({
            deviceList
        })
    }
    changeSwitch = (value) => {
        if(this.state.typeData.fId == null){
            Toast.show("请先选择保养级别")
            return;
        }else{
            this.setState({isFront: value})
        }
        
    }
    getCurrentWeek = (week) => {
        switch(week){
            case 0:
                return "日";
            case 1:
                return '一';
            case 2:
                return '二';
            case 3: 
                return '三';
            case 4:
                return '四';
            case 5:
                return '五';
            case 6:
                return '六';
            default:
                return null
        }
    }
    render() {
      const { typeList } = this.state;
        return (
          <View style={styles.container}>
            <Header 
              titleText="设备保养添加"
              backBtn={true}
              hidePlus={true}
            />
            <TipModal 
                showModal={this.state.showModal}
                onCancel={()=>{this.setState({showModal: false})}}
                onOk={this.delectContent}
                tipText={`您确定删除${this.state.name}吗？`}
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
                                        style={{ flex: 1, height: 180 }}
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
                <View style={{paddingLeft: 16,paddingRight: 16,marginTop: 12,backgroundColor: '#FFF'}}>
                    <View style={[styles.item,{height: 47}]}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Image source={require("../../image/deviceAdd/appsBig.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                            <Text style={{color: "#333", fontSize: 14,fontWeight: 'bold'}}>
                                <Text style={{color: 'red'}}>*</Text>
                                任务标题
                                </Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <TextInput
                                    style={{height: "100%", borderWidth: 0,color: "#666",textAlign: "right",paddingRight: 23}}
                                    placeholder="请输入任务标题"
                                    multiline={false}
                                    maxLength={18}
                                    placeholderTextColor= "#666"
                                    value={this.state.workText}
                                    onChangeText={(text)=>{
                                        this.setState({
                                            workText: text.trim()
                                        });
                                    }}
                                />
                            
                        </View>
                    </View>
                    <View style={styles.item}>
                          <Image source={require('../../image/workStatus/start.png')} style={{marginRight: 4}}/>
                          <View style={styles.contentView}>
                              <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                <Text style={{color: 'red'}}>*</Text>
                                  开始日期
                                </Text>
                              <DatePicker
                                  style={{width: 160}}
                                  date={this.state.date}
                                  mode="date"
                                  placeholder="请选择开始日期"
                                  format="YYYY-MM-DD"
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
                                  iconComponent={<AntDesign name="right" color="#666" style={{marginLeft: 10}}/>}
                                  onDateChange={(date) => {this.setState({date: date})}}
                              />
                          </View>
                    </View> 
                    <TouchableOpacity style={[styles.item, {paddingBottom: 5}]} onPress ={() => {this.showTypeDataList()}}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Image source={require('../../image/troubleDetails/leavel.png')} style={{width: 16,height: 16,marginRight: 4}}/>
                            <Text style={{color: 'red'}}>*</Text>
                        </View>
                        <View style={[styles.contentView]}>
                            <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>保养级别</Text>
                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                <Text style={{color: "#666666",marginRight: 2,paddingRight: 10}}>{this.state.typeData&&this.state.typeData.fName?this.state.typeData.fName:'请选择维修级别'}</Text>
                                <AntDesign name="right" color="#666666"/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.anotherItem}>
                        <View style={styles.addDevicesItem}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require('../../image/carshops/register.png')} style={{marginRight: 5,marginLeft: 2}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                <Text style={{color: 'red'}}>*</Text>
                                保养设备
                                </Text>
                            </View>
                            <Text>台</Text>
                        </View>
                        <View>
                            {
                            this.state.deviceList.length !== 0 ? 
                            this.state.deviceList.map((item,index) => {
                            console.log(item);
                                return(<View style={styles.addItem}>    
                                    <View style={{flexDirection: "row",alignItems: "center",flex: 1}}>
                                        <Text style={{fontSize: 14,color: "#333",fontWeight: "500"}}>{item.fEquipmentName}</Text>
                                        <TouchableOpacity onPress={() => {this.getCarshopItem(index,item.fMaintenancePlanItemIdList)}}>
                                            <Text style={{fontSize: 14,color: "#4058FD",marginLeft: 13}}>{item.num? item.num: item.ItemIdList }/{item.ItemIdList}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={{position: "absolute",top: 15, right: 0,width: 20,height: 20}} onPress ={() => {this.setState({showModal: true,index:index,name: item.fEquipmentName})}}>
                                        <Image source={require('../../image/workStatus/delect.png')} style={{width: 20,height: 20}}/>
                                    </TouchableOpacity>
                                </View>)
                            })
                            : null }
                        </View>
                        <TouchableOpacity style={styles.addDevices} onPress={() => {this.getDevice()}}>
                            <AntDesign name="plus" color="#4058FD" style={{marginRight: 8}}/>
                            <Text style={{color: "#4058FD",fontSize: 14}}>添加设备</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{marginTop: 10,borderBottomColor: "#E0E0E0",borderBottomWidth: 1,paddingLeft: 1}}>
                        <SelectPeople title="保养人"  showPeople={true} required={true} value={this.state.participationArr} onChange={(arr)=>this.setState({participationArr: arr})}/>
                    </View>
                </View>
                <View style={{paddingLeft: 16,paddingRight: 16,marginTop: 12,backgroundColor: '#FFF'}}>
                    
                    <View style={[styles.item,{height: 47}]}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Image source={require("../../image/carshops/sync.png")} style={{width: 14,height: 14,marginRight: 5,marginLeft: 2}}/>
                            <Text style={{color: "#333333", fontSize: 14,fontWeight: "600",marginLeft: 5}}>重复规则</Text>
                        </View>
                        <Switch
                            style={{width: 30,marginRight: 5}}
                            //动态改变value
                            value={this.state.isFront}
                            //当切换开关室回调此方法
                            onValueChange={(value)=>{this.changeSwitch(value)}}
                            thumbColor = "#5970FE"
                        />
                    </View>
                    {
                        this.state.isFront ? 
                    
                    <View style={[styles.anotherItem, {paddingBottom: 5}]}>
                        <View style={{alignItems: "center",flexDirection: "row"}}>
                            <Image source={require('../../image/carshops/pin.png')} style={{width: 16,height: 16,marginRight: 3,marginLeft: 2}}/>
                            <View style={[styles.contentView]}>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                    重复频率
                                    </Text>
                            </View>
                        </View>
                        
                        {
                            this.state.typeData.fId != null&& this.state.typeData.fId == 0 ? 
                                <View style={{flexDirection: "row",paddingLeft: 10,alignItems: "center"}}>
                                    <Text style={styles.buttonText}>每</Text>
                                    <View style={{borderWidth: 1,borderColor: "#E0E0E0",height: 30}}>
                                        <TextInput
                                            style={{color: "#666666",textAlign: 'right',paddingBottom: 4}}
                                            maxLength={4}
                                            value={this.state.dayNum}
                                            onChangeText={(text)=>{
                                                this.setState({
                                                    dayNum: text.trim()
                                                });
                                            }}
                                        />
                                    </View>
                                    <Text style={styles.buttonText}>日一次</Text>
                                </View>
                            :null
                        }
                        {
                            this.state.typeData.fId != null&& this.state.typeData.fId == 1 ? 
                                <View style={{flexDirection: "row",alignItems: "center",justifyContent: "space-between"}}>
                                    <View style={{flexDirection: "row",paddingLeft: 10,alignItems: "center"}}>
                                        <Text style={styles.buttonText}>每</Text>
                                        <View style={{borderWidth: 1,borderColor: "#E0E0E0",height: 30}}>
                                            <TextInput
                                                style={{color: "#666666",textAlign: 'right',paddingBottom: 4}}
                                                maxLength={4}
                                                value={this.state.weekNum}
                                                onChangeText={(text)=>{
                                                    this.setState({
                                                        weekNum: text.trim()
                                                    });
                                                }}
                                            />
                                        </View>  
                                        <Text style={styles.buttonText}>周一次</Text>
                                    </View>
                                    <View style={{flexDirection: "row"}}>
                                        {
                                            this.state.weekList.map((item,index) => {
                                                return (<TouchableOpacity style={[styles.weekBotton,{borderRightWidth: index == this.state.weekList.length -1? 1: 0,backgroundColor: this.state.current == index ? "#4B74FF": '#fff'}]} onPress={() => {this.setState({current: index})}}>
                                                    <Text style={{fontSize: 16,color: this.state.current == index ? "#fff": "#333"}}>{this.getCurrentWeek(item)}</Text>
                                                </TouchableOpacity>)
                                            })
                                        }
                                    </View>
                                </View>
                            :null
                        }
                        {   
                            this.state.typeData.fId != null&& this.state.typeData.fId == 2 ? 
                            <View style={{flexDirection: "row",paddingLeft: 10,alignItems: "center"}}>
                                <Text style={styles.buttonText}>每</Text>
                                <View style={{borderWidth: 1,borderColor: "#E0E0E0",height: 30}}>
                                    <TextInput
                                        style={{color: "#666666",textAlign: 'right',paddingBottom: 4}}
                                        maxLength={4}
                                        value={this.state.monthNum}
                                        onChangeText={(text)=>{
                                            this.setState({
                                                monthNum: text.trim()
                                            });
                                        }}
                                    />
                                </View>  
                                <Text style={styles.buttonText}>月</Text>
                                <View style={{borderWidth: 1,borderColor: "#E0E0E0",height: 30}}>
                                    <TextInput
                                        style={{color: "#666666",textAlign: 'right',paddingBottom: 4}}
                                        maxLength={4}
                                        value={this.state.monthTime}
                                        onChangeText={(text)=>{
                                            let b= this.checknumber(text);
                                            this.setState({
                                                monthTime: text.trim()
                                            });
                                        }}
                                    />
                                </View>  
                                <Text style={styles.buttonText}>次</Text>
                            </View>
                            :null
                        }
                        {   
                            this.state.typeData.fId != null&& this.state.typeData.fId == 3 ? 
                            <View style={{flexDirection: "row",paddingLeft: 10,alignItems: "center"}}>
                                <Text style={styles.buttonText}>每</Text>
                                <View style={{borderWidth: 1,borderColor: "#E0E0E0",height: 30}}>
                                    <TextInput
                                        style={{color: "#666666",textAlign: 'right',paddingBottom: 4}}
                                        maxLength={4}
                                        value={this.state.yearNum}
                                        onChangeText={(text)=>{
                                            this.setState({
                                                yearNum: text.trim()
                                            });
                                        }}
                                    />
                                </View>  
                                <Text style={styles.buttonText}>年</Text>
                                <View style={{borderWidth: 1,borderColor: "#E0E0E0",height: 30}}>
                                    <TextInput
                                        style={{color: "#666666",textAlign: 'right',paddingBottom: 4}}
                                        maxLength={4}
                                        value={this.state.yearTime}
                                        onChangeText={(text)=>{
                                            this.setState({
                                                yearTime: text.trim()
                                            });
                                        }}
                                    />
                                </View>  
                                <Text style={styles.buttonText}>次</Text>
                            </View>
                            :null
                        }
                    </View> : null
                    }
                </View>
                {
                        this.state.isFront ? 
                    
                <View style={{paddingLeft: 16,paddingRight: 16,marginTop: 16,paddingBottom: 20}}>
                    <Text style={{width: "100%",lineHeight: 18,color:"#999999"}}>
                    {/* {this.setTimeTxet()} */}
                    </Text>
                </View>: null 
                }
            </ScrollView>
            <View style={{paddingLeft: 16,paddingRight: 16}}>
              <TouchableOpacity style={styles.bottomButton} onPress= { () => {this.addDevice()}}>
                  <Text style={{color: "#fff", fontSize: 16}}>发布</Text>
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
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    anotherItem: {
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
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
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 50,
        paddingLeft: 10,
    },
    contentView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        
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
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1
    },
    addDevices: {
        width: "100%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    addDevicesItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        height: 50
    },
    addItem: {
        width: "100%",
        flexDirection: "row",
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        paddingBottom: 16,
        alignItems: "center",
        paddingTop: 16,
        paddingLeft: 5,
        justifyContent: "space-between"
    },
    buttonText: {
        color: "#333",
        fontSize: 16,
        marginLeft: 5,
        marginRight: 5
    },
    weekBotton: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderRightWidth: 0,
        borderColor: '#E0E0E0',
        alignItems: "center",
        justifyContent: "center"
    }
});
