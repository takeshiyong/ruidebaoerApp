import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, TextInput,Image,Modal,Switch} from 'react-native';
import TipModal from '../../components/tipModal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../../components/header';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import SelectPeople from '../../components/selectPeople';
import Picker from 'react-native-wheel-picker';
import { parseTime, parseDate,isDot} from '../../utils/handlePhoto';
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
        allMinutes: 0,
        item: {},
        source: {},
        peopleArray: [],
        peopleType: 1,  // 1: 其他入口，2： 任务入口,
        showType: 2, // 2: 查看， 1： 编辑
    }
    componentDidMount() {
        console.log(11111111111111111111,this.props.navigation.state.params)
        if (this.props.navigation.state && this.props.navigation.state.params.showType) {
            this.setState({
                showType: this.props.navigation.state.params.showType,
            })
        }
        if (this.props.navigation.state && this.props.navigation.state.params.item&&this.props.navigation.state.params.peopleType) {
            this.setState({
              item: this.props.navigation.state.params.item,
              peopleType: this.props.navigation.state.params.peopleType
            },() => {
                this.getInitValue(this.state.peopleType === 2?this.state.item.tTask.fRelevantInfo :this.state.item.fId)})
        }
    }
    getInitValue = (id) => {
        console.log(11111111111111111);
        this.selectTrainProgressByPlaneId(id);
        this.selectTrainDetail(id);
    }
    
    //移动端人员培训进度展示
    selectTrainProgressByPlaneId = async (id) => {
        const res = await carshopsServer.selectTrainProgressByPlaneId(id);
        console.log(res);
        if(res.success){
            this.setState({
                peopleArray: res.obj
            })
        }else{
            console.log(res.msg);
        }
    }
    //查询培训计划详情
    selectTrainDetail = async (id) => {
        const res = await carshopsServer.selectTrainDetail(id);
        if(res.success){
            let allMinutes = 0;
            res.obj.tTrainCourseDtoList.length > 0? res.obj.tTrainCourseDtoList.map((item) => {
                allMinutes +=item.courseLengthOfTime
            }): 0
            this.setState({
                source:res.obj,
                allMinutes
            })
        }else{
            console.log(res.msg);
        }
    }
    //开始学习
    startStudy = async (item) => {
        if(item.learnedCondition){
            this.props.navigation.push('Course',{id: item.fCourseId,onRefresh: this.getInitValue,fTrainId: item.fTrainId}) 
        }else{
            global.loading.show();
            const res = await carshopsServer.trainplanBeginTrain({
                "courseId": item.fCourseId,
                "trainPlanId": item.fTrainId
            })
            global.loading.hide();
            if(res.success){
                // Toast.show(res.msg);
                this.getInitValue(item.fTrainId)
                this.props.navigation.push('Course',{id: item.fCourseId,onRefresh: this.getInitValue,fTrainId: item.fTrainId})
            }else{
                console.log(res.msg);
                Toast.show(res.msg);
            }
        }   
    }
    render() {
      const { typeList } = this.state;
        return (
          <View style={styles.container}>
            <Header 
              titleText="培训详情"
              backBtn={true}
              hidePlus={true}
              onRefresh = {this.props.navigation.state.params.onRefresh? this.props.navigation.state.params.onRefresh: null}
              rightBtn={
                this.state.showType === 1?
                <TouchableOpacity style={{marginRight: 10}} onPress={() => this.props.navigation.navigate('AddCultivate',{edit: true,source: this.state.source,onRefresh: this.getInitValue,initData:this.props.navigation.state.params.initData ?this.props.navigation.state.params.initData: null})}>
                    <Text style={{ color: '#fff', fontSize: 16 }}>编辑</Text>
                </TouchableOpacity> : null
              }
            />
            <ScrollView>
                <View style={{paddingLeft: 16,paddingRight: 16,marginTop: 12,backgroundColor: '#FFF'}}>
                    {
                        this.state.source.tTrainPlan ? 
                        <View>
                            <View style={[styles.item,{height: 47}]}>
                                <View style={{flexDirection: "row",alignItems: "center"}}>
                                    <Image source={require("../../image/deviceAdd/appsBig.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                    <Text style={{color: "#333", fontSize: 14,fontWeight: 'bold'}}>
                                        标题
                                        </Text>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <Text>{this.state.source.tTrainPlan.fName?this.state.source.tTrainPlan.fName:'--'}</Text>
                                </View>
                            </View>
                            <View style={[styles.item, {paddingBottom: 5}]} >
                                <View style={{flexDirection: "row",alignItems: "center"}}>
                                    <Image source={require('../../image/troubleDetails/leavel.png')} style={{width: 16,height: 16,marginRight: 4}}/>
                                </View>
                                <View style={[styles.contentView]}>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>类型</Text>
                                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                        <Text style={{color: "#666666",marginRight: 2}}>{this.state.source.tTrainPlan.fTypeName?this.state.source.tTrainPlan.fTypeName:'--'}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.item}>
                                <Image source={require('../../image/workStatus/start.png')} style={{marginRight: 4}}/>
                                <View style={styles.contentView}>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    开始时间
                                    </Text>
                                </View>
                                <Text>{this.state.source.tTrainPlan.fBeginTime?parseDate(this.state.source.tTrainPlan.fBeginTime,'YYYY.MM.DD'): '--'}</Text>
                            </View>
                            <View style={styles.item}>
                                <Image source={require('../../image/workStatus/stop.png')} style={{marginRight: 4}}/>
                                <View style={styles.contentView}>
                                    <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    结束时间
                                    </Text>
                                </View>
                                <Text>{this.state.source.tTrainPlan.fEndTime?parseDate(this.state.source.tTrainPlan.fEndTime,'YYYY.MM.DD'): '--'}</Text>
                            </View>
                        </View>
                        :null}
                    {
                        this.state.source.tTrainCourseDtoList?
                        <View style={{borderBottomColor: "#E0E0E0",borderBottomWidth: 1,}}>
                            <View style={[styles.item,{borderBottomWidth: 0}]}>
                                <Image source={require('../../image/cultivate/book.png')} style={{marginRight: 4}}/>
                                <View style={styles.contentView}>
                                        <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                            课程
                                        </Text>
                                        <Text>合计{this.state.allMinutes}分钟</Text>
                                </View>
                            </View>
                            {
                                this.state.peopleType === 1? <View>
                                    {
                                        this.state.source.tTrainCourseDtoList.map((item) => {
                                            return(<View style={{flexDirection: "row",justifyContent: "space-between",marginTop: 5,marginBottom: 10}}>
                                                <Text style={styles.leftText}>{item.courseName?item.courseName:'--'}</Text>
                                                <Text style={styles.rightText}>{item.courseLengthOfTime != null ?item.courseLengthOfTime: '--'}分钟</Text>
                                            </View>)
                                        })
                                    }
                                </View> : null
                            }
                            {
                                this.state.peopleType === 2? <View>
                                    {
                                        this.state.source.tTrainCourseDtoList.map((item) => {
                                            return(<View>
                                                    <View style={{flexDirection: "row",justifyContent: "space-between",marginTop: 5,marginBottom: 5}}>
                                                        <Text style={styles.leftText}>{item.courseName?item.courseName:'--'}</Text>
                                                        <Text style={styles.rightText}>{item.courseLengthOfTime!= null ?item.courseLengthOfTime: '--'}分钟</Text>
                                                    </View>
                                                    <View style={{flexDirection: "row",justifyContent: "space-between",marginTop: 5,marginBottom: 10}}>
                                                        <Text style={styles.rightText}>已学习{item.learnedLengthOfTime!= null?isDot(item.learnedLengthOfTime/item.courseLengthOfTime)*100: '--'}%</Text>
                                                        
                                                        <TouchableOpacity style={styles.startButton} onPress={() => {this.startStudy(item)}}>
                                                            <Text style={{color: "#fff",fontSize: 14,fontWeight: "500"}}>{item.learnedCondition?'继续学习':'开始学习'}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>)
                                        })
                                    }
                                </View> : null
                            }
                            <View>

                            </View>
                        </View>
                        : null
                    }
                    <View> 
                        <View style={[styles.item,{borderBottomWidth: 0}]}>
                            <Image source={require("../../image/TroubleCallBack/userGroup.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                            <View style={styles.contentView}>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    人员列表
                                </Text>
                                <Text>合计{this.state.peopleArray.length}人</Text>
                            </View>
                        </View> 
                        <View style={{paddingBottom: 20,backgroundColor: "#fff"}}>
                            {this.state.peopleArray.length> 0 ?this.state.peopleArray.map((item)=>{
                                console.log(item.learnedCourseWareTimeLong/item.courseTimeLong)
                                return (<View style={styles.itemsStyles}>
                                    <View style={styles.userIcon} key={item.fId}>
                                        <View style={styles.userImgs}>
                                            <View style={styles.userImg}>
                                                <Text style={{fontSize: 14,color: "white"}}>
                                                    {item.fTrainEmployeeName ? item.fTrainEmployeeName.substr(item.fTrainEmployeeName.length-2,2) : ''}
                                                </Text>
                                            </View> 
                                        </View>
                                    </View>
                                    <Text style={{fontSize: 14,color: "#333",fontWeight: "500",width: 73,textAlign: "center"}}>{item.fTrainEmployeeName}</Text>
                                    <View style={styles.barLine}>
                                        <View style={[styles.barInnerLine,{width: item.courseTimeLong != null&&item.learnedCourseWareTimeLong != null? ((item.learnedCourseWareTimeLong/item.courseTimeLong)*100)+"%": 0, backgroundColor: item.learnedCourseWareTimeLong/item.courseTimeLong === 1 ?"#1ACFAA": "#4058FD",}]}></View>
                                    </View>
                                    <Text style={{color: "#333",fontWeight: "500",width: 35}}>{item.courseTimeLong != null&&item.learnedCourseWareTimeLong != null? (isDot(item.learnedCourseWareTimeLong/item.courseTimeLong)*100)+"%": '--'}</Text>
                                </View>
                                )
                            }): null}
                    </View>
                    </View>      
                </View>
            </ScrollView>
            
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
    contentView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        
    },
    userIcon: {
        alignItems: 'center',
        // marginRight: 10
      },
    
    userImgs:{
        width: 47,
        height: 48,
        backgroundColor: "#D9DEFF",
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
      },
    userImg:{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: "#4058FD",
          alignItems: "center",
          justifyContent: "center"
      },
    barLine: {
        height: 8,
        width: 190,
        backgroundColor: "#E0E0E0",
        borderRadius: 4,
        
    },
    barInnerLine:{
        height: "100%",
        borderRadius: 4
    },
    itemsStyles: {
        flexDirection: "row",
        alignItems: "center",
        height: 50,
        justifyContent: "space-between",
        marginBottom: 5
    },
    leftText: {
        color: "#333",
        fontSize: 14,
        fontWeight: "500"

    },
    rightText: {
        color: "#999",
        fontSize: 14,
        fontWeight: "500"
    },
    startButton: {
        width: 90,
        height: 28,
        borderRadius: 5,
        backgroundColor: "#4058FD",
        alignItems: "center",
        justifyContent: "center"
    }
});
