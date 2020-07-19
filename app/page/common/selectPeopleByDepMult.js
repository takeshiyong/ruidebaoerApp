import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import { getAllUserName } from '../../store/thunk/systemVariable';
import Header from '../../components/header';
import Toast from '../../components/toast';
import userService from '../../service/userService';

const {width, height} = Dimensions.get('window');
export class SelectPeopleByDep extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
            selectDep: [],
            depList: [],
            peopleList: [],
            selectId: '',
            text: "",
            showX: false,
            savePeople: [],
            chooseParam: {},
            chooseArr: [],
            allPeople: [],
            useAllPeople: true, // 使用全部人员查询
        };
    }

    componentDidMount() {
      SplashScreen.hide();
      // 获取上一个页面部门id 初始化选中部门
      if (this.props.navigation.state.params && this.props.navigation.state.params.depId) {
        this.chooseItem(this.props.navigation.state.params.depId);
      }
      if (this.props.navigation.state.params && this.props.navigation.state.params.childrenDepId ) {
        this.getDepByDepAndPeople({
            fName: this.props.navigation.state.params.childrenDepId.fName,
            fId: this.props.navigation.state.params.childrenDepId.fId
        });
        this.getPeopleByDept(this.props.navigation.state.params.childrenDepId.fId);
        this.setState({
            useAllPeople: false
        })
      } else {
          this.getInitDep();
      }
      if (this.props.navigation.state.params && this.props.navigation.state.params.initParam) {
        this.setState({
            chooseParam: this.props.navigation.state.params.initParam,
            chooseArr: this.props.navigation.state.params.initArr
        })
      }
      this.props.dispatch(getAllUserName());
    }

    // 获取当前部门下所有人员 （深度获取）
    async getPeopleByDept(depId) {
        const res = await userService.selectPeopleAllByDep(depId);
        console.log('获取当前部门下所有人员', res);
        if (res.success) {
            this.setState({
                allPeople: res.obj
            });
        }   
    }

    // 第一次进入页面获取第一层部门数据
    getInitDep = async () => {
        global.loading.show();
        const res = await userService.firstLoadDep();
        global.loading.hide();
        if (res.success) {
            this.setState({depList: res.obj});
        } else {
            Toast.show(res.msg);
        }
    }

    // 通过部门id获取下级部门包括当前部门的人员
    getDepByDepAndPeople = async (item) => {
        const getDep = userService.selectDepByDep(item.fId);
        const getPeople = userService.selectPeopleByDep(item.fId);
        global.loading.show();
        const resArr = await Promise.all([getDep, getPeople]);
        global.loading.hide();
        // 部门的获取
        if (resArr[0].success) {
            this.state.selectDep.push({fName: item.fName, fId: item.fId})
            this.setState({
                depList: resArr[0].obj,
                selectDep: this.state.selectDep
            });
        } else {
            this.state.selectDep.push({fName: item.fName, fId: item.fId})
            this.setState({
                depList: [],
                selectDep: this.state.selectDep
            });
            // Toast.show(resArr[0].msg);
        }
        // 人员的获取
        if (resArr[1].success) {
            console.log(resArr[1].obj)
            this.setState({
                peopleList: resArr[1].obj,
                savePeople: resArr[1].obj,
            });
        } else {
            this.setState({
                peopleList: [],
                savePeople: []
            });
            // Toast.show(resArr[1].msg);
        }
    }

    // 从上部导航选择部门
    selctDep = (data, index) => {
        this.setState({
            selectDep: this.state.selectDep.slice(0, index)
        },() => {
            this.getDepByDepAndPeople(data)
        });
    }

    // 选择数据
    chooseItem = (id) => {
        const {depList, selectId} = this.state;
        if (selectId == id) return;
        // 选中数据
        for (let obj of depList) {
            if (obj.id == id) {
                obj.checked = true;
            } else {
                obj.checked = false;
            }
        }
        this.setState({ selectId: id, depList: depList });
    }

    // 选中人员
    markPeople = (data) => {
        const { navigate,goBack,state } = this.props.navigation;
        const { chooseParam, chooseArr } = this.state;
        if (chooseParam[data.fId]) {
            for (let i = 0, len = chooseArr.length; i < len; i++) {
                if (chooseArr[i].fId == data.fId) {
                    chooseArr.splice(i, 1);
                    break;
                }
            }
            chooseParam[data.fId] = null;
        } else {
            chooseParam[data.fId] = data.fUserName;
            chooseArr.push({fId: data.fId, fUserName: data.fUserName});
        }
        this.setState({ chooseParam, chooseArr});
    }
    //当值发生变换时
    handleChange = (text) => {
        this.setState({showX: text == "" ? false : true,text: text},()=>{
            if (!this.state.showX) {
                this.setState({
                    peopleList: this.state.savePeople
                });
                return;
            }
            let names = [];
            if (this.state.useAllPeople) {
                names = this.props.userAllInfo.filter((item) => {
                    return item.fUserName.indexOf(text) !== -1
                })
            } else {
                names = this.state.allPeople.filter((item) => {
                    return item.fUserName.indexOf(text) !== -1
                })
            }
            this.setState({
                peopleList: names
            })
        })
        
    }

    // 确认选择
    chooseTrue = () => {
        const {navigate,goBack,state} = this.props.navigation;
        const { chooseArr } = this.state;
        state.params.surePeople(chooseArr);
        goBack();
    }

    render() {
        const { pop } = this.props.navigation;
        const { selectDep, depList, peopleList, chooseParam, showChoose,chooseArr } = this.state;
        if (showChoose) {
            return (
                <View style={styles.container}>
                    <Header 
                        backBtn={false}
                        titleText="请选择"
                        hidePlus={true} 
                        rightBtn={
                            <TouchableOpacity style={{marginRight: 23}} onPress={()=>this.setState({showChoose: false})}>
                                <Text style={{color: '#fff',fontSize: 15}}>确定</Text>
                            </TouchableOpacity>
                        }
                    />
                     <ScrollView style={{width: '100%'}}>
                        {this.state.chooseArr.length !== 0 ? 
                            chooseArr.map((item, index)=>{
                                return (
                                    <View key={index} style={styles.itemView}>
                                        <View style={[styles.itemContetn,{justifyContent: 'space-between'}, index==chooseArr.length - 1 ? {borderBottomWidth:0}: {borderBottomWidth:1,borderBottomColor: '#E1E1E1'}]}>
                                            <View style={[styles.row, {flex: 1,borderBottomWidth: 0}]}>
                                                <View style={styles.circleView}>
                                                    <Text style={{color: '#fff'}}>{item.fUserName.substr(-2, 2)}</Text>
                                                </View>
                                                <Text style={{color: '#000', fontSize: 16}}>{item.fUserName}</Text>
                                            </View>
                                            <TouchableOpacity style={{paddingRight: 10}} onPress={()=>this.markPeople(item)}>
                                                <Text style={{color: '#E94449',fontSize: 16}}>移除</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }) : null}
                    </ScrollView>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="选择人员"
                    hidePlus={true} 
                />
                <View style={styles.topBar}>
                    <View style={styles.barInput}>
                        <TextInput  
                            style={{padding: 0,width: "100%", height: "100%", flex: 9, fontSize: 14,color: '#5D6A76'}}
                            placeholder={"搜索"}
                            allowFontScaling={true}
                            onChangeText={(text) => {this.handleChange(text)}}
                            value = {this.state.text}
                        />
                        {this.state.showX ? 
                            <TouchableOpacity style={{height: "100%",flex: 1,alignItems: "center"}} onPress={() => {this.setState({text: ""}, ()=>this.handleChange(this.state.text))}}>
                                <Feather name={'x'} size={18} style={{ color: 'rgba(148, 148, 148, .8)',lineHeight: 35}} />
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                </View>
                <View style={styles.headerView}>
                    <ScrollView horizontal ref={ref => this.rowScroll} showsHorizontalScrollIndicator={false} style={{paddingLeft: 3}}>
                        {selectDep.map((item, index)=>{
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
                          this.state.showX ? null : depList.map((item, index)=>{
                            return (
                                <TouchableOpacity key={index} style={styles.itemView} onPress={()=>this.getDepByDepAndPeople(item)}>
                                    <View style={[styles.itemContetn, index==depList.length - 1 ? {borderBottomWidth:0}: {}]}>
                                        <View style={[styles.row, {justifyContent: 'space-between',flex: 1}]}>
                                            <Text style={{color: '#000', fontSize: 16}}>{item.fName}</Text>
                                            <AntDesign name="right" color="#BBB"/>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                    <View style={{height: 20}}/>
                    {this.state.peopleList.length !== 0 ? 
                        peopleList.map((item, index)=>{
                            return (
                                <TouchableOpacity key={index} style={styles.itemView} onPress={()=>this.markPeople(item)}>
                                    <View style={[styles.itemContetn, index==peopleList.length - 1 ? {borderBottomWidth:0}: {}]}>
                                        <View style={[styles.row, {flex: 1}]}>
                                            <View style={{marginRight: 10}}>
                                                <AntDesign name="checkcircle" color={chooseParam[item.fId] ? '#4972FE' : '#EFF1F3'} size={20}/>
                                            </View>
                                            <View style={styles.circleView}>
                                                <Text style={{color: '#fff'}}>{item.fUserName.substr(-2, 2)}</Text>
                                            </View>
                                            <Text style={{color: '#000', fontSize: 16}}>{item.fUserName}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }) : null}
                </ScrollView>
                <View style={styles.bottomView}>
                    <TouchableOpacity 
                        style={styles.rowStyles} 
                        onPress={()=>{
                            if (this.state.chooseArr.length == 0) return;
                            this.setState({showChoose: true})
                        }}
                    >
                        <Text style={{color: '#4058FD'}}>已选择: {chooseArr.length}人</Text>
                        <AntDesign name="up" color="#4058FD" size={14} style={{marginLeft: 5,marginTop: 3}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sureBtn} onPress={this.chooseTrue}>
                        <Text style={{color: '#fff'}}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => {

    return {
        userAllInfo: state.userReducer.userAllInfo,
    }
  }
  export default connect(
    mapStateToProps,
  )(SelectPeopleByDep);
const styles = StyleSheet.create({
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
        alignItems: 'center',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        paddingTop: 13,
        paddingBottom: 13
        
    },
    topBar:{
        width,
        height: 54,
        backgroundColor: "white",
        borderBottomColor: "#E1E1E1",
        borderBottomWidth: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    barInput:{
        height: 35,
        paddingLeft: 10,
        width: width-20,
        borderRadius: 5,
        backgroundColor: "#F6F8FA",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
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
    },
    itemContetn: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '93%',
        
        
    },
    bottomView: {
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#D6D6D6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 20,
        paddingLeft: 20
    },
    rowStyles: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    sureBtn: {
        width: 70,
        height: 32,
        borderRadius: 4,
        backgroundColor: '#4058FD',
        alignItems: 'center',
        justifyContent:'center'
    }
});
