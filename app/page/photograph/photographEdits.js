import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, Image, ScrollView} from 'react-native';
// import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons'
import DatePicker from 'react-native-datepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

import Toast from '../../components/toast';
import Header from '../../components/header';
import Photograph from '../../components/photograph';
import RenderAsset from '../../components/renderImage/renderAsset';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import troubleService from '../../service/troubleService';

const {width, height} = Dimensions.get('window');
export default class edit extends Component {
  constructor(props){
    super(props);
    this.state = {
      typeName: '',
      typeId: '',
      picArr: [], // 图片数组
      content: '', // 隐患内容
      discoveryTime: moment().format('YYYY-MM-DD HH:mm')
    };
  }
  //设置头部
  static navigationOptions = () => ({
    header: null
  });

  componentDidMount() {
    // 获取上一个页面的问题类型数据
    if (this.props.navigation.state.params) {
      const { typeId, typeName } = this.props.navigation.state.params;
      this.setState({typeName, typeId});
    }
  }

  // 提交随手拍隐患
  comitPhoto = async () => {
    const { typeId, picArr, content, discoveryTime, site } = this.state;
    const { goBack } = this.props.navigation;
    let fileManagementDTOS = [];
    if (!discoveryTime) {
      Toast.show('发现时间不能为空');
      return;
    }
    if (site.trim().length == 0) {
      Toast.show('隐患地点不能为空');
      return;
    }
    if (content.trim().length == 0) {
      Toast.show('隐患内容不能为空');
      return;
    }
    if (picArr.length == 0) {
      Toast.show('隐患图片,视频信息不能为空');
      return;
    }
    
    for (let obj of picArr) {
      if (obj.status == 'success') {
        fileManagementDTOS.push({
          fFileName: obj.fileName,
          fFileLocationUrl: obj.path,
          fType: obj.type
        })
      } else if (obj.status == 'uploading') {
        Toast.show('上传中，请稍后');
        return;
      }
    }
    global.loading.show();
    let fReportTime = discoveryTime.replace(/-/g, '/');
    const res = await troubleService.commitTroubleByPhote({
      fileManagementDTOS,
      fTypeId: typeId,
      fContent: content,
      fReportTime: new Date(fReportTime).getTime(),
      fSite: site
    });
    global.loading.hide();
    if (res.success) {
      Toast.show(res.msg);
      goBack();
    } else {
      Toast.show(res.msg);
    }
  }


  render() {
    const { params } = this.props.navigation.state;
    const { typeName } = this.state;
    return (
      <View style={styles.container}>
        <Header 
          backBtn={true}
          titleText="随手拍"
          hidePlus={true} 
        />
        <ScrollView>
          <View style={{paddingBottom: 20}}>
            <View style={[styles.item,styles.itemUnderLine,{flexDirection: "row",height: 48,alignItems: "center",paddingRight: 30}]}>
                <View style={[styles.rowCenter, {flex: 2}]}>
                    <Image source={require("../../image/troubleDetails/appsBig.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                    <Text style={{color: "#333333", fontSize: 14}}>
                      <Text style={{color: 'red'}}>*</Text>
                      隐患类型
                    </Text>
                </View>
                <Text style={{color: "#666",fontSize: 14,flex: 3,textAlign: 'right'}}>{typeName|| '未选择'}</Text>
            </View>
            <View style={[styles.item,styles.itemUnderLine,{flexDirection: "row",height: 48,alignItems: "center"}]}>
                <View style={[styles.rowCenter, {flex: 2}]}>
                    <Image source={require("../../image/troubleIssue/calendar.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                    <Text style={{color: "#333333", fontSize: 14}}>
                      <Text style={{color: 'red'}}>*</Text>
                      发现时间
                    </Text>
                </View>
                <DatePicker
                    style={{width: 200,marginLeft: -35}}
                    date={this.state.discoveryTime}
                    mode="datetime"
                    placeholder="请选择隐患发现时间"
                    format="YYYY-MM-DD HH:mm"
                    confirmBtnText="确定"
                    cancelBtnText="取消"
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateTouchBody: {
                            borderWidth: 0
                        },
                        dateInput: {
                            marginLeft: 36,
                            borderWidth: 0,
                            alignItems: 'flex-end',
                            paddingRight: 2
                        },
                        dateText: {
                            color: '#4B74FF'
                        },
                        placeholderText: {
                            color: '#4B74FF'
                        }
                    }}
                    iconComponent={<AntDesign name="right" color="#4B74FF"/>}
                    onDateChange={(date) => {this.setState({discoveryTime: date}, ()=>console.log(this.state.discoveryTime))}}
                />
            </View>
            <View style={[styles.item, styles.itemUnderLine]}>
                <View style={[styles.rowCenter,{marginTop: 10,marginBottom: 13}]}>
                    <Image source={require("../../image/troubleIssue/mapMarker.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                    <Text style={{color: "#333333", fontSize: 14}}>
                      <Text style={{color: 'red'}}>*</Text>
                      隐患地点
                    </Text>
                </View>
                <View style={styles.itemUnderLine}>
                  <TextInput
                      style={styles.inputStyle}
                      placeholderTextColor={'#d3d3d3'}
                      placeholder="请填写隐患地点"
                      underlineColorAndroid="transparent"
                      value={this.state.site}
                      multiline={true}
                      onChangeText={(text)=>{
                        this.setState({
                          site: text.trim()
                        });
                      }}
                  />
                </View>
            </View>
            <View style={[styles.item, styles.itemUnderLine]}>
                <View style={[styles.rowCenter,{marginTop: 10,marginBottom: 13}]}>
                    <Image source={require("../../image/troubleDetails/filePencil.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                    <Text style={{color: "#333333", fontSize: 14}}>
                      <Text style={{color: 'red'}}>*</Text>
                      隐患内容
                    </Text>
                </View>
                <View style={styles.itemUnderLine}>
                  <TextInput
                      style={styles.inputStyle}
                      placeholderTextColor={'#d3d3d3'}
                      placeholder="请填写隐患内容"
                      underlineColorAndroid="transparent"
                      value={this.state.content}
                      multiline={true}
                      onChangeText={(text)=>{
                        this.setState({
                          content: text.trim()
                        });
                      }}
                  />
                </View>
                <View style={{flexDirection: "row",marginTop: 22,flexWrap: "wrap",justifyContent: "space-between"}}>
                    <CameraUpload
                      value={this.state.picArr}
                      onChange={(picArr)=>this.setState({picArr})}
                      imgStyle={{width: width*0.26, height: width*0.26}}
                    />
                </View>
            </View>

            <View style={{width: '100%',alignItems: 'center'}}>
              <TouchableOpacity 
                style={styles.sureBtn}
                onPress={()=>this.comitPhoto()}
              >
                  <Text style={{color: '#fff', fontSize: 16}}>提交</Text>
              </TouchableOpacity>
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
    backgroundColor: '#F6F6F6',
    width: '100%'
  },
  itemUnderLine: {
    borderBottomColor: "#F6F6F6",
    borderBottomWidth: 1
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    backgroundColor: "#fff",
    paddingLeft: 16,
    paddingRight: 16,
    width: '100%'
  },
  inputStyle: {
    height: 80,
    padding: 0,
    textAlignVertical: 'top'
  },
  sureBtn: {
    borderRadius: 4,
    width: '95%',
    height: 40,
    backgroundColor: '#4058FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  }
});
