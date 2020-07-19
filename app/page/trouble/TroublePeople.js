import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, TextInput, Linking} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SplashScreen from 'react-native-splash-screen';
import moment from 'moment';
import { connect } from 'react-redux';

import Header from '../../components/header';
import Toast from '../../components/toast';
import LevelShow from '../../components/levelShow';
import ConfirmModal from '../../components/confirmModal';
import AppendixUpload from '../../components/AppendixUpload/appendixUpload';
import troubleService from '../../service/troubleService';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import { handlePhotoToJs, parseDate } from '../../utils/handlePhoto';
import config from '../../config/index';
import SelectPeople from '../../components/selectPeople';

const {width, height} = Dimensions.get('window');
class TroublePeople extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null,
        
    });

    state = {
      type: 1,
      value: [],
      picArr: [],
      detail: [],
      confirmOperation: 0, // 不显示
      showModal: false,
      selectPeople: null,
      handleArr: [],
      fileArr: [],
      selectPeopleArr: [], // 数据结构 [{fId: , fUserName}]
      items: {}
    }

    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state.params && this.props.navigation.state.params.item) {
        // this.chooseItem(this.props.navigation.state.params.depId);
        this.getTrounbleDetail(this.props.navigation.state.params.item);
        this.setState({
            items:this.props.navigation.state.params.item
        })
        console.log('item', this.props.navigation.state.params.item)
      }
    }

    // 通过fid获取详情数据
    getTrounbleDetail = async (item) => {
      global.loading.show();
      const res = await troubleService.selectPeopleById(item.fId);
      console.log('res', res);
      global.loading.hide();
      if (res.success) {
          this.setState({
              detail: res.obj,
          });
      } else {
          Toast.show(res.msg);
      }
    }

    peopleComponent = (props) => {
        return (
            <View style={[styles.row, {backgroundColor: '#fff'}]}>
                <View style={[styles.col,{flex: 3}]}>
                    <Text>{props.typeName}</Text>
                </View>
                <View style={[styles.col,{flex: 2}]}>
                    <Text>{props.userName||'--'}</Text>
                </View>
                <View style={[styles.col,{flex: 3}]}>
                    <Text>{props.date}</Text>
                </View>
            </View>
        )
    }

    renderPeople = (item) => {
        const { items } = this.state;
        let num = '';
        if (item.fDealNumber > 1) {
            num = item.fDealNumber+'次';
        }
        return (
            <View style={{width: '100%',marginBottom: 10}}>
                {item.fDealNumber > 1 ? null : this.peopleComponent({typeName: num+'上报人',userName: items.fReportUserName, date: parseDate(items.fReportTime, 'YYYY.MM.DD HH:mm')})}
                {item.fDealNumber > 1 ? null : this.peopleComponent({typeName: num+'审核人',userName: item.fAuditUserName, date: parseDate(item.fAuditTime, 'YYYY.MM.DD HH:mm')})}
                {this.peopleComponent({typeName: num+'研判人',userName: item.fIssueUserName, date: parseDate(item.fIssueTime, 'YYYY.MM.DD HH:mm')})}
                {
                    item.fState > 3 && item.fState != 9 && item.fState !=7 ? // 确认
                    this.peopleComponent({typeName: num+'确认人',userName: item.fDutyUserName, date: parseDate(item.fAcceptTime, 'YYYY.MM.DD HH:mm')}) : null
                }
                {
                    item.fState == 7 ?  // 确认
                    this.peopleComponent({typeName: num+'拒绝人',userName: item.fDutyUserName, date: parseDate(item.fAcceptTime, 'YYYY.MM.DD HH:mm')}) : null
                }
                {
                    item.fState == 10 ? 
                    this.peopleComponent({typeName: num+'撤销人',userName: item.fRevocationUserName, date: parseDate(item.fRevocationTime, 'YYYY.MM.DD HH:mm')}): null
                }
                {
                    item.fState == 5 || item.fState == 6 || item.fState == 8 ? 
                    this.peopleComponent({typeName: num+'完成提交人',userName: item.fActualFinishUserName, date: parseDate(item.fActualFinishTime, 'YYYY.MM.DD HH:mm')}): null
                }
                {
                    item.fState == 8 ? 
                    this.peopleComponent({typeName: num+'复查不通过人',userName: item.fReviewUserName, date: parseDate(item.fReviewTime, 'YYYY.MM.DD HH:mm')}): null
                }
                {
                    item.fState == 6 ? 
                    this.peopleComponent({typeName: num+'复查通过人',userName: item.fReviewUserName, date: parseDate(item.fReviewTime, 'YYYY.MM.DD HH:mm')}): null
                }
            </View>
            
        )
    }

    render() {
        const { detail } = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText={'隐患相关人'}
                    hidePlus={false} 
                />
                <ScrollView style={{width: '100%'}}>
                    <View style={[styles.row, {backgroundColor: '#F4F4F8'}]}>
                        <View style={[styles.col,{flex: 3}]}>
                            <Text>类型</Text>
                        </View>
                        <View style={[styles.col,{flex: 2}]}>
                            <Text>人员</Text>
                        </View>
                        <View style={[styles.col,{flex: 3}]}>
                            <Text>时间</Text>
                        </View>
                    </View>
                    {detail.map((data)=>{
                        return this.renderPeople(data);
                    })}
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
  troubleLevelParam: state.troubleReducer.troubleLevelParam,
  troubleTypeParam: state.troubleReducer.troubleTypeParam
});

export default connect(mapStateToProps)(TroublePeople);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        width: '100%'
    },
    col: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      width: '100%',
      paddingLeft: 15,
      paddingRight: 15
    },
});
