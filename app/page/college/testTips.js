import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView,Modal, Image, TextInput,FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import TipModal from '../../components/tipModal';

import collegeServer from '../../service/collegeServer';
import Toast from '../../components/toast';
import Header from '../../components/header';

const {width, height} = Dimensions.get('window');
export default class TestDetail extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    
    constructor(props) {
      super(props);
      this.state = {
        showModal: false,
        dataSourse: [],
        bottomObj: {}
      }
    }

    componentDidMount() {
      SplashScreen.hide();
      if(this.props.navigation.state.params&&this.props.navigation.state.params.paperId){
        this.init();
      }
    }
    init = () => {
      this.selectUserExam(this.props.navigation.state.params.paperId);
      this.selectExamSubjects(this.props.navigation.state.params.paperId)
    }
    //底部信息
    selectUserExam = async (id) => {
      const res = await collegeServer.selectUserExam(id)
      if(res.success){
        this.setState({
          bottomObj: res.obj
        })
      }else{
        console.log(res.msg);
      }
    }
    //查询试卷关联的题目
    selectExamSubjects = async (id) => {
      const res = await collegeServer.selectExamSubjects(id)
      if(res.success){
        this.setState({
          dataSourse: res.obj
        })
      }else{
        console.log(res.msg);
      }
    }
    touchThisTest = (item) => {
      global.loading.show();
      this.props.navigation.state.params.selectSubjectDetail(this.props.navigation.state.params.paperId,item.fSubjectId);
      global.loading.hide();
      this.props.navigation.pop()
    }
    restart = async() => {
      global.loading.show();
      const res = await collegeServer.restartExam(this.props.navigation.state.params.paperId);
      global.loading.hide();
      if(res.success){
        Toast.show(res.msg)
        this.setState({
          showModal: false
        },() => {
          this.init();
        })
      }else{
        Toast.show(res.msg)
        console.log(res.msg);
      }
    }
    render() {
      return (
        <View style={styles.container}>
          <Header
              backBtn={true}
              titleText="答题模式"
              hidePlus={false}
              onRefresh={this.props.navigation.state.params.init}
          />
          <View style={[styles.footerView, styles.rowCenter]} onPress = {() => {this.props.navigation.navigate('TestTips')}}>
              <View style={[styles.circleView, {backgroundColor: '#51ACF3'}]}>
                    <AntDesign name="check" size={10} color={'#fff'}/>
                  </View>
                  <Text style={[{color: '#51ACF3',marginRight: 20},styles.numText]}>{this.state.bottomObj.fCorrectSubjectNumber != null?this.state.bottomObj.fCorrectSubjectNumber: '--' }</Text>
                  <View style={[styles.circleView, {backgroundColor: '#E85A52'}]}>
                    <AntDesign name="close" size={10} color={'#fff'}/>
                  </View>
                  <Text style={[{color: '#E85A52',marginRight: 40},styles.numText]}>{this.state.bottomObj.fHaveAnswerNumber != null&&this.state.bottomObj.fCorrectSubjectNumber != null?(this.state.bottomObj.fHaveAnswerNumber - this.state.bottomObj.fCorrectSubjectNumber): '--' }</Text>
                  <AntDesign name="appstore-o" size={16}/>
                  <Text style={{marginLeft: 5,fontWeight: 'bold',fontSize: 12}}><Text style={{color: '#000'}}>{this.state.bottomObj.fHaveAnswerNumber != null?this.state.bottomObj.fHaveAnswerNumber: '--' }</Text>/{this.state.bottomObj.fSubjectNumber != null?this.state.bottomObj.fSubjectNumber: '--' }</Text>
              </View>
          <View style={{padding: 10,alignItems: "flex-end"}}>
              <TouchableOpacity style={{flexDirection: "row",alignItems: "center"}} onPress={() => {this.setState({showModal: true})}}>
                <Ionicons name="md-refresh" size={18}/>
                <Text style={{marginLeft: 5,fontSize: 14}}>重新开始</Text>
              </TouchableOpacity>
          </View>
          <TipModal 
                showModal={this.state.showModal}
                onCancel={()=>{this.setState({showModal: false})}}
                onOk={() => this.restart()}
                tipText={`您确定要重新开始吗？`}
            />
            <ScrollView >
                <View style={{flexDirection: "row",flexWrap: "wrap",backgroundColor: "#fff",padding:10,}}>
                    {
                        this.state.dataSourse.length != 0?this.state.dataSourse.map((item,index) => {
                            return(<TouchableOpacity style={[styles.touchBtn,{marginLeft: index == 10 || String(index/5).indexOf('.') == -1 ? 10 : 35}]} onPress={() => {this.touchThisTest(item)}}>
                                {
                                  item.tUserExamDetailList.length == 0?
                                  <View style={[styles.linearGradient, {borderWidth: 1,borderColor: '#E1E1E1'}]}>
                                    <Text style={{color: '#E1E1E1'}}>{index+1}</Text>
                                  </View>: 
                                  <View style={[styles.linearGradient, {borderWidth: 1,borderColor: item.tUserExamDetailList[0].fResult == 1?'#51ACF3' : '#E85A52',backgroundColor: item.tUserExamDetailList[0].fResult == 1?'#51ACF3' : '#E85A52'}]}>
                                    <Text style={{color: '#fff'}}>{index+1}</Text>
                                  </View>
                                } 
                            </TouchableOpacity>)
                        }): null
                    }
                    
                </View>
            </ScrollView>
          
        </View>
      );
    }
}

const styles = StyleSheet.create({
    // E85A52 红色  51ACF3 蓝色 E1E1E1灰色
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6',
      display: "flex",
    },
    footerView: {
        width,
        justifyContent: 'flex-end',
        height: 45,
        borderTopWidth: 1,
        borderTopColor: '#DFDFDF',
        paddingRight: 15,
        paddingLeft: 15,
        backgroundColor: "#fff"
      },
      rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      itemView: {
        width: width-20,
        marginRight: 10,
        marginLeft: 10,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#51D292',
        justifyContent: 'space-between',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        
      },
      modalStyle: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        alignItems: 'center',
      },
      circleView: {
        width: 15,
        height: 15,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
      }, 
      numText: {
        marginLeft: 5,
        fontWeight: 'bold',
        fontSize: 12,
      },
      touchBtn: {
        flexDirection: 'row', 
        // paddingRight: 15, 
        // paddingLeft: 15,
        marginLeft: 15,
        // marginBottom: 15
    },
    linearGradient: {
       width: 45,
       height: 45,
       borderRadius: 50,
       alignItems: 'center',
       justifyContent: 'center'
    }, 
});
