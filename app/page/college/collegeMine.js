import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions,ImageBackground, TouchableOpacity, ScrollView} from 'react-native';
import Header from '../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import Integral from '../../service/integralServer';
import carshopsServer from '../../service/collegeServer';
import config from '../../config';

const {width, height} = Dimensions.get('window');
class Mine extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        videoSourse: [],
        fAllIntegral:0,
        obj: {},
        courseObj: []
    }
    toDetail = (id) => {      
        this.props.navigation.navigate('PhotographEdit', { id });
    }
    componentDidMount() {
        this.getIntegralRules();
        this.statisticsLearnCondition();
        this.selectLearnedCourseWare();
    }
    //积分明细接口
    getIntegralRules = async () => {
        const res = await Integral.getIntegralRules({
            pageCurrent: 1,
            pageSize: 10,
            userId: this.props.userInfo.fId
        })
        if(res.success){
            this.setState({
                fAllIntegral: res.obj.fAllIntegral
            })
        }else{
            console.log('积分明细',res.msg);
            // Toast.show(res.msg)
        }
    }
     //统计培训学习情况
    statisticsLearnCondition = async () => {
        const res = await carshopsServer.statisticsLearnCondition()
        if(res.success){
            this.setState({
                obj: res.obj
            })
            console.log('学习情况',res);
        }else{
            console.log('学习情况',res.msg);
            // Toast.show(res.msg)
        }
    }
    //查询最近学习课件所属课程
    selectLearnedCourseWare = async () => {
        const res = await carshopsServer.selectLearnedCourseWare()
        if(res.success){
            this.setState({
                videoSourse: res.obj
            })
            console.log('课程情况',res);
        }else{
            console.log('课程情况',res.msg);
            // Toast.show(res.msg)
        }
    }
    render() {
        const { userInfo, userIntegral } = this.props;
        const { obj } = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="我的"
                    hidePlus={true} 
                    props={this.props}
                    isMine={true}
                />
                <ImageBackground  source={require('../../image/cultivate/background.png')} style={styles.topBackground} >
                    <View style={styles.topHeader}>
                        <Image source={require('../../image/cultivate/header.png')} style={{width: 46,height: 46,marginRight: 13}}/>
                        <View>
                            <Text style={{color: "#fff",fontSize: 16,fontWeight: "500"}}>{userInfo ? userInfo.fUserName : ''}</Text>
                            <Text style={{color: "rgba(255, 255, 255, 0.8)",fontSize: 12,marginTop: 3}}>{userInfo ? userInfo.fDepName : ''}</Text>
                        </View>
                    </View>
                    <View style={styles.bottomAbout}>
                        <View style={styles.aboutText}>
                            <Text style={styles.topText}>{obj.learnedCourseNumber!= null?obj.learnedCourseNumber: '--'}课程</Text>
                            <Text style={styles.bottomText}>学完</Text>
                        </View>
                        <View style={styles.aboutText}>
                            <Text style={styles.topText}>{obj.learnedTimeLong!=null?obj.learnedTimeLong: '--'}分钟</Text>
                            <Text style={styles.bottomText}>学习时长</Text>
                        </View>
                    </View>
                </ImageBackground>
                <ScrollView>   
                    <View style={styles.items}>
                        <TouchableOpacity style={styles.item} >
                            <View style={styles.itemAbout}>
                                <Image source={require("../../image/cultivate/fuwuxing.png")}/>
                                <Text style = {styles.itemText}>我的积分</Text>
                            </View>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Text>{this.state.fAllIntegral}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.item} >
                            <View style={styles.itemAbout}>
                                <Image source={require("../../image/cultivate/baocun.png")}/>
                                <Text style = {styles.itemText}>我的下载</Text>
                            </View>
                            <AntDesign name={'right'} size={15} style={{ color: '#CFCFCF' }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.push('MoreList',{videoSourse: this.state.videoSourse})}>
                            <View style={styles.itemAbout}> 
                                <Image source={require("../../image/cultivate/gongdan.png")}/>
                                <Text style = {styles.itemText}>播放记录</Text>
                            </View>
                            <AntDesign name={'right'} size={15} style={{ color: '#CFCFCF' }} />
                        
                        </TouchableOpacity>
                        <View style={{flexDirection: "row"}}>
                            {
                                this.state.videoSourse.length > 0? 
                                this.state.videoSourse.slice(0,3).map((item) => {
                                    // console.log(11111111111111111111111,item.courseCoverFile.fFileLocationUrl)
                                    return(<TouchableOpacity style={{marginRight: 12,alignItems: "center"}} onPress={() => this.props.navigation.push('Course',{id: item.course.fCourseId})}> 
                                            <Image style={{width: 118,height: 65,backgroundColor: "#D5D5D5",borderRadius: 5}} source={{uri: config.imgUrl + item.courseCoverFile?(item.courseCoverFile.fFileLocationUrl?item.courseCoverFile.fFileLocationUrl: null): null}}/>
                                            <Text numberOfLines={1} style = {[styles.itemText,{width: 118,marginLeft: 0,marginTop: 8}]}>{item.course?(item.course.fCourseName?item.course.fCourseName:'--'): null}</Text>
                                        </TouchableOpacity>)
                                })
                                : <Text>无播放记录</Text>
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
        backgroundColor: '#fff',
        display: "flex"
    },
    topBackground: {
        width: "100%",
        height: 190,
        position: "relative",
    },
    topHeader: {
        bottom: 94,
        left: 20,
        flexDirection: "row",
        position: "absolute",
        alignItems: "center"
    },
    bottomAbout: {
        position: "absolute",
        left: 17,
        bottom: 16,
        height: 60, 
        width: width-34,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
       
    },
    aboutText: {
        flex: 1,
        alignItems: "center",
    },
    topText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500"
    },
    bottomText: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.8)",
        marginTop: 5
    },
    items:{
        marginTop: 12,
        width,
        backgroundColor: "white",
        paddingLeft: 18,
        paddingRight: 16,
    },
    item: {
        height: 50,
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        // borderBottomColor:"#F8F8F9",
        // borderBottomWidth: 1,
        justifyContent: 'space-between',
    },
    itemAbout:{
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',

    },
    itemText:{
        marginLeft: 10,
        fontSize: 14,
        
        color: "#333333"
    }
});

const mapStateToProps = state => ({
    userInfo: state.userReducer.userInfo,
})
export default connect(mapStateToProps)(Mine)