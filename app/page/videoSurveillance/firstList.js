import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,TextInput,ActivityIndicator, ScrollView,Image, FlatList,RefreshControl} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import SplashScreen from 'react-native-splash-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import organizationServer from '../../service/organizationServer';
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
            videoSource: [],
        };
    }

    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state && this.props.navigation.state.params.item) {
        this.setState({
            videoSource: this.props.navigation.state.params.item.fVideoChannelConfigList
        })
      }
    }
    toNextPage = () => {
        this.props.navigation.navigate('MoreCameraList')
        // this.props.navigation.navigate('MoreCameraList')
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
                    
                    <View style={{paddingTop: 15}}>
                        <View style={styles.videoBoxs}>
                            {
                                this.state.videoSource.length > 0 ?this.state.videoSource.map((item) => {
                                    return(<TouchableOpacity style={styles.videoBox} onPress={() => {this.props.navigation.navigate('Live',{fChannel:item.fChannel})}}>
                                                <Image style={{width: "100%",height: 93,backgroundColor: "#EBEBEB"}} source={{uri: config.cameraImg+item.fChannel}}/>
                                                <View style={styles.videoBoxBottom}>
                                                    <Text>{item.fName?item.fName: '--'}</Text>
                                                    <View style={[styles.currentState,{backgroundColor: item.fEnable? "#227D51"  :"#E0E0E0"}]}></View>
                                                </View>
                                            </TouchableOpacity>)
                                        }): <Text style={{width,height: 30,textAlign: "center",alignContent: "center",color: "#999"}}>无摄像头</Text>
                            }
                            
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
        backgroundColor: '#F4F4F8',
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
