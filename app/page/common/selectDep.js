import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SplashScreen from 'react-native-splash-screen';

import Header from '../../components/header';
import Toast from '../../components/toast';
import userService from '../../service/userService';



const {width, height} = Dimensions.get('window');
export default class SelectDep extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
            selectDep: [],
            depList: [],
            selectId: ''
        };
    }

    componentDidMount() {
      SplashScreen.hide();
      // 获取上一个页面部门id 初始化选中部门
        //   if (this.props.navigation.state.params && this.props.navigation.state.params.depId) {
        //     this.chooseItem(this.props.navigation.state.params.depId);
        //   }
      this.getInitDep();
    }

    // 第一次进入页面获取第一层部门数据
    getInitDep = async () => {
        global.loading.show();
        const res = await userService.firstLoadDep();
        global.loading.hide();
        console.log('res', res);
        if (res.success) {
            this.setState({depList: res.obj});
        } else {
            Toast.show(res.msg);
        }
    }

    // 通过部门查找下级部门
    getDepByDep = async (item) => {
        global.loading.show();
        const res = await userService.selectDepByDep(item.fId);
        global.loading.hide();
        if (res.success) {
            this.state.selectDep.push({fName: item.fName, fId: item.fId})
            this.setState({depList: res.obj, selectDep: this.state.selectDep});
        } else {
            Toast.show(res.msg);
        }
    }

    // 从上部导航选择部门
    selctDep = (data, index) => {
        this.setState({
            selectDep: this.state.selectDep.slice(0, index)
        },() => {
            this.getDepByDep(data)
        });
    }

    // 选择数据
    chooseItem = (item) => {
        const {navigate,goBack,state} = this.props.navigation;
        state.params.sureDepId(item);
        goBack();
        // const {depList, selectId} = this.state;
        // if (selectId == id) return;
        // // 选中数据
        // for (let obj of depList) {
        //     if (obj.fId == id) {
        //         obj.checked = !obj.checked;
        //     } else {
        //         obj.checked = false;
        //     }
        // }
        // this.setState({ selectId: id, depList: depList});
    }
    
    render() {
        const { pop } = this.props.navigation;
        const { selectDep, depList } = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="选择单位"
                    hidePlus={true} 
                />
                <View style={styles.headerView}>
                    <ScrollView horizontal ref={ref => this.rowScroll} showsHorizontalScrollIndicator={false}>
                        {selectDep.map((item, index)=>{
                            // if (selectDep.length - 1 == index) {
                            //     return (
                            //         <View key={index} style={styles.rowStyle}>
                            //             <Text style={[styles.headerText, {color: '#68696B'}]}>{item.fName}</Text>
                            //         </View>
                            //     );
                            // }
                            return (
                                <View key={index} style={styles.rowStyle}>
                                    <TouchableOpacity onPress={()=>this.selctDep(item, index)}>
                                        <Text style={styles.headerText}>{item.fName}</Text>
                                    </TouchableOpacity> 
                                    <AntDesign name="right" color="#DEDEDE"/>
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>
                <ScrollView style={{width: '100%'}}>
                    {
                        depList.map((item, index)=>{
                            return (
                                <View key={index} style={styles.itemView}>
                                    <View style={[styles.itemContetn, index==depList.length - 1 ? {borderBottomWidth:0}: {}]}>
                                        <TouchableOpacity style={{marginRight: 10}} onPress={()=>this.chooseItem(item)}>
                                            <AntDesign name="checkcircle" color={item.checked ? '#4972FE' : '#EFF1F3'} size={20}/>
                                        </TouchableOpacity>
                                        {
                                            item.children ? 
                                            <TouchableOpacity onPress={()=>this.getDepByDep(item)} style={[styles.row, {justifyContent: 'space-between',flex: 1}]}>
                                                <Text style={{color: '#000', fontSize: 16}}>{item.fName}</Text>
                                                <AntDesign name="right" color="#BBB"/>
                                            </TouchableOpacity> : 
                                            <View style={[styles.row, {justifyContent: 'space-between',flex: 1}]}>
                                                <Text style={{color: '#000', fontSize: 16}}>{item.fName}</Text>
                                            </View>
                                        }
                                    </View>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F8',
    },
    sureBtn: {
      color: '#fff',
      fontSize: 16,
      marginRight: 15
    },
    rowStyle: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerView: {
        height: 40,
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 10
    },
    headerText: {
        color: '#4972FE',
        marginRight: 8,
        marginLeft: 8
    },
    itemView: {
        backgroundColor: '#fff',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemContetn: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '93%',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        paddingTop: 10,
        paddingBottom: 10
    }
});
