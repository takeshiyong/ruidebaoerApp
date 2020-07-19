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
import carshopsServer from '../../service/collegeServer';


const PickerItem = Picker.Item;
const { width, height } = Dimensions.get('window');

export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        currentData: {},
        allHourLong: 0,
        index: 0,
        showModal: false,
        edit: false,
        name: "asasa",
        workText: '',
        date: null,
        date1: null,
        showPicker: false,
        typeDataList: [],
        participationArr: [],
        changeData: {},
        pickerList: [],
        itemList: [],
        sourseList: [],
        typeData: {
            index: 0,
            fId: null,
            fName: '请选择培训类型'
        },
    }
    componentDidMount() {
        this.TTrainTypeSelectAll();
        if (this.props.navigation.state.params && this.props.navigation.state.params.edit && this.props.navigation.state.params.source) {
            this.setState({
                edit: this.props.navigation.state.params.edit,
            },() => {this.setData(this.props.navigation.state.params.source)})
        }
    }
    setData = (data) => {
        console.log(data);
        let participationArr = [];
        let sourseList = [];
        data.tTrainEmployeeList.map((item) => {
            participationArr.push({
                fId: item.fEmployeeId,
                fUserName: item.fEmployeeName
            })
        })
        let allHourLong = 0
        data.tTrainCourseDtoList.map((item) => {
            allHourLong +=item.courseLengthOfTime;
            console.log(allHourLong)
            sourseList.push({
                fCourseId: item.fCourseId,
                fCourseName: item.courseName,
                allHourLong: item.courseLengthOfTime
            })
        })
        this.setState({
            workText: data.tTrainPlan.fName+'',
            typeData: {
                index: 0,
                fId: data.tTrainPlan.fTrainTypeId,
                fName: data.tTrainPlan.fTypeName
            },
            date: data.tTrainPlan.fBeginTime,
            date1: data.tTrainPlan.fEndTime,
            participationArr,
            sourseList,
            currentData: data,
            allHourLong
        })
    }
    //picker确认改值
    onPickerSelect = () => {
        const {typeData, changeData} = this.state;
        this.setState({
            showPicker: false,
            typeData: {
                index: changeData.index,
                fName: changeData.fName?changeData.fName: typeData.fName,
                fId: changeData.fId != null?changeData.fId: typeData.fId,
            },
        })
        
    }
    //查询所有培训类型名称
    TTrainTypeSelectAll = async () => {
        const res = await carshopsServer.TTrainTypeSelectAll();
        if(res.success){
            this.setState({
                typeDataList: res.obj
            })
        }else{
            console.log(res.msg);
        }
    }
    // 展开选择所有培训类型名称
    showTypeDataList = () => {
        let typeDataList = [...this.state.typeDataList]
        const { typeData } = this.state;
        if(typeDataList.length > 0){
            const selectList = typeDataList.map((data, index)=>{
                return {
                    index: index,
                    fId: data.fId,
                    fName: data.fTypeName
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
    //跳转获取课程
    getDevice = () => {
        this.props.navigation.push('CulVideoChoose',{getValue: this.getValue,sourseList: this.state.sourseList});
    }
    //获取课程
    getValue = async(value) => {
        let allHourLong = 0
        value.map((item) => {
            allHourLong += item.allHourLong
        })
        this.setState({
            sourseList: value,
            allHourLong: allHourLong
        })
    }
    delectContent = () => {
        let sourseList = [...this.state.sourseList];
        let item = sourseList.splice(this.state.index,1)
        let allHourLong = 0;
        sourseList.map((item) => {
            allHourLong += item.allHourLong
        })
        this.setState({
            allHourLong,
            sourseList,
            showModal: false
        })
    }
    //新建
    addCultivate = async() => {
        const { sourseList,isFront, date,date1,workText,fNextTime,participationArr, typeData, dayNum, weekNum, monthNum, monthTime, yearNum, yearTime} = this.state;
        if(date == null) {
            Toast.show('请选择开始时间');
            return;
        }
        if(date1 == null) {
            Toast.show('请选择开结束时间');
            return;
        }
        if(new Date(date.replace(/-/g, '/')).getTime() < new Date(moment().format('YYYY/MM/DD')).getTime()){
            Toast.show('开始时间不能小于当前时间，请核对');
            return;
        }
        if(new Date(date.replace(/-/g, '/')).getTime() > new Date(date1.replace(/-/g, '/')).getTime()){
            Toast.show('开始时间不能大于结束时间，请核对');
            return;
        }
        if(typeData.fId === null){
            Toast.show('培训类型不能为空');
            return;
        }
        if(workText == ''){
            Toast.show('请选择任务标题');
            return;
        }
        
        if(participationArr.length == 0){
            Toast.show('人员不能为空');
            return;
        }
        if(sourseList.length == 0){
            Toast.show('课程不能为空');
            return;
        }
        let tTrainEmployeeList = [];
        participationArr.map((item) => {
            tTrainEmployeeList.push({fEmployeeId: item.fId})
        })
        let tTrainCourseList = [];
        sourseList.map((item) => {
            tTrainCourseList.push({fCourseId: item.fCourseId})
        })
        global.loading.show();
        
        const res = await carshopsServer.trainplanAdd({
            'tTrainCourseList': tTrainCourseList,
            'tTrainEmployeeList': tTrainEmployeeList,
            'tTrainPlan': {
                'fBeginTime': parseTime(date),
                'fName': workText,
                'fTrainTypeId': typeData.fId,
                'fHaveExam': false,
                'fEndTime':parseTime(date1)
            },
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
    //编辑
    editCultivate = async () => {
        const { currentData,sourseList,isFront, date,date1,workText,fNextTime,participationArr, typeData, dayNum, weekNum, monthNum, monthTime, yearNum, yearTime} = this.state;
        if(date == null) {
            Toast.show('请选择开始时间');
            return;
        }
        if(date1 == null) {
            Toast.show('请选择开结束时间');
            return;
        }
        
        if(new Date(date.replace(/-/g, '/')).getTime() < new Date(moment().format('YYYY/MM/DD')).getTime()){
            Toast.show('开始时间不能小于当前时间，请核对');
            return;
        }
        if(new Date(date.replace(/-/g, '/')).getTime() > new Date(date1.replace(/-/g, '/')).getTime()){
            Toast.show('开始时间不能大于结束时间，请核对');
            return;
        }
        if(typeData.fId === null){
            Toast.show('培训类型不能为空');
            return;
        }
        if(workText == ''){
            Toast.show('请选择任务标题');
            return;
        }
        
        if(participationArr.length == 0){
            Toast.show('人员不能为空');
            return;
        }
        if(sourseList.length == 0){
            Toast.show('课程不能为空');
            return;
        }
        let tTrainEmployeeList = [];
        participationArr.map((item) => {
            tTrainEmployeeList.push({fEmployeeId: item.fId})
        })
        let tTrainCourseList = [];
        sourseList.map((item) => {
            tTrainCourseList.push({fCourseId: item.fCourseId})
        })
        global.loading.show();
        
        const res = await carshopsServer.trainplanUpdate({
            'tTrainCourseList': tTrainCourseList,
            'tTrainEmployeeList': tTrainEmployeeList,
            'tTrainPlan': {
                'fBeginTime': parseTime(date),
                'fName': workText,
                'fTrainTypeId': typeData.fId,
                'fHaveExam': false,
                'fEndTime':parseTime(date1),
                'courseNumber': currentData.tTrainPlan.courseNumber,
                'employeeNumber': currentData.tTrainPlan.employeeNumber,
                'fCompletePersonNumber': currentData.tTrainPlan.fCompletePersonNumber,
                'fCreateUserId': currentData.tTrainPlan.fCreateUserId,
                'fCreateUserName': currentData.tTrainPlan.fCreateUserName,
                'fExamPaperId': currentData.tTrainPlan.fExamPaperId,
                'fId': currentData.tTrainPlan.fId,
                'fIsDelete': currentData.tTrainPlan.fIsDelete,
                'fPersonNumber': currentData.tTrainPlan.fPersonNumber,
                'fQualifiedNumber': currentData.tTrainPlan.fQualifiedNumber,
                'fRemark': currentData.tTrainPlan.fRemark,
                'fState': currentData.tTrainPlan.fState,
                'fTypeName': typeData.fName,
                'fCreateTime': parseTime(currentData.tTrainPlan.fCreateTime),
            },
        })
        global.loading.hide();
        if(res.success){
            Toast.show(res.msg)
            this.props.navigation.state.params.onRefresh(this.state.currentData.tTrainPlan.fId)
            this.props.navigation.pop();
        }else{
            Toast.show(res.msg)
            console.log(res.msg);
        }
    }
    //删除
    trainplanDeleteById = async () => {
        global.loading.show();
        const res = await carshopsServer.trainplanDeleteById(this.state.currentData.tTrainPlan.fId);
        global.loading.hide();
        if(res.success){
            Toast.show(res.msg)
            this.props.navigation.state.params.initData()
            this.props.navigation.pop(2);
        }else{
            console.log(res.msg);
        }
    }
    render() {
      const { typeList } = this.state;
        return (
          <View style={styles.container}>
            <Header 
              titleText="培训创建"
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
                                标题
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
                    <TouchableOpacity style={[styles.item, {paddingBottom: 5}]} onPress ={() => {this.showTypeDataList()}}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Image source={require('../../image/troubleDetails/leavel.png')} style={{width: 16,height: 16,marginRight: 4}}/>
                            <Text style={{color: 'red'}}>*</Text>
                        </View>
                        <View style={[styles.contentView]}>
                            <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>类型</Text>
                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                <Text style={{color: "#666666",marginRight: 2,paddingRight: 10}}>{this.state.typeData&&this.state.typeData.fName?this.state.typeData.fName:'请选择培训类型'}</Text>
                                <AntDesign name="right" color="#666666"/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.item}>
                          <Image source={require('../../image/workStatus/start.png')} style={{marginRight: 4}}/>
                          <View style={styles.contentView}>
                              <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                <Text style={{color: 'red'}}>*</Text>
                                开始时间
                                </Text>
                              <DatePicker
                                  style={{width: 160}}
                                  date={this.state.date}
                                  mode="date"
                                  placeholder="请选择开始时间"
                                  format="YYYY-MM-DD"
                                  minDate={moment(new Date()).format('YYYY-MM-DD')}
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
                    <View style={styles.item}>
                          <Image source={require('../../image/workStatus/stop.png')} style={{marginRight: 4}}/>
                          <View style={styles.contentView}>
                              <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                <Text style={{color: 'red'}}>*</Text>
                                结束时间
                                </Text>
                              <DatePicker
                                  style={{width: 160}}
                                  date={this.state.date1}
                                  mode="date"
                                  placeholder="请选择结束时间"
                                  format="YYYY-MM-DD"
                                  minDate={this.state.date? moment(parseTime(this.state.date)).format('YYYY-MM-DD'): moment().format('YYYY-MM-DD')}
                                  minDate={moment(new Date()).format('YYYY-MM-DD')}
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
                                  onDateChange={(date) => {this.setState({date1: date})}}
                              />
                          </View>
                    </View> 
                    <View style={{marginTop: 10,borderBottomColor: "#E0E0E0",borderBottomWidth: 1,paddingLeft: 1}}>
                        <SelectPeople title="人员"  showPeople={true} required={true} value={this.state.participationArr} onChange={(arr)=>this.setState({participationArr: arr})}/>
                    </View>
                    <View style={styles.anotherItem}>
                        <View style={styles.addDevicesItem}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Image source={require('../../image/carshops/register.png')} style={{marginRight: 5,marginLeft: 2}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                <Text style={{color: 'red'}}>*</Text>
                                课程
                                </Text>
                            </View>
                            <Text>{this.state.allHourLong}分钟</Text>
                        </View>
                        <View>
                            {
                            this.state.sourseList.length !== 0 ? 
                            this.state.sourseList.map((item,index) => {
                                return(<View style={styles.addItem}>
                                    <View style={{flexDirection: "row"}}>    
                                        <Text style={{color: "#333",fontSize: 14,fontWeight: "500",marginRight: 36}}>{item.fCourseName?item.fCourseName: '--'}</Text>
                                        <Text style={{color: "#999",fontSize: 14,fontWeight: "500"}}>{item.allHourLong?item.allHourLong: '--'}分钟</Text>
                                    </View>
                                    <TouchableOpacity  onPress ={() => {this.setState({showModal: true,index:index,name: item.fCourseName})}}>
                                        <AntDesign name="close" color="#666666" size={18}/>
                                    </TouchableOpacity>
                                </View>)
                            })
                            : null }
                        </View>
                        <TouchableOpacity style={styles.addDevices} onPress={() => {this.getDevice()}}>
                            <AntDesign name="plus" color="#4058FD" style={{marginRight: 8}}/>
                            <Text style={{color: "#4058FD",fontSize: 14}}>添加</Text>
                        </TouchableOpacity>
                    </View>
                    
                    
                </View>
            </ScrollView>
            {
                this.state.edit?
                <View style={styles.editButton}>
                    <TouchableOpacity style={[styles.leftButton]} onPress= { () => {this.trainplanDeleteById()}}>
                        <Text style={{color: "#4B74FF", fontSize: 16}}>删除</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity style={[styles.rightButton]} onPress= { () => {this.editCultivate()}}>
                        <Text style={{color: "#fff", fontSize: 16}}>保存</Text>
                    </TouchableOpacity> 
                </View> : null
            }
            {
                !this.state.edit?
                <View style={{paddingLeft: 16,paddingRight: 16}}>
                    <TouchableOpacity style={styles.bottomButton} onPress= { () => {this.addCultivate()}}>
                        <Text style={{color: "#fff", fontSize: 16}}>发布</Text>
                    </TouchableOpacity> 
                </View> : null
            }
            
            
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
        justifyContent: "space-between",
        paddingBottom: 8,
        marginTop: 10,
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1
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
    },
    leftButton: {
        flex: 3,
        borderRadius: 4,
        height: "100%",
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#4B74FF"
    },
    rightButton: {
        flex: 6,
        borderRadius: 4,
        backgroundColor: "#4058FD",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    editButton:{
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: "row",
        // backgroundColor: "red",
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        bottom: 10 
    }
});
