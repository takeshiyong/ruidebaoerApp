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
            savePeople: []
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
      } else {
          this.getInitDep();
      }
      this.props.dispatch(getAllUserName());
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
        const {navigate,goBack,state} = this.props.navigation;
        console.log('data',data);
        state.params.surePeople(data);
        goBack();
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
            let names = this.props.userAllInfo.filter((item) => {
                return item.fUserName.indexOf(text) !== -1
            })
            this.setState({
                peopleList: names
            })
        })
        
    }
    render() {
        const { pop } = this.props.navigation;
        const { selectDep, depList, peopleList } = this.state;
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
                    
                    { this.state.showX ? null : depList.map((item, index)=>{
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
                            console.log(item)
                            return (
                                <TouchableOpacity key={index} style={styles.itemView} onPress={()=>this.markPeople(item)}>
                                    <View style={[styles.itemContetn, index==depList.length - 1 ? {borderBottomWidth:0}: {}]}>
                                        <View style={[styles.row, {flex: 1}]}>
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
        
        
    }
});
