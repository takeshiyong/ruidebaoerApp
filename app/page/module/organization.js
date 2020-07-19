import React, { Component } from 'react';
import { StyleSheet, StatusBar,BackHandler, Text, View ,TouchableOpacity, Dimensions, Platform, Image, ScrollView, TextInput} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import config from '../../config';
import Toast from '../../components/toast';
import {sH, sW, sT, barHeight, navHeight} from '../../utils/screen';
import Header from '../../components/header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const navStyle = navHeight();
const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
class Organization extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });

    componentDidMount() {
        // 启动监听该页面
        // this.viewDidAppear = this.props.navigation.addListener(
        //     'didFocus',
        //     (obj)=>{
        //         BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        //     }
        // )
        // this.didBlurSubscription = this.props.navigation.addListener(
        //     'willBlur',
        //     (obj)=>{
        //         BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        //     }
        // )
    }

    onBackAndroid = () => {  
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            return false;
        }
        this.lastBackPressed = Date.now();
        Toast.show('再按一次退出应用');
        return true;
    }

    componentWillUnmount() {
        if (this.viewDidAppear) {
            this.viewDidAppear.remove();
        }
        if (this.didBlurSubscription) {
            this.didBlurSubscription.remove();
        }
    }

    render() {
        return (
            // this.props.navigation.navigate("Organize")
            <View style={styles.container}>
                <Header
                    leftBtn={
                        <TouchableOpacity style={[{marginLeft: 13,position: 'relative'}]} onPress={()=>this.props.navigation.navigate('Message')}>
                            <Image source={require('../../image/index/notification.png')}></Image>
                            {this.props.messageInfo ? <View style={styles.tipMsg}/> : null}
                        </TouchableOpacity>
                    }
                 titleText="企业" props={this.props}/>
                <View style={styles.topBar}>
                    {/* <View style={styles.barInput}>
                        <Feather name={'search'} size={14} style={{ color: '#696A6C', lineHeight: 30,marginRight: 5}} />
                        <TextInput  
                            style={{padding: 0,flex: 1, height: "100%", flex: 9, fontSize: 14}}
                            placeholder={"搜索"}
                            allowFontScaling={true}
                            
                        />
                    </View> */}
                    <View style={styles.barItems}>
                        <TouchableOpacity style={styles.barItem} onPress={()=>this.props.navigation.navigate('BylawItems')}>
                            <AntDesign name={'book'} size={25} style={{ color: '#54B7FB' }}/>
                            <Text style={styles.itemText}>规章制度</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.barItem}>
                            <SimpleLineIcons name={'present'} size={25} style={{ color: '#54B7FB' }}/>
                            <Text style={styles.itemText}>奖惩公示</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.barItem} onPress={() => this.props.navigation.navigate('SafeMange')}>
                            <MaterialCommunityIcons name={'alarm-light-outline'} size={25} style={{ color: '#54B7FB' }}/>
                            <Text style={styles.itemText}>安全目标</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.title}>
                        <View style={styles.img}>
                            <FontAwesome name={"sitemap"} color={"white"} size={25}/>
                        </View>
                        <Text style={styles.titleName}>部门成员</Text>
                    </View>
                    <TouchableOpacity style={styles.cItem} onPress={()=>this.props.navigation.navigate('OrganizeList')}>
                        <View style={styles.cImg}>
                            <FontAwesome name={"sitemap"} color={"#36CA8B"} size={23}/>
                        </View>
                        <View style={{borderBottomColor: "rgba(225, 225, 225, .7)",flex: 1,
                          height: "100%",}}>
                            <Text style={styles.cTitleName}>组织架构</Text>
                        </View>

                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.cItem}>
                        <View style={styles.cImg}>
                        <FontAwesome name={"home"} color={"#3CADFB"} size={23}/>
                        </View>
                        <View style={{borderBottomColor: "rgba(225, 225, 225, .7)",borderBottomWidth: 1,flex: 1,
                          height: "100%",}}>
                            <Text style={[styles.cTitleName,styles.cbottom]}>企业</Text>
                        </View>
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    headers: {
        position: "relative",
        backgroundColor: config.mainColor,
        paddingTop: isAndroid ? StatusBar.currentHeight : navStyle.paddingTop,
        borderTopWidth: sT(2),
        height: navStyle.height,
        display: 'flex',
        flexDirection: "row"
    },
    headerCenter: {
        flex: 1,
        textAlign: "center",
        justifyContent: 'center',
        alignItems: 'center',

    },
    tipMsg: {
        width: 8,
        height: 8,
        borderRadius: 50,
        backgroundColor: 'red',
        position: 'absolute',
        bottom: 2,
        left: 14
    },
    headerRight: {
        position: "absolute",
        right: 20,
        bottom: 0
    },
    topBar:{
        width,
        height: 90,
        backgroundColor: "white",
        justifyContent: 'center',
        alignItems: 'center',
        // shadowOffset: {  height: 100 },
        // shadowOpacity: 0.8,
        // shadowRadius: 6,
    },
    barInput:{
        height: 30,
        paddingLeft: 10,
        width: width-30,
        borderRadius: 4,
        backgroundColor: "#EDEDED",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15
    },
    barItems:{
        width: width,
        paddingLeft: 18,
        display: "flex",
        height: 94,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    barItem: {
        width: 60,
        marginRight: 25,
        alignItems: "center"
    },
    itemText: {
        marginTop: 10,
        fontSize: 14,
        color: "#666666"
    },
    content: {
        width,
        backgroundColor: "white",
        marginTop: 17
    },
    title: {
        display: "flex",
        height: 78,
        paddingLeft: 19,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(225, 225, 225, .7)",
        flexDirection: "row",
        alignItems: "center"
    },
    img: {
        width: 42,
        height: 42,
        backgroundColor: "#54B7FB",
        marginRight: 17,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center"
    },
    titleName: {
        color: "#666666",
        fontSize: 16,
    },
    cItem: {
        height: 58,
        width,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
    },
    cImg: {
        width: 72,
        height: "100%",
        paddingLeft: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    cTitleName: {
        flex: 1,
        height: "100%",
        paddingLeft: 8,

        fontSize: 16,
        color: "#666666",
        lineHeight: 58,
    },
    cbottom: {
        borderBottomWidth: 0,
    }
});

const mapStateToProps = state => {
    return {
      messageInfo: state.userReducer.messageInfo,
      fEmployeeId: state.userReducer.userInfo.fEmployeeId
    }
}
export default connect(
    mapStateToProps,
)(Organization);
