import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { createMaterialTopTabNavigator } from 'react-navigation';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';

import Header from '../../components/header';
import { parseDate } from '../../utils/handlePhoto';
import MessageList from './list';
import troubleService from '../../service/troubleService';

const {width, height} = Dimensions.get('window');
class MessageMain extends Component {
    static navigationOptions = () => ({
        header: ()=> {
            return  null;
        }
    });

    state = {
      messageDetail: {},
      fState: ''
    };

    componentDidMount() {
      console.log(this.props.navigation.state.params.messageDetail)
      if (this.props.navigation.state.params && this.props.navigation.state.params.messageDetail) {
        this.setState({
          messageDetail: this.props.navigation.state.params.messageDetail
        }, ()=> {
          if (this.state.messageDetail.fType == 4) {
            // 查询隐患
            this.getTroubleState();
          } else if (this.state.messageDetail.fType == 5) {
            // 查询会议

          }
          
        });
      }
    }

    // 获取隐患状态
    getTroubleState = async () => {
      const { messageDetail } = this.state;
      global.loading.show();
      const res = await troubleService.selectTroubleStateById(messageDetail.fRelevantInfo);
      global.loading.hide();
      console.log('获取隐患状态',res);
      if (res.success) {
        this.setState({
          fState: res.obj.fState
        })
      } 
    }

    // 跳转页面
    jumpPage = () => {
      const { messageDetail, fState } = this.state;
      const { navigate } = this.props.navigation;
      navigate('MeetingDetails',{id: messageDetail.fRelevantInfo})
    }

    // 按钮文字
    returnBtnText = () => {
      const { fState } = this.state; 
      // 待审核
      if (fState == 1) {
        return '隐患审核'
      }
    }

    render() {
        const { messageDetail,fState  } = this.state;
        const { troubleName } = this.props;
        console.log('messageDetail', messageDetail);
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="消息详情"
                    props={this.props}
                />
                <ScrollView style={{width: '100%'}}>
                  <View style={styles.content}>
                    <Text style={{color: '#333',fontWeight: '500',fontSize: 14}}>{messageDetail.fTitle}</Text>
                    <View style={[styles.rowStyle, {marginTop: 10,marginBottom: 14}]}>
                      <Image source={require('../../image/message/ios-contact.png')}/>
                      <Text style={{fontSize: 12,color: '#999',marginLeft: 5,marginRight: 10}}>
                        {troubleName[messageDetail.fOriginator] || '--'}
                      </Text>
                      <Image source={require('../../image/message/ios-time.png')}/>
                      <Text style={{fontSize: 12,color: '#999',marginLeft: 5,marginRight: 10}}>
                        {parseDate(messageDetail.fSendTime, 'YYYY.MM.DD HH:mm')}
                      </Text>
                    </View>
                    <View style={styles.contentStyle}>
                      <Text style={styles.textContainer}>{messageDetail.fContent}</Text>
                    </View>
                    {
                      messageDetail.fType == 5 ? 
                        <View style={{marginTop: 15,alignItems: 'center'}}>
                          <TouchableOpacity onPress={this.jumpPage}>
                            <Text style={{color: '#4058FD'}}>查看详情</Text>
                          </TouchableOpacity>
                        </View> : null
                    }
                    
                  </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => {
  return {
    troubleName: state.userReducer.troubleName
  }
}

export default connect(mapStateToProps)(MessageMain);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    content: {
      backgroundColor: '#fff',
      paddingRight: 20,
      paddingLeft: 20,
      paddingTop: 20,
      paddingBottom: 20
    },
    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    contentStyle: {
      borderTopColor: '#e0e0e0',
      borderBottomColor: '#e0e0e0',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      paddingTop: 14,
      paddingBottom: 40
    },
    textContainer: {
      color: '#333',
      lineHeight: 20
    }
});
