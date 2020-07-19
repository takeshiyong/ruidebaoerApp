import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,RefreshControl,ActivityIndicator,TextInput,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {ECharts} from 'react-native-echarts-wrapper';
import LinearGradient from 'react-native-linear-gradient';

import Header from '../../components/header';
import Radio from '../../components/radio';
import Toast from '../../components/toast';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import deviceServer from '../../service/deviceServer';
import { handlePhotoToJs } from '../../utils/handlePhoto';
const { width, height } = Dimensions.get('window');
export default class DeviceDetail extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      option1: null,
      detail: {},
      detailData: {},
      type: 1, // 1： 巡检 2：设备详情
      choose1: true,
      choose2: true,
      choose3: false,
      choose4: true,
      choose5: true,
      picArr1: [],
      picArr2: [],
      picArr3: [],
      picArr4: [],
      picArr5: [],
      checkItem: [],
      noRun: false
    }

    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state.params && this.props.navigation.state.params.type) {
        this.setState({
          type: this.props.navigation.state.params.type,
          detail: this.props.navigation.state.params.item
        }, () => this.judgeGetDataType())
      }
      
    }

    // 判断该做巡检请求还是设备详情请求
    judgeGetDataType = () => {
        // 页面设备详情
        if (this.props.navigation.state.params) {
          if (this.props.navigation.state.params.type == 2) {
            // 获取设备详情数据
            this.getDeviceDetail();
          } else if (this.props.navigation.state.params.type == 1) {
            // 获取设备巡检数据
            this.setState({
              detail: {
                ...this.props.navigation.state.params.item,
                fId: this.props.navigation.state.params.item.fEquipmentId
              },
              detailData: {
                ...this.props.navigation.state.params.item,
                fId: this.props.navigation.state.params.item.fEquipmentId
              }
            }, () => {
              // 获取设备详情
              this.getDeviceDetail()
              // 获取设备检查项
              this.getCheckItems();
            });
          }
        } else {
          Toast.show('进入页面异常');
        }
    }

    // 获取设备检查项
    getCheckItems = async () => {
        const { detail } = this.state;
        const res = await deviceServer.getCheckItemsByEqumentId({
          fEquipmentId: detail.fEquipmentId,
          fPatrolTaskId: detail.fPatrolTaskId
        });
        if (res.success) {
          this.setState({
            checkItem: res.obj.map((data)=>({
              ...data,
              checked: data.fIsAbnormal,
              unDesc: data.fPatrolItemsDescribe,
              file: handlePhotoToJs(data.tFileManagementList)
            }))
          });
        } else {
          Toast.show(res.msg);
        }
    }

    // 提交设备巡检
    commitCheckUp = async (fState) => {
      const { checkItem, detail, detailData } = this.state;
      if (fState == 2) {
        for (let obj of checkItem) {
          if (!obj.checked) break;
          // 如果是异常 提交需要判断文件是否最少有一个
          let arr = obj.file.filter((data)=>(data.status === 'success'));
          if (arr.length == 0) {
            Toast.show('异常的检查项照片/视频不能为空');
            return
          }
        } 
      }
      let param = {
        fPatrolRecordId: null,
        fState,
        fPatrolTaskId: detailData.fPatrolTaskId,
        fEquipmentId: detailData.fEquipmentId,
        tPatrolItemsRecordAndFile: checkItem.map((data)=>{
          return {
            files: data.file.map((data)=>{
              if (data.status === 'success') {
                return {
                  fFileName: data.fileName,
                  fFileLocationUrl: data.path,
                  fType: data.type
                };
              }
            }),
            tPatrolItemsRecord: {
              fPatrolItemsDescribe: data.unDesc,
              fIsAbnormal: data.checked,
              fCheckItemsId: data.fCheckItemsId,  
              fPatrolItemsId: data.fPatrolItemsId
            }
          }
        })
      };
      console.log(JSON.stringify(param), '提交巡检参数');
      global.loading.show();
      const res = await deviceServer.commitCheckUp(param);
      global.loading.hide();
      if (res.success) {
        const { goBack, state } = this.props.navigation;
        Toast.show(res.msg);
        goBack();
        state.params && state.params.onRefresh()
      } else {
        Toast.show(res.msg);
      }
    }
    
    // 获取设备详情数据
    getDeviceDetail = async () => {
      const { detail } = this.state;
      console.log('detail', detail);
      global.loading.show();
      const res = await deviceServer.getDeviceDetailById(detail.fId);
      global.loading.hide();
      console.log('获取设备详情数据',res, 100 - res.obj.startRate * 1, res.obj.startRate * 1);
      if (res.success) {
        this.setState({
          detail: res.obj,
          option1: {
            series: [
              {
                  type: 'pie',
                  radius: ['65%','80%'],
                  center: ['50%', '60%'],
                  labelLine:{show: false},
                  legendHoverLink: false,
                  hoverAnimation: false,
                  clockwise: false,
                  data:[
                      {value: res.obj.startRate ? res.obj.startRate.replace(/%/g, '') * 1 : 0,itemStyle:{normal:{color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [{
                            offset: 0,
                            color: '#82F3DC' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#1ACFAA' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    }}}},
                      {value: res.obj.startRate ? 100 - res.obj.startRate.replace(/%/g, '') * 1 : 100,itemStyle:{normal:{color: '#F6F6F6'}}},
                  ],
                  
              }
          ]
          }
        });
      } else {
        Toast.show(res.msg);
      }
    }

    // 设备菜单按钮
    renderBtnList = () => {
      return (
        <View style={{backgroundColor: '#fff', borderRadius: 4,marginTop: 10,padding: 10,marginBottom: 20}}>
          <View style={{flexDirection: 'row',justifyContent: 'space-around'}}>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={()=>this.props.navigation.push('DeviceMaintain', {type: 1,detail:this.state.detail})}>
              <Image source={require('../../image/equiement/record.png')}/>
              <Text style={{color: '#333',marginTop: 5,fontSize: 12}}>保养记录</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={()=>this.props.navigation.push('MaintainLog', {type: 1,detail:this.state.detail})}>
              <Image source={require('../../image/equiement/weixiu.png')}/>
              <Text style={{color: '#333',marginTop: 5,fontSize: 12}}>维修记录</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems: 'center'}}>
              <Image source={require('../../image/equiement/yunxing.png')}/>
              <Text style={{color: '#333',marginTop: 5,fontSize: 12}}>运行记录</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row',justifyContent: 'space-around',marginTop: 20}}>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={()=>{
                this.props.navigation.push('DeviceRecordOne', {type: 2,detail: this.state.detail})
              }}>
              <Image source={require('../../image/equiement/xunjian.png')}/>
              <Text style={{color: '#333',marginTop: 5,fontSize: 12}}>巡检记录</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems: 'center'}}>
              <Image source={require('../../image/equiement/alarm.png')}/>
              <Text style={{color: '#333',marginTop: 5,fontSize: 12}}>报警记录</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={()=>this.props.navigation.push('DeviceParam', {item: this.state.detail})}>
              <Image source={require('../../image/equiement/setting.png')}/>
              <Text style={{color: '#333',marginTop: 5,fontSize: 12}}>关于设备</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    render() {
        const { type, detail, noRun, checkItem } = this.state;
        return (
          <View style={styles.container}>
            <Header 
              titleText={type== 1 ? '设备巡检' : '设备详情'}
              backBtn={true}
            />
            <ScrollView >
              <View style={styles.content}>
                <View style={styles.mainView}>
                  <View style={[styles.rowStyle, {justifyContent: 'space-between'}]}>
                    <Text style={{color: '#333', fontSize: 16,fontWeight: 'bold'}}>设备监控</Text>
                  </View>
                  <View style={styles.rowStyle}>
                    <View style={[{flex: 1,paddingTop: 20}]}>
                      <View style={styles.rowStyle}>
                        <Text style={styles.labelText}>主机电流</Text>
                        <Text style={styles.labelValue}>160kA</Text>
                      </View>
                      <View style={styles.rowStyle}>
                        <Text style={styles.labelText}>主机电压</Text>
                        <Text style={styles.labelValue}>380V</Text>
                      </View>
                      <View style={styles.rowStyle}>
                        <Text style={styles.labelText}>主机功率</Text>
                        <Text style={styles.labelValue}>7500KW</Text>
                      </View>
                      <View style={styles.rowStyle}>
                        <Text style={styles.labelText}>轴承温度</Text>
                        <Text style={styles.labelValue}>90℃</Text>
                      </View>
                      <View style={styles.rowStyle}>
                        <Text style={styles.labelText}>振动</Text>
                        <Text style={styles.labelValue}>380V</Text>
                      </View>
                    </View>
                    <View style={{flex: 1,position: 'relative'}}>
                      {this.state.option1 ? 
                        <View style={styles.circleView}>
                          <Text style={{color: '#666',fontWeight: 'bold',fontSize: 16}}>{detail.startRate}</Text>
                          <Text style={{color: '#999'}}>开机率</Text>
                        </View>: null}
                      { this.state.option1 ? 
                        <ECharts option={this.state.option1}/> : null
                      }
                    </View>
                  </View>
                </View>
                {
                  detail.fStart == 4 ?
                  <View style={[styles.rowStyle, styles.fixedHeader]}>
                    <Text style={{color: '#E7343A'}}>维修中</Text>
                    <Text style={{color: '#68B6FD'}}>查看设备维修工单</Text>
                  </View>
                  : null
                }
                <View style={{backgroundColor: '#fff', borderRadius: 4,marginTop: 10,padding: 10}}>
                  <View style={[styles.rowStyle,styles.detailLine, {justifyContent: 'space-between',paddingTop: 10,paddingBottom: 10}]}>
                    <View style={styles.rowStyle}>
                      <Image source={require('../../image/equiement/24gf-tag.png')}/>
                      <Text style={{color: '#333',marginLeft: 5}}>设备型号</Text>
                    </View>
                    <Text style={{color: '#666'}}>{detail.fEquipmentType || '--'}</Text>
                  </View>
                  <View style={[styles.rowStyle,styles.detailLine, {justifyContent: 'space-between',paddingTop: 13,paddingBottom: 10}]}>
                    <View style={styles.rowStyle}>
                      <Image source={require('../../image/equiement/24gf-appsBig.png')}/>
                      <Text style={{color: '#333',marginLeft: 5}}>设备类型</Text>
                    </View>
                    <Text style={{color: '#666'}}>{detail.typeName || '--'}</Text>
                  </View>
                  <View style={[styles.rowStyle,styles.detailLine, {justifyContent: 'space-between',paddingTop: 13,paddingBottom: 10}]}>
                    <View style={styles.rowStyle}>
                      <Image source={require('../../image/equiement/name.png')}/>
                      <Text style={{color: '#333',marginLeft: 5}}>设备名称</Text>
                    </View>
                    <Text style={{color: '#666'}}>{detail.fEquipmentName || '--'}</Text>
                  </View>
                  <View style={[styles.rowStyle,styles.detailLine, {justifyContent: 'space-between',paddingTop: 13,paddingBottom: 10}]}>
                    <View style={styles.rowStyle}>
                      <Image source={require('../../image/equiement/no.png')}/>
                      <Text style={{color: '#333',marginLeft: 5}}>设备编号</Text>
                    </View>
                    <Text style={{color: '#666'}}>{detail.fEquipmentModel || '--'}</Text>
                  </View>
                  <View style={[styles.rowStyle, {justifyContent: 'space-between',paddingTop: 13,paddingBottom: 10}]}>
                    <View style={styles.rowStyle}>
                      <Image source={require('../../image/equiement/24gf-calendar.png')}/>
                      <Text style={{color: '#333',marginLeft: 5}}>运行时长</Text>
                    </View>
                    <Text style={{color: '#666'}}>{detail.runtime||'--'}h</Text>
                  </View>
                </View>

                { type == 1 && this.state.checkItem.length > 0 ? 
                  <View style={{backgroundColor: '#fff', borderRadius: 4,marginTop: 10,padding: 10,marginBottom: 20}}>
                    {
                      this.state.checkItem.map((data, index)=>{
                        return (
                          <View key={index} style={[styles.detailLine, {paddingBottom: 15,marginTop: 10}]}>
                            <Text>{index + 1}.{data.fCheckItemsContent}</Text>
                            <View style={[styles.rowStyle, {marginTop: 10,paddingLeft: 10, position: 'relative'}]}>
                              {data.fState == 2 ? 
                              <View style={{position: 'absolute', width: 150,height: 30,backgroundColor: 'transparent',zIndex: 999}}></View> : null}
                              <Radio 
                                label="正常" 
                                value={!data.checked} 
                                onChange={()=>{
                                  this.state.checkItem[index].checked = false;
                                  this.setState({ checkItem: this.state.checkItem });
                                }}
                                />
                              <Radio 
                                style={{marginLeft: 15}} 
                                label="异常" 
                                value={data.checked} 
                                onChange={()=>{
                                  this.state.checkItem[index].checked = true;
                                  this.setState({ checkItem: this.state.checkItem });
                                }}
                                />
                            </View>
                            {
                              !data.checked ? null :
                              <View style={styles.unLineView}>
                                <Text>异常描述</Text>
                                <TextInput
                                  editable={data.fState != 2}
                                  style={styles.inputStyle}
                                  placeholder="请填写异常描述"
                                  underlineColorAndroid="transparent"
                                  allowFontScaling={true}
                                  value={data.unDesc}
                                  onChangeText={(text)=>{
                                    this.state.checkItem[index].unDesc = text;
                                    this.setState({
                                      checkItem: this.state.checkItem
                                    });
                                  }}
                                />
                                <View>
                                  <CameraUpload
                                    disabled={data.fState == 2}
                                    value={data.file}
                                    onChange={(picArr1)=>{
                                      this.state.checkItem[index].file = picArr1;
                                      this.setState({
                                        checkItem: this.state.checkItem 
                                      })
                                    }}
                                    imgStyle={{width: width*0.23, height: width*0.23}}
                                  />
                                </View>
                              </View>
                            }
                          </View>
                        )
                      })
                    }
                  </View>
                 : this.renderBtnList()
                }
                { type == 1 && checkItem.length > 0 && checkItem[0].fState != 2 ?
                  <View style={{flexDirection: 'row',alignItems: 'center'}}>
                    <TouchableOpacity 
                      style={{flex: 3, height: 44,backgroundColor: '#4058FD',justifyContent: 'center',alignItems: 'center',borderRadius: 4 }}
                      onPress={()=>this.commitCheckUp(2)}
                    >
                      <Text style={{color: '#fff',fontSize: 16}}>提交</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={{marginLeft: 10, flex: 2, height: 44,backgroundColor: '#fff',justifyContent: 'center',alignItems: 'center',borderRadius: 4,borderWidth: 1, borderColor: '#E0E0E0' }}
                      onPress={()=>this.commitCheckUp(1)}
                    >
                      <Text style={{color: '#333',fontSize: 16}}>暂存</Text>
                    </TouchableOpacity>
                  </View>
                   : 
                  <Text style={{width:width-30,textAlign: 'center',marginTop: -15}}></Text>
                }
              </View>
            </ScrollView>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6'
    },
    content: {
      padding: 15
    },
    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
    },  
    mainView: {
      backgroundColor: '#fff',
      borderRadius: 4,
      width: width - 30,
      height: 210,
      padding: 15
    },
    labelText: {
      color: '#666',
      fontSize: 14,
      width: 60,
      textAlign: 'right',
      marginRight: 10,
      lineHeight: 26
    },
    fixedHeader: {
      backgroundColor: '#fff',
      marginTop: 10,
      borderRadius: 4,
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 10,
      paddingRight: 10,
      justifyContent: 'space-between'
    },  
    labelValue: {
      color: '#666',
      fontSize: 14,
      fontWeight: 'bold'
    },
    circleView: {
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 99,
      top: '45%'
    },
    detailLine: {
      borderBottomColor: '#f6f6f6',
      borderBottomWidth: 1,
      
    },
    unLineView: {
      borderTopWidth: 1,
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 10,
      borderTopColor: '#f6f6f6',
      paddingTop: 10
    },
    inputStyle: {
      padding: 0,
      textAlignVertical: 'top',
      height: 80,
      flex: 1,
      marginTop: 5
    }

});
