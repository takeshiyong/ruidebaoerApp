import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, ImageBackground,ActivityIndicator, FlatList,RefreshControl} from 'react-native';
import Header from '../../components/header';
import Toast from '../../components/toast';
import config from '../../config/index';


const PAGESIZE = 10;
const {width, height} = Dimensions.get('window');
export default class ShopPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allType:['aaaa','asas','asasa',4],
            current: 0,
            videoSource: [1,2,3],
        };
      }

    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    
    componentDidMount() {
        if (this.props.navigation.state && this.props.navigation.state.params.item) {
            this.setData(this.props.navigation.state.params.item)
          }
    }
    setData = (item) => {
        let allType = [...item.fVideoAreaList];
        this.setState({
            allType
        })

    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    backBtn={true}
                    titleText="高点设备"
                    props={this.props}
                    isMine={true}
                />
                    <View style={styles.tabBar}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{display: "flex", flexDirection:"row"}}>
                                {this.state.allType.length > 0 ? this.state.allType.map((item,index) => {
                                    return <TouchableOpacity index={index} onPress={() => {this.setState({current: index})}}>
                                        <View style={[styles.barText,index == this.state.current ? {color: "#FFFFFF",backgroundColor: '#4058FD'}:{color: "#333333"}]}>
                                            <Text style={[{fontSize: 16, fontWeight: "500"} ,index == this.state.current ? {color: "#FFFFFF"}:{color: "#333333"}]}>{item.fName?item.fName: '--'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                }): <Text style={{width: '100%',height: '100%',textAlign: "center",alignContent: "center",color: "#999"}}>暂无分类</Text>}
                            </View>
                        </ScrollView>
                    </View>
                    <View style={styles.videoBoxs}>
                    {
                        this.state.allType[this.state.current]&&this.state.allType[this.state.current].fVideoChannelConfigList&&this.state.allType[this.state.current].fVideoChannelConfigList.length > 0 ?this.state.allType[this.state.current].fVideoChannelConfigList.map((item) => {
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
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F8',
    },
    videoBox: {
        width: (width-42)/2,
        height: 141,
        marginBottom: 15,
        marginLeft: 14

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
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
    },
    barText: {
        height: 30,
        marginRight: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center"
    },
    tabBar: {
        backgroundColor: "#fff",
        padding: 10,
        borderBottomColor: "#E1E1E1",
        borderBottomWidth: 1,
        marginBottom: 10
    },
});
