import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView,Animated, TouchableHighlight,Image,Modal} from 'react-native';

import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import Entypo from 'react-native-vector-icons/Entypo';
import { ECharts } from 'react-native-echarts-wrapper';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';

import Header from '../../components/header';
import Toast from '../../components/toast';
import ModalDropdown from '../../components/modalDropdown';
import meetingServer from '../../service/meetingServer';

const {width, height} = Dimensions.get('window');

class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
            currentData : 1,
            whetherJoin: true,
            currentAddType: 0,
            value: [],
            optionArr: [],
            defaultArr: [],
            anotherArr: [],
            putArr: [],
            reject: false,
            rejectText: '',
            rejectUserName: ''
            // rowSwipeAnimatedValues : {},
        };
    }
    
    componentDidMount() {
        SplashScreen.hide();
        let arr = this.props.navigation.state.params.value.map((item,index) => ({
            "key": index+1,
            'fUserName': item.fUserName,
            'fActualState': item.fActualState,
            'fDeedbackState': item.fDeedbackState,
            // 'fEmployeeId': item.fId,
            'fId': item.fEmployeeId,
            'fIsDelete': item.fIsDelete,
            'fMettingId': item.fMettingId,
            'fRefuseReason': item.fRefuseReason,
            'position': item.position
        }))
        // let len = arr.length;
        // Array(len).fill('').forEach((_, i) => {
		// 	this.state.rowSwipeAnimatedValues[`${i}`] = new Animated.Value();
        // });
        this.setState({
            value: arr,
            // rowSwipeAnimatedValues: this.state.rowSwipeAnimatedValues
        })

        this.getEchartsData();
    }
    //参会人列表(移动端)
    getEchartsData = async () => {
        const res = await meetingServer.getEchartsData(this.props.messageId)
        if(res.success){
            let count = res.obj.count;
            let num = res.obj.num;
            let arr = []
            if(num){
                for(let item of num){
                    arr.push({
                        option: {
                            title: {
                                text: item.num?item.num :0 +"人",
                                top: '40%',
                                left: '45%',
                                textStyle: {
                                    fontSize: 12,
                        
                                },
                                textAlign: 'center'
                            },
                            series: [
                                {
                                    clockwise: false,
                                    name:'参加会议',
                                    type:'pie',
                                    radius: ['55%', '75%'],
                                    avoidLabelOverlap: false,
                                    hoverAnimation: false,
                                    legendHoverLink: false,
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            show: true,
                                            textStyle: {
                                                fontSize: '30',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data:[
                                        {value:item.num?item.num: 0, itemStyle: {
                                            color: {
                                                type: 'linear',
                                                x: 0,
                                                y: 0,
                                                x2: 1,
                                                y2: 0,
                                                colorStops: [{
                                                    offset: 0,
                                                    color: '#5E75FE' // 0% 处的颜色
                                                }, {
                                                    offset: 1,
                                                    color: '#4058FD' // 100% 处的颜色
                                                }],
                                                globalCoord: false // 缺省为 false
                                            }
                    
                                        }},
                                        {value:count-item.num, itemStyle: {
                                            color: '#F3F3F3'
                                        }},
                                        
                                    ]
                                }
                            ]
                        }
                    })
                }
            }
            
            this.setState({
                optionArr: arr
            })
        }else{
            console.log('参会人列表',res.msg)
        }
    }
    onRowDidOpen = (rowKey, rowMap) => {
		console.log('This row opened', rowKey);
	}
    changeRecordPeople = (rowData,rowMap) => {
        
    }
    closeRow(rowMap, rowKey) {
        const { value } = this.state;
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
        }
       
        
    }
    setChangePart(rowMap, rowKey){
        this.closeRow(rowMap, rowKey);
        this.changeParterToRecord(rowKey-1)
    }
    //设置用户为记录人
    changeParterToRecord = async (rowKey) => {
        const { value } = this.state;
        const res = await meetingServer.changeParterToRecord({
            employeeId: value[rowKey].fId,
            mettingId: this.props.messageId
        })
        if(res.success){
            Toast.show(res.msg,'请点击保存')
        }else{
            console.log('设置用户为记录人',res.msg);

        }
    }
    
    

	deleteRow(rowMap, rowKey) {
        
		this.closeRow(rowMap, rowKey);
		const newData = [...this.state.value];
		const prevIndex = this.state.value.findIndex(item => item.key === rowKey);
        let arr = newData.splice(prevIndex, 1);
		this.setState({value: newData,currentAddType: 2},() => {
            console.log(this.state.value)
        });
	}

	onRowDidOpen = (rowKey, rowMap) => {
		console.log('This row opened', rowKey);
	}

	onSwipeValueChange = (swipeData) => {
		const { key, value } = swipeData;
		// this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
	}
    // 跳转选择页面
    jumpSelectPage = () => {
        const { value } = this.state;
        this.setState({
            defaultArr: value
        })
        let param = {};
        for (let item of value) {
            param[item.fId] = item.fUserName
        }
        this.props.navigation.navigate('selectPeopleByDepMult',
        {surePeople: this.getReportPeople,initParam: param, initArr: value}
        );
    }
        // 获取上一个页面选中的数据
    getReportPeople = (data) => {
        let arr = [];
        if(data.length>0){
            for(index in data) {
                arr.push({
                    key: index,
                    fUserName: data[index].fUserName,
                    fId: data[index].fId,
                    position: data[index].position? data[index].position:'参会人'
                })
            }
            this.setState({
                value: arr,
                currentAddType: 1
            })
        }
    }
    //新增删除人员接口
    meetingOperation = async (value) => {
        let arr = this.state.value.map((item,index) => ({
            'fUserName': item.fUserName,
            'fActualState': item.fActualState? item.fActualState: '',
            'fDeedbackState': item.fDeedbackState? item.fDeedbackState: '',
            'fEmployeeId': item.fId,
            'fId': item.fEmployeeId? item.fEmployeeId: '',
            'fIsDelete': item.fIsDelete? item.fIsDelete: '',
            'fMettingId': item.fMettingId? item.fMettingId: '',
            'fRefuseReason': item.fRefuseReason?item.fRefuseReason: '',
        }))
        const res = await meetingServer.meetingOperation({
            mettingId: this.props.messageId,
            mettingPersonList: arr,
        })
        if(res.success){
            Toast.show("修改成功")
            this.props.navigation.state.params.messageGetDetail();
            this.props.navigation.pop();
        }else{
            console.log(res.msg)
        }
    }
    //保存操作
    
    render() {
        const { value } = this.state;
        const { disabled } = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="参会人列表"
                    hidePlus={true} 
                />
                <Modal
                    animationType={'fade'}
                    transparent
                    visible={this.state.reject}
                    onRequestClose={()=>this.setState({reject: false})}
                >
                    <View style={styles.mask}>
                        <View style={styles.contentView}>
                            <View style={styles.textView}>
                                <Text>{this.state.rejectUserName+'不能参加会议的原因：'}{this.state.rejectText}</Text>
                            </View>
                            <View style={styles.contentFoot}>
                                <TouchableOpacity style={styles.btn} onPress={()=>{
                                    this.setState({reject: false})
                                }}>
                                    <Text style={{color: '#4A72FE'}}>关闭</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <ScrollView style={{width: '100%'}}>
                {
                    
                    this.props.navigation.state.params&&this.props.navigation.state.params.fState !== 4 && this.props.navigation.state.params.fState !== 5?  
                        <View>
                            {
                                this.props.navigation.state.params.id == this.props.fEmployeeId ?
                                    <View>
                                        <View style={{height: 40,paddingLeft: 15,paddingRight: 15,justifyContent: "center"}}>
                                            <Text style={{fontSize: 16,color: '#333',fontWeight: '500'}}>统计 合计{value.length}人</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row',paddingBottom: 20,flexWrap: 'wrap',paddingTop: 15,backgroundColor: "#fff",}}>
                                            {
                                                this.state.optionArr.map((data,index)=>{
                                                    return (
                                                        <View  style={styles.echartsView}>
                                                            <ECharts option={data.option}/>
                                                            <View style={styles.hideLine}/>
                                                            <Text style={styles.echartsText}>{index == 0? '未处理':(index == 1? '参加':'不参加')}</Text>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                : null
                            }
                            
                        { !disabled  ?
                            <View>
                                <View style={{height: 40,paddingLeft: 15,paddingRight: 15,alignItems: "center",justifyContent: "center",flexDirection: "row",justifyContent: "space-between"}}>
                                    <Text style={{fontSize: 16,color: '#333',fontWeight: '500'}}>人员</Text>
                                    <TouchableOpacity onPress={this.jumpSelectPage}>
                                        <Text style={{fontSize: 16,color: '#333',fontWeight: '500'}}>添加</Text>
                                    </TouchableOpacity>
                                </View>
                                <SwipeListView
                                    data={value}
                                    renderItem={ (rowData, rowMap) => (
                                        <TouchableHighlight
                                            onPress={ _ => console.log('You touched me') }
                                            style={styles.itemView}
                                            underlayColor={'#AAA'}
                                        >
                                            <View style={[styles.row]}>
                                                <View style={{flexDirection: "row",alignItems: "center",flex:3}}>
                                                    <View style={styles.circleView}>
                                                        <Text style={{color: '#fff'}}>{rowData.item.fUserName.substr(-2, 2)}</Text>
                                                    </View>
                                                    <Text style={{color: '#000', fontSize: 16}}>{rowData.item.fUserName}</Text>
                                                </View>
                                                <View style={{flexDirection: "row",flex: 3,justifyContent: "space-between"}}>
                                                    <Text >{rowData.item.fDeedbackState == 1 ? '未确认': rowData.item.fDeedbackState == 2 ? '参加': '不参加'}</Text>
                                                    <View style={{flexDirection: 'row', alignItems: 'center', width: 70,justifyContent: 'space-between'}}>
                                                        <Text>{rowData.item.position? rowData.item.position: '--'}</Text>
                                                        {rowData.item.fDeedbackState == 3? 
                                                            <TouchableOpacity onPress={()=>{
                                                                this.setState({
                                                                    reject: true,
                                                                    rejectText: item.fRefuseReason,
                                                                    rejectUserName: item.fUserName
                                                                })
                                                            }}>
                                                                <Entypo name="dots-three-horizontal" size={18}></Entypo>
                                                            </TouchableOpacity> 
                                                            : null
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                    </TouchableHighlight>
                                    )}
                                    renderHiddenItem={ (data, rowMap) => (
                                        <View style={styles.rowBack}>
                                            <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={ () => this.setChangePart(rowMap, data.item.key) }>
                                                <Text style={styles.backTextWhite}>设为记录人</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ () => this.deleteRow(rowMap, data.item.key) }>
                                                    <Text style={styles.backTextWhite}>删除</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    disableRightSwipe={true}
                                    rightOpenValue={-180}
                                    previewRowKey={'0'}
                                    previewOpenValue={-40}
                                    previewOpenDelay={3000}
                                    onRowDidOpen={this.onRowDidOpen}
                                    onSwipeValueChange={this.onSwipeValueChange}
                                />
                            </View>
                        : null}
                    </View>
                    : null
                }
                    {
                        disabled? 
                        <View>
                            <View style={{height: 40,paddingLeft: 15,paddingRight: 15,justifyContent: "center"}}>
                                <Text style={{fontSize: 16,color: '#333',fontWeight: '500'}}>人员 {value.length}人</Text>
                            </View>
                            {value.map((item, index)=>{
                                return (
                                    <TouchableOpacity key={index} style={styles.itemView}>
                                        <View style={[styles.row]}>
                                            <View style={{flexDirection: "row",alignItems: "center",flex:3}}>
                                                <View style={styles.circleView}>
                                                    <Text style={{color: '#fff'}}>{item.fUserName.substr(-2, 2)}</Text>
                                                </View>
                                                <Text style={{color: '#000', fontSize: 16}}>{item.fUserName}</Text>
                                            </View>
                                            {
                                                this.props.navigation.state.params&&this.props.navigation.state.params.fState == 4 ?  
                                                <View style={{flexDirection: "row",flex: 3,justifyContent: "space-between"}}>
                                                    <Text >{item.fActualState == 1 ?  '参加': '不参加'}</Text>
                                                    <View style={{flexDirection: 'row', alignItems: 'center', width: 70,justifyContent: 'space-between'}}>
                                                        <Text>{item.position? item.position: '--'}</Text>
                                                        {item.fActualState == 2? 
                                                            <TouchableOpacity onPress={()=>{
                                                                this.setState({
                                                                    reject: true,
                                                                    rejectText: item.fRefuseReason,
                                                                    rejectUserName: item.fUserName
                                                                })
                                                            }}>
                                                                <Entypo name="dots-three-horizontal" size={18}></Entypo>
                                                            </TouchableOpacity> 
                                                            : null
                                                        }
                                                    </View>
                                                </View>
                                                :
                                                <View style={{flexDirection: "row",flex: 3,justifyContent: "space-between"}}>
                                                    <Text >{item.fDeedbackState == 1 ? '未处理': item.fDeedbackState == 2 ? '参加': '不参加'}</Text>
                                                    <View style={{flexDirection: 'row', alignItems: 'center', width: 70,justifyContent: 'space-between'}}>
                                                        <Text >{item.position? item.position: '--'}</Text>
                                                        {item.fDeedbackState == 3? 
                                                            <TouchableOpacity onPress={()=>{
                                                                this.setState({
                                                                    reject: true,
                                                                    rejectText: item.fRefuseReason,
                                                                    rejectUserName: item.fUserName
                                                                })
                                                            }}>
                                                                <Entypo name="dots-three-horizontal" size={18} color="#666"></Entypo>
                                                            </TouchableOpacity> 
                                                            : null
                                                        }
                                                    </View>
                                                </View>
                                            }
                                            
                                        </View>
                                    </TouchableOpacity>)})}
                        </View>
                     : null
                    }
                    
                   
                    
                </ScrollView>
                {
                    !disabled ?
                    <TouchableOpacity style={{width: width, height: 50,alignItems: "center",justifyContent: "center",backgroundColor: "#4058FD", }} onPress={ () => this.meetingOperation(this.state.value)}>
                        <Text style={{color: "#fff", fontSize: 16}}>保存</Text>
                    </TouchableOpacity>
                    : null
                }
                           
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
      messageId: state.meetingReducer.meetingid,
      fEmployeeId: state.userReducer.userInfo.fEmployeeId
    }
  
}
export default connect(
    mapStateToProps,
)(App);
const styles = StyleSheet.create({
    mask: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    contentView: {
        width: '75%',
        borderRadius: 4,
        backgroundColor: '#fff'
    },
    contentFoot: {
        borderTopColor: '#F2F2F2',
        width: '100%',
        borderTopWidth: 1,
        height: 40,
        flexDirection: 'row',
        marginTop: 15
    },
    textView: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: 20,
        paddingRight: 10,
        paddingLeft: 10
    },
    btn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputStyle: {
        height: 80,
        padding: 0,
        textAlignVertical: 'top',
        width: '100%',
    },
    circleView: {
      width: 40,
      height: 40,
      borderRadius: 50,
      backgroundColor: '#4058FD',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F4F8',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        paddingTop: 13,
        paddingBottom: 13
        
    },
    itemView: {
        backgroundColor: '#fff',
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15
    },
    rowBack: {
		alignItems: 'center',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
    },
    backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 90
	},
    backRightBtnLeft: {
		backgroundColor: 'blue',
		right: 90
	},
	backRightBtnRight: {
		backgroundColor: 'red',
		right: 0
    },
    backTextWhite: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: "500"
    },
    echartsText: {
        color: '#666666',
        fontSize: 12,
        textAlign: 'center'
    },
    echartsView: {
        flex: 1,
        height: 100,
        position: 'relative'
    },
    echartsText: {
        color: '#666666',
        fontSize: 12,
        textAlign: 'center'
    },
    dropDownItem: {
        width: 60,
        alignItems: 'center',
        justifyContent: "center"
    },
    changeTitle: {
        width: 60,
        height: 25,
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 5,
        alignItems: "center",
        flexDirection: "row"
    },
    fontText: {
        fontSize: 14,
        color: "green"
    }
});
