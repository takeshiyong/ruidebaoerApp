import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import { getAllUserName } from '../../store/thunk/systemVariable';
import Header from '../../components/header';
import Toast from '../../components/toast';
import deviceService from '../../service/deviceServer';

const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            showX: false,
            listValue: []
        };
    }

    componentDidMount() {
      SplashScreen.hide();
      this.getDeviceManufacturerSelectAll()
    }

    //获取产商的数据
    getDeviceManufacturerSelectAll = async() => {
        const res = await deviceService.getDeviceManufacturerSelectAll();
        if(res.success){
            this.setState({
                listValue: res.obj
            })
        }else{
            Toast.show(res.msg)
            console.log(res.msg)
        }
        
    }
    //确认值后传出
    postValue = (item) => {
        const {navigate,goBack,state} = this.props.navigation;
        state.params.getManuFacturer(item);
        goBack();
    }
    //当值发生变换时
    handleChange = (text) => {
        this.setState({showX: text == "" ? false : true,text: text},()=>{
            if(text == ""){
                this.getDeviceManufacturerSelectAll();
                return;
            }
            let names = [];
            if (this.state.listValue.length !== 0) {
                names = this.state.listValue.filter((item) => {
                    return item.fManufacturerName.indexOf(text) !== -1
                })
            } else {
                names = this.state.listValue.filter((item) => {
                    return item.fManufacturerName.indexOf(text) !== -1
                })
            }
            this.setState({
                listValue: names
            })
        })
        
    }
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="制造商列表"
                    hidePlus={true} 
                />
                <View style={styles.topBar}>
                    <View style={styles.barInput}>
                        <TextInput  
                            style={{padding: 0,width: "100%", height: "100%", flex: 9, fontSize: 14,color: '#5D6A76'}}
                            placeholder={"搜索制造商"}
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
                    <ScrollView >
                       {
                           this.state.listValue.map((item) => {
                               return (<TouchableOpacity style={{borderBottomColor: "#F6F6F6",borderBottomWidth: 1}} onPress={() => {this.postValue(item)}}>
                                        <Text style={{color: "#333333",fontSize: 14,paddingTop: 20,paddingBottom: 20,fontWeight: "500"}}>{item.fManufacturerName}</Text>
                                   </TouchableOpacity>)
                           })
                       }
                    </ScrollView>
                </View>
            </View>
        );
    }
}

   
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
        paddingLeft: 17,
        paddingRight: 17,
        backgroundColor: '#fff',
       
    },
    
});
