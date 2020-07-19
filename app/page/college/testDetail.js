import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView,Modal, Image, TextInput,FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';

import collegeServer from '../../service/collegeServer';
import Toast from '../../components/toast';
import Header from '../../components/header';

const {width, height} = Dimensions.get('window');
class TestDetail extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    
    constructor(props) {
      super(props);
      this.state = {
        changeShow: false,
        bottomObj: {},
        obj: {},
        showNext: true
      }
    }

    componentDidMount() {
      SplashScreen.hide();
      
      if(this.props.navigation.state.params&&this.props.navigation.state.params.item){
        this.init()
      }
    }
    init =  () => {
      this.selectUserExam();
      this.selectSubjectDetail(this.props.navigation.state.params.item.fId,'')
    }
    //查询第一个未答题目信息
    selectSubjectDetail = async (paperId,subjectId) => {
      const res = await collegeServer.selectSubjectDetail({
        "paperId": paperId,
        "subjectId": subjectId
      })
      if(res.success){
        if(res.obj.tUserExamDetailList.length != 0){
          this.setState({
            changeShow: false,
            obj: res.obj,
            fResult: res.obj.tUserExamDetailList[0].fResult ==1 ? true : false,
            fContent: res.obj.tUserExamDetailList[0].fContent
          })
        }else{
          this.setState({
            obj: res.obj,
            changeShow: true,
            
          })
        }
      }else{
        console.log(res.msg);
      }
    }
    //传递第一个题的答案
    answerSubject = async (item) => {
      console.log(this.state.obj.fSort,this.state.bottomObj.fSubjectNumber)
      
      const res = await collegeServer.answerSubject({
        "fContent": item.fOptiontName,
        "fSort": 1,
        "fSubjectId": item.fSubjectId,
        "paperId": this.props.navigation.state.params.item.fId
      })
      if(res.success){
          this.selectUserExam();
          if(this.state.obj.fSort == this.state.bottomObj.fSubjectNumber){
            this.selectSubjectDetail(this.props.navigation.state.params.item.fId,item.fSubjectId);
            Toast.show("题目已经全部答完");
            return
          }
          if(!res.obj){
            this.setState({
              showNext: false
            },() => {
              this.selectSubjectDetail(this.props.navigation.state.params.item.fId,item.fSubjectId);
            })
            return
          }
          this.selectSubjectDetail(this.props.navigation.state.params.item.fId,'');
      }else{
        Toast.show(res.msg)
        console.log(res.msg);
      }
    }
    getCrrentName = (data) => {
      switch(data){
        case 1:
          return '选择题';
        case 2:
          return '判断题';
        case 3:
          return '填空题';
        case 4:
          return '论述题';
      }
    }
    //底部信息
    selectUserExam = async () => {
      const res = await collegeServer.selectUserExam(this.props.navigation.state.params.item.fId)
      if(res.success){
        this.setState({
          bottomObj: res.obj
        })
      }else{
        console.log(res.msg);
      }
    }
    showNext = () => {
      this.setState({
        showNext: true
      },()=>{this.selectSubjectDetail(this.props.navigation.state.params.item.fId,'');})
    }
    render() {
      return (
        <View style={styles.container}>
          <Header
              backBtn={true}
              titleText="答题模式"
              hidePlus={false}
              onRefresh={this.props.navigation.state.params.onRefresh}
          />
          {
            this.state.obj?
          
          <ScrollView>
            {
              this.state.obj.tSubject?
              <View style={[styles.contentView, {flexDirection: 'row',position: 'relative'}]}>
                <LinearGradient 
                  start={{x: 0.0, y: 0.1}} 
                  end={{x: 1.0, y:0.9}} 
                  colors={['#53C4ED', '#3A7EFB']} 
                  style={[styles.tipIcon,{position: 'absolute', top: 24,left: 15}]}>
                  <Text style={{color: '#fff',fontSize: 9}}>{this.state.obj.tSubject.fType? this.getCrrentName(this.state.obj.tSubject.fType) : "--"}</Text>
                </LinearGradient>
                <Text style={{width: width - 30, fontSize: 18, color: '#000',lineHeight: 30,marginLeft: 5}}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {this.state.obj.tSubject.fContent?this.state.obj.tSubject.fContent:'--'}
                </Text>
            </View> : null
            }
            {
              this.state.obj.tSubjectOptionList&&this.state.obj.tSubjectOptionList.length !== 0?
              (!this.state.changeShow?
              this.state.obj.tSubjectOptionList.map((item) => {
                  return(
                  item.fOptiontName == this.state.fContent?
                  <SelectCircle  flag={this.state.fResult}   index={item.fOptiontName? item.fOptiontName:"--"} text={item.fOptiontContent?item.fOptiontContent: '--'} style={{marginTop: 20}}/>
                  :
                  (item.fOptiontName == this.state.obj.tSubjectAnswerList[0].fAnswer ?
                    <SelectCircle flag={true} index={item.fOptiontName? item.fOptiontName:"--"} text={item.fOptiontContent?item.fOptiontContent: '--'} style={{marginTop: 20}}/>
                    : 
                    <SelectCircle  index={item.fOptiontName? item.fOptiontName:"--"} text={item.fOptiontContent?item.fOptiontContent: '--'} style={{marginTop: 20}}/>))

                }):
              this.state.obj.tSubjectOptionList.map((item) => {
                return(<SelectCircle   onPress={()=>{this.answerSubject(item)}}  index={item.fOptiontName? item.fOptiontName:"--"} text={item.fOptiontContent?item.fOptiontContent: '--'} style={{marginTop: 20}}/>)
              }))
            : null}
            
          </ScrollView>
            : null
          }
          {
          this.state.bottomObj?
            <TouchableOpacity style={[styles.footerView, styles.rowCenter]} onPress = {() => {this.props.navigation.navigate('TestTips',{selectSubjectDetail: this.selectSubjectDetail,paperId:this.props.navigation.state.params.item.fId,init: this.init})}}>
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
            </TouchableOpacity>
          : null}
            {
              !this.state.showNext ?
                <TouchableOpacity style={styles.nextButton} onPress={() => {this.showNext()}}>
                  <AntDesign name="rightcircle" size={45} color={'#4058FD'}/>
                </TouchableOpacity>
              : null
            }
        </View>
      );
    }
}

const FailIcon = () => {
  return (
    <LinearGradient start={{x: 0.0, y: 0.1}} end={{x: 1.0, y:0.9}} colors={['#EE7678', '#F83531']} style={styles.linearGradient}>
      <AntDesign name="close" size={14} color={'#fff'}/>
    </LinearGradient>
  );
}

const SuccessIcon = () => {
  return (
    <LinearGradient start={{x: 0.0, y: 0.1}} end={{x: 1.0, y:0.9}} colors={['#5CC6F6', '#4A9FEE']} style={styles.linearGradient}>
      <AntDesign name="check" size={14} color={'#fff'}/>
    </LinearGradient>
  );
}

const SelectCircle = (props) => {
  let color = "#000";
  if (props.flag != null) {
    color = props.flag ? '#51ACF3' : '#E85A52';
  }
  return (
    <TouchableOpacity 
      style={[{flexDirection: 'row', width, paddingRight: 15, paddingLeft: 15},props.style]}
      onPress={()=>props.onPress && props.onPress()}
    >
      { props.flag == null ?
        <View style={[styles.linearGradient, {borderWidth: 1,borderColor: '#E1E1E1'}]}>
          <Text style={{color: '#000'}}>{props.index}</Text>
        </View> : props.flag ? <SuccessIcon/> : <FailIcon/>
      }
      <Text style={{fontSize: 18, marginLeft: 10, flex: 1, color}}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    // E85A52 红色  51ACF3 蓝色
    container: {
      flex: 1,
      backgroundColor: '#fff',
      display: "flex",
      alignItems: 'center',
    },
    contentView: {
      width,
      paddingTop: 15,
      paddingRight: 15,
      paddingLeft: 15
    },  
    tipIcon: {
      width: 30,
      height: 15,
      borderTopLeftRadius: 5,
      borderBottomRightRadius: 5,
      alignItems: 'center',
      justifyContent: 'center'
    },
    linearGradient: {
      width: 25,
      height: 25,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center'
    },  
    numText: {
      marginLeft: 5,
      fontWeight: 'bold',
      fontSize: 12,
    },
    circleView: {
      width: 15,
      height: 15,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center'
    },  
    footerView: {
      width,
      justifyContent: 'flex-end',
      height: 45,
      borderTopWidth: 1,
      borderTopColor: '#DFDFDF',
      paddingRight: 15,
      paddingLeft: 15
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
    nextButton: {
      borderRadius: 30,
      borderWidth: 1,
      borderColor: "#E0E0E0",
      position: "absolute",
      bottom: 100,
      right: 40,
      alignItems: "center",
      justifyContent: "center"
    }
});

const mapStateToProps = state => ({
 
})

export default connect(mapStateToProps)(TestDetail);