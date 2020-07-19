import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,TextInput,ActivityIndicator, ScrollView,Image, FlatList,RefreshControl} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import SplashScreen from 'react-native-splash-screen';

import cameraServer from '../../service/cameraServer';
import Header from '../../components/header';
import Toast from '../../components/toast';
import { parseTime, parseDate } from '../../utils/handlePhoto';

const PAGESIZE = 10;
const {width, height} = Dimensions.get('window');
export default  class manage extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            showX: false,
            dataSource: [],
        };
    }

    componentDidMount() {
      SplashScreen.hide();
      this.selectAreaTreeInfo('');
    }

    //当值发生变换时
    handleChange = (text) => {
        
        console.log(text);
        if(text == ''){
            
        }else{
           
        }
        
    }
    //获取数据
    selectAreaTreeInfo = async (fName) => {
        const res = await cameraServer.selectAreaTreeInfo(fName)
        if(res.success){
            this.setState({
                dataSource: res.obj
            })
        }else{
            console.log(res.msg)
        }
    }
    toNextPage = (item) => {
        if(item.fId == 1){
            this.props.navigation.navigate('MoreCameraList')
            return
        }
        if(item.fType == 2){
            this.props.navigation.navigate('VideoSecondList',{item:item})
        }else{
            this.props.navigation.navigate('VideoFirstList',{item:item})
        }
    }
    render() {
        const { pop } = this.props.navigation;
        const { selectDep } = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="视频监控"
                    hidePlus={true} 
                />
                <ScrollView>
                    <View style={styles.cameraBox}>
                        {
                            this.state.dataSource.length > 0 ?
                                this.state.dataSource.map((item,index) => {
                                    return(<TouchableOpacity style={[styles.cameraItem,{marginBottom: this.state.dataSource.length >4 ? 10: 0}]} onPress={() => {this.toNextPage(item)}}>
                                        <Image style={{width: 44,height: 44}} source={index == 7 ? require('../../image/videoSurveillance/more.png') :require('../../image/videoSurveillance/camera.png')}/>
                                        <Text style={{fontSize: 14,color: "#333"}}>{item.fName?item.fName:'--'}</Text>
                                    </TouchableOpacity>)
                                }): <Text style={{width,height: 30,textAlign: "center",alignContent: "center",color: "#999"}}>无摄像头</Text>
                        }
                    </View>
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
    cameraBox: {
        width,
        backgroundColor: '#fff',
        padding: 15,
        flexDirection: "row",
        flexWrap: "wrap"
    },
    cameraItem: {
        width: (width-30)/4,
        alignItems: "center",
        
    },
    videoBox: {
        width: (width-43)/2,
        height: 141,
        marginBottom: 15
    },
    currentState:{
        backgroundColor: "#E0E0E0",
        width: 8,
        height: 8,
        borderRadius: 4
    },
    videoBoxBottom: {
        width: "100%",
        height: 48,
        alignItems: "center",
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    videoBoxs: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        paddingLeft: 15,
        paddingRight: 15
    }
});
