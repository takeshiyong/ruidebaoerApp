import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image} from 'react-native';
import Header from '../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CollegeServer from '../../service/collegeServer';
import config from '../../config/index';
import Toast from '../../components/toast';

const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        dataSource: []
    }
    componentDidMount() {
        this.getSelectListByCondition()
    }
    //分页查询课程信息
    getSelectListByCondition = async () => {
        global.loading.show();
      const res = await  CollegeServer.getSelectList({
        pageCurrent: 1,
        pageSize: 2
      })
      global.loading.hide();
      if(res.success){
        this.setState({
            dataSource: res.obj.items
        })
      }else{
          console.log('分页查询课程',res.msg)
        Toast.show(res.msg);
      }
    }
    render() {
        const { goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header
                    backBtn={true}
                    titleText="砂石学院"
                    hidePlus={false}
                    props={this.props}
                />
                <ScrollView>
                    <View style={styles.content}>
                        <View style={styles.banner}>
                            <Image style={styles.bannerImage} source={require('../../image/college/bannerImage.png')}/>
                        </View>
                        <View style={styles.bar}>
                            <View style={styles.navBar}>
                                <TouchableOpacity style={styles.BarItem} onPress={() => this.props.navigation.push('TestList')}>
                                    <Image style={styles.barCon} source={require('../../image/college/securityConference.png')}/>
                                    <Text style={styles.barTitle}>考试</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.BarItem} onPress={() => this.props.navigation.push('Curriculum')}>
                                    <Image style={styles.barCon} source={require('../../image/college/securityCheck.png')}/>
                                    <Text style={styles.barTitle}>课程</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.BarItem}>
                                    <Image style={styles.barCon} source={require('../../image/college/hiddenTrouble.png')}/>
                                    <Text style={styles.barTitle}>案例</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.BarItem}>
                                    <Image style={styles.barCon} source={require('../../image/college/accidentManagement.png')}/>
                                    <Text style={styles.barTitle}>认证</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.news}>
                            <View style={styles.newsTitle}>
                                <Image style={styles.newsTitleName} source={require('../../image/college/newsTitle.png')}/>
                            </View>
                            <View style={styles.newsCon}>
                                <View style={styles.titleNews}>
                                    <Image style={styles.titleName} source={require('../../image/college/news.png')}/>
                                    <TouchableOpacity>
                                        <Text numberOfLines={1} style={[styles.titleDes,{width: width-150}]} onPress={() =>{this.props.navigation.navigate('News')}}>2019年7月19日全国砂石科技大会召开</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.titleNews}>
                                    <Image style={styles.titleName} source={require('../../image/college/college.png')}/>
                                    <TouchableOpacity>
                                        <Text numberOfLines={1} style={[styles.titleDes,{width: width-150}]} onPress={() =>{this.props.navigation.navigate('News')}}>砂石学院第一期管理培训10月中旬开始报名</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {this.state.dataSource.length !== 0 
                            ? 
                            <View style={styles.course}>
                                <Text style={styles.courseTitle}>推荐好课</Text>
                                {this.state.dataSource.map((item) => {
                                    return  <TouchableOpacity style={styles.courseItem} onPress={() => this.props.navigation.push('Course',{id: item.fCourseId})}>
                                    <Image style={styles.cItemImg} source={{uri: (config.imgUrl+item.fCourseCoverFile.fFileLocationUrl)}}/>
                                    <View style={styles.imgDes}>
                                        <Text style={styles.imgTitleName} numberOfLines={2} ellipsizeMode="tail">{item.fCourseName ? item.fCourseName : "--"}</Text>
                                        <View style= {{flexDirection: "row"}}>
                                            {item.fLabelList ? 
                                                item.fLabelList.map((item) => {
                                                   return <View style={styles.classView}>
                                                            <Text style={{color: '#719DEA', fontSize: 9}}>{item.fLabelName ? item.fLabelName : "--"}</Text>
                                                          </View>
                                                }) :null
                                            }
                                            
                                        </View>
                                        <Text style={styles.imgTitlePeople}>15480人已学习</Text>
                                    </View>
                            </TouchableOpacity>
                            })}
                            </View>
                        : null
                        }
                        
                        <View style={styles.collegeList}>
                            <TouchableOpacity style={styles.collegeListHeader}>
                                <Text style={styles.courseTitle}>学院精英榜</Text>
                                <View style={{display: "flex", flexDirection: "row",marginRight: -4}}>
                                    <Text style={{color: '#D9D9D9',fontSize: 14}}>查看全部</Text>
                                    <AntDesign name={'right'} size={18} style={{ color: '#D9D9D9',marginLeft: 5 }}/>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.listItems}>
                                <View style={styles.listItem}>
                                    <View style={styles.listItem1}>
                                       <Image style={{width: 28, height: 28}} source={require('../../image/college/listitem1.png')} />
                                     </View>
                                    <View style={styles.listItem2}>
                                       <View style={styles.listItemy}>
                                          <Text style={{lineHeight: 50,textAlign: 'center',color: "#FFFFFF",}}>王东</Text>
                                        </View>
                                     </View>
                                    <View style={styles.listItem3}>
                                        <Text style={{textAlign: 'center',color: "#333333",}}>王东</Text>
                                   </View>
                                    <View style={styles.listItem4}>
                                       <Text style={{textAlign: 'right',color:"#333333"}}><Text style={{fontWeight:'800',fontSize:18,paddingRight:10}}>540</Text>学分</Text>
                                    </View>
                                </View>
                                <View style={styles.listItem}>
                                    <View style={styles.listItem1}>
                                       <Image style={{width: 28, height: 28}} source={require('../../image/college/listitem2.png')} />
                                     </View>
                                    <View style={styles.listItem2}>
                                       <View style={styles.listItemy}>
                                          <Text style={{lineHeight: 50,textAlign: 'center',color: "#FFFFFF",}}>张誉</Text>
                                        </View>
                                     </View>
                                    <View style={styles.listItem3}>
                                        <Text style={{textAlign: 'center',color: "#333333",}}>张誉</Text>
                                   </View>
                                    <View style={styles.listItem4}>
                                       <Text style={{textAlign: 'right',color:"#333333"}}><Text style={{fontWeight:'800',fontSize:18,paddingRight:5}}>510</Text>学分</Text>
                                    </View>
                                </View>
                                <View style={styles.listItem}>
                                    <View style={styles.listItem1}>
                                       <Image style={{width: 28, height: 28}} source={require('../../image/college/listitem3.png')} />
                                     </View>
                                    <View style={styles.listItem2}>
                                       <View style={styles.listItemy}>
                                          <Text style={{lineHeight: 50,textAlign: 'center',color: "#FFFFFF",}}>李东</Text>
                                        </View>
                                     </View>
                                    <View style={styles.listItem3}>
                                        <Text style={{textAlign: 'center',color: "#333333",}}>李东</Text>
                                   </View>
                                    <View style={styles.listItem4}>
                                       <Text style={{textAlign: 'right',color:"#333333"}}><Text style={{fontWeight:'800',fontSize:18,paddingRight:5}}>470</Text>学分</Text>
                                    </View>
                                </View>
                                <View style={styles.listItem}>
                                    <View style={styles.listItem1}>
                                       <View style={{width:28,height:28}}>
                                            <Text style={{color: "#666666",textAlign: 'center',fontWeight:'800'}}>4</Text>
                                       </View>
                                     </View>
                                    <View style={styles.listItem2}>
                                       <View style={styles.listItemy}>
                                          <Text style={{lineHeight: 50,textAlign: 'center',color: "#FFFFFF",}}>云峰</Text>
                                        </View>
                                     </View>
                                    <View style={styles.listItem3}>
                                        <Text style={{textAlign: 'center',color: "#333333",}}>屈云峰</Text>
                                   </View>
                                    <View style={styles.listItem4}>
                                       <Text style={{textAlign: 'right',color:"#333333"}}><Text style={{fontWeight:'800',fontSize:18,paddingRight:5}}>460</Text>学分</Text>
                                    </View>
                                </View>
                                <View style={styles.listItem}>
                                    <View style={styles.listItem1}>
                                       <View style={{width:28,height:28}}>
                                            <Text style={{color: "#666666",textAlign: 'center',fontWeight:'800'}}>5</Text>
                                       </View>
                                     </View>
                                    <View style={styles.listItem2}>
                                       <View style={styles.listItemy}>
                                          <Text style={{lineHeight: 50,textAlign: 'center',color: "#FFFFFF",}}>明明</Text>
                                        </View>
                                     </View>
                                    <View style={styles.listItem3}>
                                        <Text style={{textAlign: 'center',color: "#333333",}}>贺明明</Text>
                                   </View>
                                    <View style={styles.listItem4}>
                                       <Text style={{textAlign: 'right',color:"#333333"}}><Text style={{fontWeight:'800',fontSize:18,paddingRight:5}}>430</Text>学分</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.strategy}>
                                <Text style={[styles.courseTitle,{marginTop: 13}]}>上榜攻略</Text>
                                <View style={styles.strategyItems}>
                                    <TouchableOpacity style={styles.strategyItem}>
                                        <Image style={{width: 28, height: 28}} source={require('../../image/college/collegeks.png')} />
                                        <Text style={styles.strategyItemText}>考试</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.strategyItem}>
                                        <Image style={{width: 28, height: 28}} source={require('../../image/college/collegexx.png')} />
                                        <Text style={styles.strategyItemText}>学习</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.strategyItem}>
                                        <Image style={{width: 28, height: 28}} source={require('../../image/college/collegerz.png')} />
                                        <Text style={styles.strategyItemText}>认证</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
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
        backgroundColor: '#F4F4F4',
        display: "flex"
    },
    content: {
        backgroundColor: '#FFF',
        display: "flex",
        flexDirection: "column",
    },
    banner: {
        width,
    },
    bannerImage: {
        width: width-30,
        height: 162,
        marginTop: 20,
        marginLeft: 15,
        borderRadius: 5,
    },
    bar: {
        height: 102,
        width,
        justifyContent: "center",
        alignItems: "center",
    },
    navBar: {
        width: width-30,
        height: 102,
        // shadowOpacity: 0.8,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    BarItem: {
        alignItems: "center",
        justifyContent: "center"
    },
    barCon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#3CB6FC"
    },
    barTitle: {
        color: "#666666",
        fontSize: 16,
        marginTop: 5,
    },
    classView: {
        borderWidth: 1,
        borderColor: '#719DEA',
        width: 50,
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: 4,
        borderBottomRightRadius: 4,
        marginRight: 3
    },
    // news
    news: {
        height: 70,
        width: width-30,
        marginLeft: 15,
        paddingLeft: 10,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#F6F6F6",
        borderRadius: 5,
        lineHeight: 20,
    },
    newsTitle: {
        width: 38,
        marginRight:8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    newsTitleName: {
        width: 30,
        height: 31
    },
    newsCon: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    titleNews: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 5,
        marginTop: 5
    },
    titleName: {
        width: 40,
        height: 14,
        marginTop: 2,
        marginRight: 10,
    },
    titleDes: {
        fontSize: 12,
        color: "#666"
    },
    //course
    course: {
        marginTop: 14,
        width,
        paddingLeft: 15,
        paddingRight: 15
    },
    courseTitle: {
        color: "#333333",
        fontSize: 16,
    },
    courseItem: {
        marginTop: 15,
        display: "flex",
        width: "100%",
        flexDirection: "row",
        alignItems: "center"
    },
    cItemImg: {
        width: 150,
        height: 94,
        borderRadius: 5,
        marginRight: 13,
    },
    imgDes: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        height: 94,
        justifyContent: "space-between"
    },
    imgTitleName: {
        color: "#333333",
        fontSize: 14,
        width: "100%",
        lineHeight: 23
    },
    imgTitleFree: {
        width: 48,
        height: 14,
        marginTop: 7
    },
    imgTitlePeople: {
        color: "#999",
        fontSize: 12,
        marginTop: 4
    },
    //
    collegeList: {
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 10,
    },
    collegeListHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 46,
        alignItems: "center",
    },
     listItems: {
        width,
    },
    listItem: {
        display: "flex",
        flexDirection: "row",
        height: 80,
        alignItems: "center",
        width:width - 30,
    },
    listItem1: {
        width:'10%',
    },
    listItem2: {
        width:'15%',
        marginLeft:'2%'
    },
    listItemy: {
        width:50,
        height:50,
        backgroundColor: "#4058FD",
        borderRadius:30,
        display: "flex",

        justifyContent:'center',
        alignItems: "center",
    },
    listItem3: {
        width:'15%',
        marginLeft:'4%'
    },
    listItem4: {
        width:'54%',
    },
    collegeTitleName: {
        color: "#7C868F",
        fontSize: 14,
        fontWeight: "600",
        flex: 1,
        justifyContent: "center",
        textAlign: "center"
    },
    listItemName: {
        color: "#7C868F",
        fontSize: 14,
        flex: 1,
        justifyContent: "center",
        textAlign: "center"
    },
    strategy: {


    },
    strategyItems: {
        height: 100,
        display: "flex",
        flexDirection: "row",
        marginBottom:8,
        justifyContent: "space-between",
        alignItems: "center"
    },
    strategyItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent:'center',
        alignItems: "center",
        width:'30%',
        height:80,
        borderRadius: 5,
        backgroundColor: "#F6F6F6"
    },
    strategyItemText:{
        fontSize: 14,
        color: "#333333",
        marginLeft:3
    }
});
