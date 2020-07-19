import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import { getAllUserName } from '../../../store/thunk/systemVariable';
import Header from '../../../components/header';
import Toast from '../../../components/toast';
import userService from '../../../service/userService';

const {width, height} = Dimensions.get('window');
export class SelectPeopleByDep extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
            peopleList: [],
            text: "",
            chooseArr: [],
        };
    }

    componentDidMount() {
      SplashScreen.hide();
      
    }
    // 选中人员
    markPeople = (data) => {
        const {chooseArr } = this.state;
        chooseArr.push({fId: data.fId, fUserName: data.fUserName});
        this.setState({chooseArr},()=>{this.chooseTrue()});
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
        const {initArr} = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="选择人员"
                    hidePlus={true} 
                />  
                <ScrollView style={{width: '100%'}}>
                    {initArr.length !== 0 ? 
                        initArr.map((item, index)=>{
                            return (
                                <TouchableOpacity key={index} style={styles.itemView} onPress={()=>this.markPeople(item)}>
                                    <View style={[styles.itemContetn, index==initArr.length - 1 ? {borderBottomWidth:0}: {}]}>
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
