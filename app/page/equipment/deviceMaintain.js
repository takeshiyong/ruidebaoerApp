import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,Modal,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-datepicker';
import {ECharts} from 'react-native-echarts-wrapper';
import moment from 'moment';
import Picker from 'react-native-wheel-picker';
import SplashScreen from 'react-native-splash-screen';
import deviceService from '../../service/deviceServer';
import Toast from '../../components/toast';

import Header from '../../components/header';
import { parseTime,parseDate } from '../../utils/handlePhoto';

const PickerItem = Picker.Item;
const {width, height} = Dimensions.get('window');
const PAGESIZE = 10;
class DeviceMaintain extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state= {
        date: null,
        date1: null,
        showPicker: false,
        typeData: {
            index: 0,
            fId: null,
            fName: '请选择保养级别'
        },
        levelData: {
            index: 0,
            fId: '',
            fName: '请选择设备级别'
        },
        manufacturerData: {
            index: 0,
            fId: '',
            fName: '全部'
        },
        selectDep: null,
        selectPeople: null,
        changeData: {},
        pickerList: [],
        derviceName: {
            fEquipmentName: '',
            fId: ''
        },
        pickerType: 0, // 1：是设备级别 
        itemList: [],
        option1: {},
        option2: {},
        option3: {},
        option4: {},
        key1: 0,
        key2: 0,
        key3: 0,
        key4: 0,
        type: 2, // 显示不同内容, 1: 设备保养详情 2: 整体设备保养 
        showMoreSearch: false,
        deviceLevel: [],
        currentPage: 1,
        // 列表数据结构
        dataSource: [],
        // 下拉刷新
        refreshing: false,
        // 加载更多
        isLoadMore: false,
        canLoadMore: true,
        pageSize: PAGESIZE,
    }

    componentDidMount() {
      SplashScreen.hide();
      this.getDeviceEquipmentLevelSelectAll();
      this.getDeviceManufacturerSelectAll();
      if (this.props.navigation.state.params && this.props.navigation.state.params.type && this.props.navigation.state.params.detail) {
        this.setState({
            derviceName: {fId:this.props.navigation.state.params.detail.fId},
            type: this.props.navigation.state.params.type
        },() => {this.getNextData()})
        return;
      }
      if (this.props.navigation.state.params && this.props.navigation.state.params.type) {
        this.setState({
          type: this.props.navigation.state.params.type
        },() => {this.getNextData()})
      }
    }
    /**
     * 下啦刷新
     * 
     */
    _onRefresh = () => {
        // 不处于 下拉刷新
        this.setState({
            pageSize: PAGESIZE
        }, ()=> {
            this.getNextData()
        })
            
    };

    
      /**
     * 加载更多
     * @private
     */
    _onLoadMore() {
        // 不处于正在加载更多 && 有下拉刷新过，因为没数据的时候 会触发加载
        if (!this.state.isLoadMore && this.state.dataSource.length > 0 && this.state.canLoadMore) {
            this.setState({
                pageSize: this.state.pageSize + 10
            }, () => {
                this.getNextData()
            })
        }
    } 
      /**
       * 创建尾部布局
       */
    _createListFooter = () => {
        const { isLoadMore, dataSource, canLoadMore } = this.state;
        if (dataSource.length == 0) {
            return null;
        }
        let moreText = '上拉加载更多数据';
        if (isLoadMore) {
            moreText = '正在加载更多数据'
        } else {
            if (!canLoadMore) {
                moreText = '暂无更多数据' 
            }
        }
        return (
            <View style={styles.footerView}>
                {isLoadMore ? <ActivityIndicator color="#000"/> : null}
                <Text style={{ color: '#999' }}>
                    {moreText}
                </Text>
            </View>
        )
    }
    listHead = () => {
        const { type, showMoreSearch, derviceName, manufacturerData} = this.state;
        return(<View style={styles.content}>
            <View style={{borderColor: '#fff',borderRadius: 4,margin: 10}}>
                <View style={[styles.itemStyle]}>
                    <Image source={require('../../image/workStatus/start.png')} style={{marginRight: 10}}/>
                    <View style={styles.contentView}>
                        <Text>开始日期</Text>
                        <DatePicker
                            style={{width: 150}}
                            date={this.state.date}
                            mode="date"
                            placeholder="请选择开始日期"
                            format="YYYY-MM-DD"
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
                                    color: '#999'
                                },
                                placeholderText: {
                                    color: '#999'
                                }
                            }}
                            iconComponent={<AntDesign name="right" color="#C1C1C1"/>}
                            onDateChange={(date) => {this.setState({date: date},() => {this.getNextData()})}}
                        />
                    </View>
                </View> 
                <View style={styles.itemStyle}>
                    <Image source={require('../../image/workStatus/stop.png')} style={{marginRight: 10}}/>
                    <View style={styles.contentView}>
                        <Text>结束日期</Text>
                        <DatePicker
                            style={{width: 150}}
                            date={this.state.date1}
                            mode="date"
                            placeholder="请选择结束日期"
                            format="YYYY-MM-DD"
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
                                    color: '#999'
                                },
                                placeholderText: {
                                    color: '#999'
                                }
                            }}
                            iconComponent={<AntDesign name="right" color="#C1C1C1"/>}
                            onDateChange={(date) => {this.setState({date1: date},() => {this.getNextData()})}}
                        />
                    </View>
                </View>
             
                { showMoreSearch && (this.state.type == 1 || this.state.type == 2) ? 
                <TouchableOpacity style={styles.peopleItem} onPress={this.chooseReportPerson}>
                      <Image source={require('../../image/workStatus/user-group-fill.png')} style={{marginRight: 10}}/>
                      <View style={styles.rightItems}>
                          <Text style={{fontSize: 14}}>保养责任人</Text>
                          <View style={{flexDirection: "row",justifyContent: "space-between",alignItems: "center"}}>
                              <Text style={{fontSize: 14, color: "#999999"}}>{this.state.selectPeople ? this.state.selectPeople.fName : '不限'}</Text>
                              {
                                  this.state.selectPeople ? 
                                  <TouchableOpacity onPress={()=>this.setState({ selectPeople: null })}>
                                      <AntDesign name="closecircleo" size={12} style={{ color: '#C1C1C1',marginLeft: 10 }} />
                                  </TouchableOpacity>
                                  :
                                  <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 13 }}/>
                              }
                          </View>
                          
                      </View>
                </TouchableOpacity> : null }
                      
                { showMoreSearch && this.state.type == 2 ?
                <TouchableOpacity style={[styles.itemStyle, {paddingBottom: 5}]} onPress={() =>this.props.navigation.push('DevicesChoose',{getValue: this.getValue})}>
                      <Image source={require('../../image/workStatus/cash-register.png')} style={{marginRight: 10}}/>
                      <View style={[styles.contentView,{marginLeft: 2}]}>
                          <Text>保养设备</Text>
                          <View style={{flexDirection: 'row',alignItems: 'center'}}>
                              <Text style={{color: '#999',marginRight: 2}}>{derviceName.fEquipmentName != ''?derviceName.fEquipmentName:'请选择保养设备'}</Text>
                              <AntDesign name="right" color="#C1C1C1"/>
                          </View>
                      </View>
                  </TouchableOpacity> : null}
                  { showMoreSearch && this.state.type == 2 ?
                <TouchableOpacity style={[styles.itemStyle, {paddingBottom: 5}]} onPress={() => {this.chooseDeviceLevel()}}>
                      <Image source={require('../../image/workStatus/cash-register.png')} style={{marginRight: 10}}/>
                      <View style={[styles.contentView,{marginLeft: 2}]}>
                          <Text>设备级别</Text>
                          <View style={{flexDirection: 'row',alignItems: 'center'}}>
                              <Text style={{color: '#999',marginRight: 2}}>{this.state.levelData ? this.state.levelData.fName : '请选择设备级别'}</Text>
                              <AntDesign name="right" color="#C1C1C1"/>
                          </View>
                      </View>
                  </TouchableOpacity> : null}
                  { showMoreSearch && this.state.type == 2 ?
                <TouchableOpacity style={[styles.itemStyle, {paddingBottom: 5}]} onPress={this.chooseReportDept}>
                      <Image source={require('../../image/workStatus/cash-register.png')} style={{marginRight: 10}}/>
                      <View style={[styles.contentView,{marginLeft: 2}]}>
                          <Text>设备部门</Text>
                          <View style={{flexDirection: 'row',alignItems: 'center'}}>
                              <Text style={{color: '#999',marginRight: 2}}>{this.state.selectDep ? this.state.selectDep.fName : '请选择设备部门'}</Text>
                              <AntDesign name="right" color="#C1C1C1"/>
                          </View>
                      </View>
                  </TouchableOpacity> : null}
                  { showMoreSearch && this.state.type == 2 ? 
                <TouchableOpacity style={[styles.itemStyle, {paddingBottom: 5}]} onPress={this.chooseManufacturer}>
                      <Image source={require('../../image/workStatus/user-group-fill.png')} style={{marginRight: 10}}/>
                      <View style={[styles.contentView]}>
                          <Text>设备厂商</Text>
                          <View style={{flexDirection: 'row',alignItems: 'center'}}>
                              <Text style={{color: '#999',marginRight: 2}}>{manufacturerData&&manufacturerData.fName?manufacturerData.fName: '请选择设备厂商'}</Text>
                              <AntDesign name="right" color="#C1C1C1"/>
                          </View>
                      </View>
                  </TouchableOpacity>: null }
                {  showMoreSearch && (this.state.type == 1 || this.state.type == 2) ? 
                <TouchableOpacity style={[styles.itemStyle,{marginLeft: 2}, {paddingBottom: 5}]} onPress ={() => {this.showTypeDataList()}}>
                    <Image source={require('../../image/troubleDetails/leavel.png')} style={{marginRight: 10}}/>
                    <View style={[styles.contentView]}>
                        <Text>保养级别</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Text style={{color: '#999',marginRight: 2}}>{this.state.typeData&&this.state.typeData.fName?this.state.typeData.fName:'请选择维修级别'}</Text>
                            <AntDesign name="right" color="#C1C1C1"/>
                        </View>
                    </View>
                </TouchableOpacity> : null}
                <TouchableOpacity onPress={()=>this.setState({showMoreSearch: !showMoreSearch})} style={{justifyContent: 'center',alignItems: 'center',backgroundColor:'#fff',paddingTop: 5,paddingBottom: 5}}>
                  <AntDesign name={showMoreSearch ? 'up' : 'down'}/>
                </TouchableOpacity>
            </View>
            { this.state.type == 1 || this.state.type == 2 ? 
            <View style={styles.pannelView}>
                <View style={styles.rowTextView}>
                  <Text style={{fontSize: 16,color: '#000',fontWeight: 'bold'}}>保养次数</Text>
                </View>
                <View style={{ flexDirection: 'row',paddingBottom: 15,flexWrap: 'wrap'}}>
                    <View style={styles.echartsView}>
                        <ECharts option={this.state.option1} key={this.state.key1}/>
                        <View style={styles.hideLine}/>
                        <Text style={styles.echartsText}>日</Text>
                    </View>
                    <View style={styles.echartsView}>
                        <ECharts option={this.state.option2} key={this.state.key2}/>
                        <View style={styles.hideLine}/>
                        <Text style={styles.echartsText}>周</Text>
                    </View>
                    <View style={styles.echartsView}>
                        <ECharts option={this.state.option3} key={this.state.key3}/>
                        <View style={styles.hideLine}/>
                        <Text style={styles.echartsText}>月</Text>
                    </View>
                    <View style={styles.echartsView}>
                        <ECharts option={this.state.option4} key={this.state.key4}/>
                        <View style={styles.hideLine}/>
                        <Text style={styles.echartsText}>年</Text>
                    </View>
                </View>
                
            </View> : null} 
            
        </View>)
    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#F4F4F4' }} />;
    }
    getNextData = () => {
        this.selectMaintainRecordByAll()
    }
    
    //根据查询规则查询保养记录
    selectMaintainRecordByAll = async () => {
        const { pageSize, currentPage } = this.state;
        if(this.state.date&&this.state.date1){
            if(new Date(this.state.date.replace(/-/g, '/')).getTime() > new Date(this.state.date1.replace(/-/g, '/')).getTime()){
                Toast.show('开始时间不能大于结束时间，请核对');
                return;
            }
        }
        
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: true,canLoadMore: true});
        } else {
            this.setState({ isLoadMore: true });
        }
        const res = await deviceService.selectMaintainRecordByAll({
            "departmentId":  this.state.selectDep&&this.state.selectDep.fId != ''?this.state.selectDep.fId: '',
            "endTime": this.state.date1?parseTime(this.state.date1): null,
            "equipmentLevelId": this.state.levelData.fId != ''?this.state.levelData.fId: '',
            "maintainEquipmentId": this.state.derviceName.fId != ''?this.state.derviceName.fId: '',
            "maintainLevel": this.state.typeData&&this.state.typeData.fId != null ?this.state.typeData.fId: '',
            "manufacturerId": this.state.manufacturerData&&this.state.manufacturerData.fId != ''?this.state.manufacturerData.fId: '',
            "pageCurrent": currentPage,
            "pageSize": pageSize,
            "startTime": this.state.date?parseTime(this.state.date): null,
            "userId": this.state.selectPeople&&this.state.selectPeople.fId != '' ?this.state.selectPeople.fId: ''
        })
        if (pageSize == PAGESIZE) {
            this.setState({ refreshing: false });
        } else {
            this.setState({ isLoadMore: false });
        }
        if (res.success) {
            let maintainCountByZero = res.obj.maintainCountByZero ?res.obj.maintainCountByZero : 0;
            let maintainCountByOne = res.obj.maintainCountByOne?res.obj.maintainCountByOne:0;
            let maintainCountByTwo = res.obj.maintainCountByTwo?res.obj.maintainCountByTwo:0;
            let maintainCount = res.obj.maintainCount?res.obj.maintainCount:0;
            let maintainCountByThree = res.obj.maintainCountByThree?res.obj.maintainCountByThree:0;
            let key1 = this.state.key1 + 1;
            let key2 = this.state.key2 + 1; 
            let key3 = this.state.key3 + 1;
            let key4 = this.state.key4 + 1;
            this.setState({
                dataSource: res.obj.items == null ? [] : res.obj.items,
                key1,
                key2,
                key3,
                key4,
                option1: {
                    title: {
                        text: maintainCountByZero+'次',
                        top: '40%',
                        left: '45%',
                        textStyle: {
                            fontSize: 12,
                        },
                        textAlign: 'center',
                    },
                    series: [
                        {
                            clockwise: false,
                            name:'访问来源',
                            type:'pie',
                            radius: ['55%', '75%'],
                            center: ['50%','50%'],
                            avoidLabelOverlap: false,
                            hoverAnimation: false,
                            legendHoverLink: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value: maintainCountByZero, itemStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 1,
                                        y2: 0,
                                        colorStops: [{
                                            offset: 0,
                                            color: '#5E75FE' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#4058FD' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
            
                                }},
                                {value:(maintainCount-maintainCountByZero), itemStyle: {
                                    color: '#F3F3F3'
                                }},
                                
                            ]
                        }
                    ]
                },
                option2: {
                    title: {
                        text: maintainCountByOne+'次',
                        top: '40%',
                        left: '45%',
                        textStyle: {
                            fontSize: 12,
                
                        },
                        textAlign: 'center'
                    },
                    series: [
                        {
                            clockwise: false,
                            name:'访问来源',
                            type:'pie',
                            radius: ['55%', '75%'],
                            avoidLabelOverlap: false,
                            hoverAnimation: false,
                            legendHoverLink: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value: maintainCountByOne, itemStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 1,
                                        y2: 0,
                                        colorStops: [{
                                            offset: 0,
                                            color: '#FF632E' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#FF8949' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
            
                                }},
                                {value:(maintainCount -maintainCountByOne), itemStyle: {
                                    color: '#F3F3F3'
                                }},
                                
                            ]
                        }
                    ]
                },
                option3: {
                    title: {
                        text: maintainCountByTwo+'次',
                        top: '40%',
                        left: '45%',
                        textStyle: {
                            fontSize: 12,
                
                        },
                        textAlign: 'center'
                    },
                    series: [
                        {
                            clockwise: false,
                            name:'访问来源',
                            type:'pie',
                            radius: ['55%', '75%'],
                            avoidLabelOverlap: false,
                            hoverAnimation: false,
                            legendHoverLink: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value:maintainCountByTwo, itemStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 1,
                                        y2: 0,
                                        colorStops: [{
                                            offset: 0,
                                            color: '#F74747' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#FC676E' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
            
                                }},
                                {value:(maintainCount-maintainCountByTwo), itemStyle: {
                                    color: '#F3F3F3'
                                }},
                                
                            ]
                        }
                    ]
                },
                option4: {
                    title: {
                        text: maintainCountByThree+'次',
                        top: '40%',
                        left: '45%',
                        textStyle: {
                            fontSize: 12,
                
                        },
                        textAlign: 'center'
                    },
                    series: [
                        {
                            clockwise: false,
                            name:'访问来源',
                            type:'pie',
                            radius: ['55%', '75%'],
                            avoidLabelOverlap: false,
                            hoverAnimation: false,
                            legendHoverLink: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value:maintainCountByThree, itemStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 1,
                                        y2: 0,
                                        colorStops: [{
                                            offset: 0,
                                            color: '#F74747' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#FC676E' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
            
                                }},
                                {value:(maintainCount-maintainCountByThree), itemStyle: {
                                    color: '#F3F3F3'
                                }},
                                
                            ]
                        }
                    ]
                },
            })
            if (this.state.pageSize >= res.obj.itemTotal) {
                this.setState({
                    canLoadMore: false
                })
            }
        } else {
            Toast.show(res.msg);
        }
    }
     // 选择保养责任人
     chooseReportPerson = () => {
        this.props.navigation.navigate('selectPeopleByDep',{surePeople: this.getReportPeople})
    }
    // 获取选中保养责任人数据
    getReportPeople = (data) => {
        console.log('people', data);
        this.setState({
            selectPeople: {fId: data.fId, fName: data.fUserName}
        },() => {this.getNextData()});
    }
    //获取保养设备
    getValue = (value) => {
        console.log()
        this.setState({
            derviceName: {
                fEquipmentName: value.fEquipmentName,
                fId: value.fId
            },
        },() => {this.getNextData()})
    }
    //查询设备级别
    getDeviceEquipmentLevelSelectAll = async () => {
        const res = await deviceService.getDeviceEquipmentLevelSelectAll();
        if(res.success){
            this.setState({
                deviceLevel: res.obj
            })
        }else{
            console.log(res.msg)
        }
    }
    //设备级别
    chooseDeviceLevel = () => {
        const {deviceLevel} = this.state;
        if(deviceLevel.length > 0){
            const selectList = deviceLevel.map((data, index)=>{
                return {
                    index: index,
                    fId: data.fId,
                    fName: data.fLevelName
                }
            });
            
            this.setState({
                itemList: selectList,
                pickerList: selectList.map((data)=>(data.fName)),
                changeData: selectList[deviceLevel.index],
                showPicker: true,
                pickerType: 1
            });
        } 
    }
    //获取产商的数据
    getDeviceManufacturerSelectAll = async() => {
        const res = await deviceService.getDeviceManufacturerSelectAll();
        if(res.success){
            this.setState({
                Manufacturer: res.obj
            })
        }else{
            Toast.show(res.msg)
            console.log(res.msg)
        }
        
    }
    //点击产商数据
    chooseManufacturer = () => {
        const {Manufacturer} = this.state;
        if(Manufacturer.length > 0){
            const selectList = Manufacturer.map((data, index)=>{
                return {
                    index: index,
                    fId: data.fId,
                    fName: data.fManufacturerName
                }
            });
            
            this.setState({
                itemList: selectList,
                pickerList: selectList.map((data)=>(data.fName)),
                changeData: selectList[Manufacturer.index],
                showPicker: true,
                pickerType: 2
            });
        } 
    }
    // 选择设备部门
    chooseReportDept = () => {
        this.props.navigation.navigate('SelectDep',{sureDepId: this.getReportDept})
    }
    // 获取选中设备部门数据
    getReportDept = (dept) => {
        this.setState({
            selectDep: {fId: dept.fId, fName: dept.fName}
            
        },() => {this.getNextData()});
    }
    // 展开选择保养类型
    showTypeDataList = () => {
        let typeDataList = [{fId: 0,fName: "日"},{fId: 1,fName: "周"},{fId: 2,fName: "月"},{fId: 3,fName: "年"}]
        const { typeData } = this.state;
        if(typeDataList.length > 0){
            const selectList = typeDataList.map((data, index)=>{
                return {
                    index: index,
                    fId: data.fId,
                    fName: data.fName
                }
            });
            
            this.setState({
                itemList: selectList,
                pickerList: selectList.map((data)=>(data.fName)),
                changeData: selectList[typeData.index],
                showPicker: true,
                pickerType: 3
            });
        } 
        
    }
    //picker确认改值
    onPickerSelect = () => {
        const {typeData, changeData, pickerType, levelData, manufacturerData} = this.state;
        this.setState({
            showPicker: false,
            levelData: {
                index: levelData.index,
                fName: pickerType == 1 ?changeData.fName: levelData.fName,
                fId: pickerType == 1 ?changeData.fId: levelData.fId,
            },
            manufacturerData: {
                index: manufacturerData.index,
                fName: pickerType == 2 ?changeData.fName: manufacturerData.fName,
                fId: pickerType == 2?changeData.fId: manufacturerData.fId,
            },
            typeData: {
                index: changeData.index,
                fName: pickerType == 3 ?changeData.fName: typeData.fName,
                fId: pickerType == 3 ?changeData.fId: typeData.fId,
            },
        },() => {this.getNextData()})
        
    }
    
    // picker滚动的时候改值
    onPickerChange = (index) => {
        const { changeData, itemList } = this.state;
        this.setState({
            changeData: itemList[index]
        });
    }
    getData = (data) => {
        switch (data){
            case 0: 
                return '日保养';
            case 1: 
                return '周保养';
            case 2: 
                return '月保养';
            case 3: 
                return '年保养';
            default:
                return null;
        } 
    }
    renderItem = ({item,index}) => {
        return (<TouchableOpacity style={styles.itemsStyle} onPress={() => {this.props.navigation.push('CarshopsDetail',{id: item.fMaintainTaskId,type: 2})}}>
            <View style={styles.recordDetail}>
                <View style={styles.rowStyle}>
                    <Text style={styles.recordLabel}>保养时间</Text> 
                    <Text style={styles.recordValue}>{item.fTime?parseDate(item.fTime):'-- '}</Text> 
                </View>
                <View style={styles.rowStyle}>
                    <Text style={styles.recordLabel}>保养负责人</Text> 
                    <Text style={[styles.recordValue,{flex: 1}]}>{item.fUserName?item.fUserName:'--'}</Text> 
                </View>
                <View style={{flexDirection: "row"}}>
                    <View style={styles.rowStyle}>
                        <Text style={styles.recordLabel}>保养设备</Text> 
                        <Text style={styles.recordValue}>{item.fEquipmentName?item.fEquipmentName: '--'}</Text> 
                    </View>
                    <View style={[styles.rowStyle,{marginLeft: 20}]}>
                        <Text style={styles.recordLabel}>保养级别</Text> 
                        <Text style={[styles.recordValue, {color: '#4058FD'}]}>{item.maintainLevel != null?this.getData(item.maintainLevel): '--'}</Text> 
                    </View>
                </View>
            </View>
        </TouchableOpacity>) }
    render() {
        const { type, showMoreSearch, derviceName, manufacturerData} = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="保养记录"
                    hidePlus={type == 1}
                    rightBtn={type == 1 ? 
                        <TouchableOpacity style={{marginRight: 10}}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>计划</Text>
                        </TouchableOpacity>:null
                    }
                />
                <Modal
                    animationType={'fade'}
                    transparent
                    visible={this.state.showPicker}
                    onRequestClose={() => {}}
                    >
                    <View style={styles.modalStyle}>
                        <View style={styles.selectModalTop}>
                            <View style={styles.selectModalBody}>
                                <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        showPicker: false,
                                        changeData: {}
                                    })
                                }}
                                >
                                <Text style={{ fontSize: 14, color: '#508DCE' ,marginLeft: 8}}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.onPickerSelect}
                                >
                                <Text style={{ fontSize: 14, color: '#508DCE' ,marginRight: 8 }}>确定</Text>
                                </TouchableOpacity>
                            </View>
                            <Picker
                                style={{ width: width, height: 180 }}
                                itemStyle={{ color: 'black', fontSize: 22 }}
                                selectedValue={this.state.selectedItem}
                                onValueChange={(index) => this.onPickerChange(index)}>
                                {this.state.pickerList.map((value, i) => (
                                    <PickerItem label={value} value={i} key={value}/>
                                ))}
                            </Picker>
                        </View>
                    </View>
                </Modal>
                    <FlatList
                            style={{flex: 1}}
                            data={this.state.dataSource}
                            // keyExtractor={(item)=>item.fId}
                            refreshControl={
                                <RefreshControl
                                    title={'Loading'}
                                    colors={['#000']}
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => {
                                        this._onRefresh();
                                    }}
                                />
                            }
                            renderItem={this.renderItem}
                            refreshing={this.state.refreshing}
                            //加载更多
                            ListHeaderComponent={this.listHead}
                            ListFooterComponent={this._createListFooter}
                            ListEmptyComponent={<Text style={{width:'100%', textAlign: 'center',marginTop: 10,color: '#c9c9c9', paddingBottom: 80}}>暂无数据</Text>}
                            onEndReached={() => this._onLoadMore()}
                            onEndReachedThreshold={0.1}
                            ItemSeparatorComponent={()=>this._separator()}
                        />
            </View>
        );
    }
}


export default DeviceMaintain;

const styles = StyleSheet.create({
      hideLine: {
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
        position: 'absolute',
        bottom: 13
      },
    echartsView: {
        flex: 1,
        height: 100,
        position: 'relative'
    },
    title: {
        marginLeft: 10,
    },
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 50,
        paddingLeft: 10,
    },
    contentView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingRight: 10
    },
    pannelView: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#fff',
        margin: 10,
        borderRadius: 4,
        marginTop: 0
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    content: {
        backgroundColor: '#F4F4F4',
    },
    itemTop: {
        display: "flex",
        width: width-40,
        paddingLeft: 20,
        flexDirection: "row",
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderColor: "rgba(197, 195, 196, .8)"
    },
    item: {
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 6,
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center'
    },
    echartsText: {
        color: '#666666',
        fontSize: 12,
        textAlign: 'center'
    },
    detailView: {
        width: '100%',
        backgroundColor: '#F6F6F6',
        borderRadius: 4,
        paddingBottom: 10,
        marginBottom: 20
    },
    detailTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        paddingLeft: 15
    },
    nameCircle: {
        width: 25,
        height: 25,
        borderRadius: 50,
        backgroundColor: '#4058FD',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tip: {
        backgroundColor: '#FF8244',
        marginLeft: 10,
        paddingTop: 2,
        paddingBottom: 2,
        paddingRight: 5,
        paddingLeft: 5,
        justifyContent: 'center',
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center'
    },
    tipView: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    rightItems: {
        flex: 1,
        flexDirection: "row", 
        alignItems: "center",
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        height: 50,
        justifyContent: "space-between"
    },
    peopleItem: {
        paddingBottom: 5,
        justifyContent: "space-between",
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingLeft: 10,
    },
     //picker
     modalStyle: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center'
    },
    selectModalTop: {
        width: width,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0
      },
    selectModalBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 5,
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1
    },
    rowTextView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
      paddingRight: 10,
      paddingLeft: 10
    },
    itemsStyle:{
        paddingLeft:10,
        paddingRight: 10,
        marginBottom: 10,
        borderBottomColor: "#F4F4F4",
        borderBottomWidth: 1
    },
    recordDetail: {
      padding: 10,
      paddingTop: 10,
      paddingBottom: 15,
      backgroundColor: "#fff"
    },
    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10
    },
    recordLabel: {
      color: '#999',
    },
    recordValue: {
      color: '#333',
      marginLeft: 10,
    
    },
    echartsCenterText: {
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        top: '35%'
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
        paddingBottom: 10
    },
});
