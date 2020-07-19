import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Modal, TextInput, Switch} from 'react-native';
import Header from '../../components/header';
import TipModal from '../../components/tipModal';
import Toast from '../../components/toast';
import { parseDate } from '../../utils/handlePhoto';
import carshopsServer from '../../service/deviceServer';


const {width, height} = Dimensions.get('window');

export default class App extends Component {
    state = {
        showModal: false,
        name: 'adadsa',
        obj: {},
        fromTask: false,
        fId: '',
        type: 1, //1其他入口，2保养记录入口，
        
    }
    //设置头部
    static navigationOptions = () => ({
        header: null,
        
    });

    componentDidMount() {
        console.log(this.props.navigation.state.params);
        if (this.props.navigation.state && this.props.navigation.state.params.id && this.props.navigation.state.params.type) {
            this.selectDetailByfMaintainTaskId(this.props.navigation.state.params.id)
            this.setState({
                fromTask: this.props.navigation.state.params.fromTask?this.props.navigation.state.params.fromTask: false,
                fId: this.props.navigation.state.params.id,
                type: this.props.navigation.state.params.type,
                
            })
          }
    }
    delectWork = () => {
        this.maintainTaskDeleteById()
    }
    //删除
    maintainTaskDeleteById = async () => {
        global.loading.show();
        const res = await carshopsServer.deleteById(this.state.obj.fMaintainTaskId);
        global.loading.hide();
        if(res.success){
            this.setState({showModal: false})
            Toast.show(res.msg)
            this.props.navigation.state.params.onRefresh()
            this.props.navigation.pop();
        }else{
            console.log(res.msg);
            Toast.show(res.msg)
        }
    }
    //获取页面详情
    selectDetailByfMaintainTaskId = async (id) => {
        global.loading.show();
        const res = await carshopsServer.selectDetailByfMaintainTaskId(id);
        global.loading.hide();
        if(res.success){
            this.setState({
                obj: res.obj
            })
        }else{
            console.log(res.msg);
        }
    };
    render() { 
        const { obj } = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="任务详情"
                    hidePlus={false} 
                    props={this.props}
                />
                 <TipModal 
                    showModal={this.state.showModal}
                    onCancel={()=>{this.setState({showModal: false})}}
                    onOk={this.delectWork}
                    tipText={`您确定删除${obj.fMaintainTaskTitle}吗？`}
                    />
                <ScrollView>
                    <View style={styles.items}>
                        <Text style={styles.leftText}>任务名称:</Text>
                        <Text style={styles.RightText}>{obj.fMaintainTaskTitle?obj.fMaintainTaskTitle: '--'}</Text>
                    </View>
                    <View style={styles.items}>
                        <Text style={styles.leftText}>保养级别:</Text>
                        <Text style={styles.RightText}>{obj.fMaintainLevel != null?(obj.fMaintainLevel == 0?'日': (obj.fMaintainLevel == 1? '周': (obj.fMaintainLevel == 2? '月': '年')) ): '--'}</Text>
                    </View>
                    <View style={styles.items}>
                        <Text style={styles.leftText}>开始时间:</Text>
                        <Text style={styles.RightText}>{obj.fMaintainTaskDate?parseDate(obj.fMaintainTaskDate,'YYYY-MM-DD'): '--'}</Text>
                    </View>
                    <View style={{backgroundColor: "#fff",marginTop: 10}}>
                        <View style={[styles.items,{height: 40,marginTop: 0}]}>
                            <Text style={styles.leftText}>保养设备:</Text>
                            <Text style={styles.RightText}>{obj.tMaintainRecordEquipmentList&&obj.tMaintainRecordEquipmentList.length != 0? obj.tMaintainRecordEquipmentList.length : '--'}台</Text>
                        </View>
                        {
                            !this.state.fromTask && obj.tMaintainRecordEquipmentList&&obj.tMaintainRecordEquipmentList != 0? 
                            obj.tMaintainRecordEquipmentList.map((item) => {
                                // if (this.state.fromTask&&item.fState == 2) {
                                //     return (
                                //         <View style={styles.itemList}>
                                //             <Text style={styles.leftText}>{item.fEquipmentName?item.fEquipmentName: '--'}</Text>
                                //             <Text style={{color: "#4058FD",fontSize: 14,marginRight: 36}}>{item.fState != null? (item.fState == 0? '未开始': (item.fState == 1? "待完成": '已完成')): '--'}</Text>
                                //         </View>
                                //     )
                                // }
                                return (<TouchableOpacity style={styles.itemList} onPress={() => {this.props.navigation.push('DeviceCarshopsDetail', {item: {...item,maintainLevel: obj.fMaintainLevel,fromTask:this.state.fromTask},detail:this.state.obj,onRefresh: ()=>this.selectDetailByfMaintainTaskId(this.state.fId)})}}>
                                            <Text style={styles.leftText}>{item.fEquipmentName?item.fEquipmentName: '--'}</Text>
                                            <Text style={{color: "#4058FD",fontSize: 14,marginRight: 36}}>{item.fState != null? (item.fState == 0? '未开始': (item.fState == 1? "待完成": '已完成')): '--'}</Text>
                                        </TouchableOpacity>)
                            }): null
                        }
                        {
                            this.state.fromTask && obj.tMaintainRecordEquipmentList&&obj.tMaintainRecordEquipmentList != 0? 
                            obj.tMaintainRecordEquipmentList.map((item) => {
                                return (<TouchableOpacity style={styles.itemList} onPress={() => {this.props.navigation.push('DeviceCarshopsDetail', {detail:this.state.obj,item: {...item,maintainLevel: obj.fMaintainLevel, fromTask: this.state.fromTask},onRefresh: ()=>this.selectDetailByfMaintainTaskId(this.state.fId)})}}>
                                            <Text style={styles.leftText}>{item.fEquipmentName?item.fEquipmentName: '--'}</Text>
                                            <Text style={{color: "#4058FD",fontSize: 14,marginRight: 36}}>{item.fState != null? (item.fState == 0? '待保养': (item.fState == 1? "待保养": '已保养')): '--'}</Text>
                                        </TouchableOpacity>)
                            }): null
                        }
                        
                    </View>
                    
                    <View style={styles.items}>
                        <Text style={styles.leftText}>保养人:</Text>
                        {
                            obj.tMaintainTaskUserList&&obj.tMaintainTaskUserList != 0? 
                            obj.tMaintainTaskUserList.map((item) => {
                                return <Text style={styles.RightText}>{item.fUserName?item.fUserName:'--'}</Text>
                            }): null
                        }
                    </View>
                </ScrollView>
                {
                    this.state.fromTask||this.state.type === 2 ? null : 
                    <View style={styles.botton}>
                        <TouchableOpacity style={styles.bottomLeft} onPress={() => this.setState({showModal: true})}>
                            <Text style={{color: "#fff", fontSize: 14}}>删除</Text>
                        </TouchableOpacity>
                    </View>
                }
                
                
                
                
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        display: "flex"
    },
    items: {
        backgroundColor: '#FFF',
        paddingLeft: 16,
        paddingRight: 16,
        height: 50,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    leftText: {
        color: "#333",
        fontSize: 14,
        fontWeight: "500",
        marginRight: 10
    },
    RightText: {
        color: "#333",
        fontSize: 14,
        marginRight: 5
    },
    itemList: {
        flexDirection: "row",
        paddingLeft: 16,
        paddingRight: 16,
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1
    },
    botton: {
        height: 59,
        alignItems: "center", 
        paddingLeft: 16, 
        paddingRight: 16, 
        flexDirection: "row", 
        justifyContent: "space-between",
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: "#fff"
    },
    bottomLeft: {
        flex: 2,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        borderRadius: 5,
        backgroundColor: "#4058FD", 
    },
    bottomRight: {
        flex: 3,
        backgroundColor: "#4058FD", 
        alignItems: "center", 
        justifyContent: "center",
        height: "100%",
        borderRadius: 5
    },
});
