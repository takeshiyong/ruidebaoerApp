import React, { Component } from 'react';
import { StyleSheet, BackHandler, Text, View,Modal, TouchableOpacity, Dimensions, TouchableHighlight,Linking, Platform, StatusBar, ImageBackground, Image, ScrollView,RefreshControl, FlatList, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-datepicker';
import {ECharts} from 'react-native-echarts-wrapper';
import moment from 'moment';
import Picker from 'react-native-wheel-picker';
import SplashScreen from 'react-native-splash-screen';

import deviceService from '../../service/deviceServer';
import Header from '../../components/header';
import { parseTime, parseDate, isDot} from '../../utils/handlePhoto';

const PAGESIZE = 10;
const PickerItem = Picker.Item;
const {width, height} = Dimensions.get('window');

export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state= {
        date: null,
        date1: null,
        levelData: {
            index: 0,
            fId: '',
            fName: '全部'
        },
        maintenanceData: {
            index: 0,
            fId: '',
            fName: '全部'
        },
        deviceData: {
            index: 0,
            fId: '',
            fName: '全部'
        },
        manufacturerData: {
            index: 0,
            fId: '',
            fName: '全部'
        },
        showPicker:false,
        MaintenanceType: [],
        deviceLevel: [],
        Manufacturer: [],
        alldDevice: [],
        changeData: {},
        pickerList: [],
        pickerType: 0, // 1：是设备 2：是级别 3.维修类型 4.产商
        itemList: [],
        
        option: [],
        type: 4, // 显示不同内容, 1: 单设备的维修  4：设备整体维修记录
        showMoreSearch: false,
        current: 0,
        currentPage: 1,
        // 列表数据结构
        dataSource: [],
        // 下拉刷新
        refreshing: false,
        // 加载更多
        isLoadMore: false,
        canLoadMore: true,
        pageSize: PAGESIZE,
        selectPeople: {fId: '', fName: '全部'}
        
    }

    componentDidMount() {
      SplashScreen.hide();
      
      if (this.props.navigation.state.params && this.props.navigation.state.params.type) {
        this.setState({
          type: this.props.navigation.state.params.type
        })
      }
      if(this.props.navigation.state.params && this.props.navigation.state.params.detail) {
          let deviceData = this.state.deviceData
          deviceData.fId = this.props.navigation.state.params.detail.fId
          console.log(deviceData)
            this.setState({
                deviceData 
            })
      }
      this.initData()
    }
    initData = () => {
        this.getDeviceManufacturerSelectAll();
        this.getDeviceEquipmentLevelSelectAll();
        this.getMaintenanceType();
        this.getAllDevice();
        this.getMaintenanceSelectNum()
        this.getMaintenanceRecord();
    }
    //点击获取设备
    chooseAlldDevice = () => {
        const {alldDevice} = this.state;
        if(alldDevice.length > 0){
            const selectList = alldDevice.map((data, index)=>{
                return {
                    index: index,
                    fId: data.fId,
                    fName: data.fEquipmentName
                }
            });
            
            this.setState({
                itemList: selectList,
                pickerList: selectList.map((data)=>(data.fName)),
                changeData: selectList[alldDevice.index],
                showPicker: true,
                pickerType: 1
            });
        } 
    }
    //查询所有设备
    getAllDevice = async () => {
        const res = await deviceService.getAllDevice();
        if(res.success){
            this.setState({
                alldDevice: res.obj
            })
        }else{
            console.log(res.msg)
        }
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
    //点击设备级别
    chooseDeviceLevel = () => {
        const {deviceLevel} = this.state;
        if(deviceLevel.length > 0){
            const selectList = deviceLevel.map((data, index)=>{
                console.log(data);
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
                pickerType: 2
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
                pickerType: 4
            });
        } 
    }
    //查询全部维修类型信息
    getMaintenanceType = async() => {
        const res= await deviceService.getMaintenanceType();
        if(res.success){
            this.setState({
                MaintenanceType: res.obj
            })
        }else{
            console.log(res.msg)
        }
    }
    
    //点击全部维修类型
    chooseMaintenanceType = () => {
        const {MaintenanceType} = this.state;
        if(MaintenanceType.length > 0){
            const selectList = MaintenanceType.map((data, index)=>{
                return {
                    index: index,
                    fId: data.fId,
                    fName: data.fName
                }
            });
            
            this.setState({
                itemList: selectList,
                pickerList: selectList.map((data)=>(data.fName)),
                changeData: selectList[MaintenanceType.index],
                showPicker: true,
                pickerType: 3
            });
        } 
    }
    //picker确认改值
    onPickerSelect = () => {
        const {deviceData, changeData, pickerType, levelData, maintenanceData,manufacturerData} = this.state;
        this.setState({
            showPicker: false,
            deviceData: {
                index: deviceData.index,
                fName: pickerType == 1 ?changeData.fName: deviceData.fName,
                fId: pickerType == 1 ?changeData.fId: deviceData.fId,
            },
            levelData: {
                index: levelData.index,
                fName: pickerType == 2 ?changeData.fName: levelData.fName,
                fId: pickerType == 2 ?changeData.fId: levelData.fId,
            },
            maintenanceData: {
                index: maintenanceData.index,
                fName: pickerType == 3 ?changeData.fName: maintenanceData.fName,
                fId: pickerType == 3?changeData.fId: maintenanceData.fId,
            },
            manufacturerData: {
                index: manufacturerData.index,
                fName: pickerType == 4 ?changeData.fName: manufacturerData.fName,
                fId: pickerType == 4?changeData.fId: manufacturerData.fId,
            },
        },() => {this.getMaintenanceRecord()})
        
    }

    // picker滚动的时候改值
    onPickerChange = (index) => {
        const { changeData, itemList } = this.state;
        this.setState({
            changeData: itemList[index]
        });
    }
    //获取负责人
    chooseReportPerson = () => {
        this.props.navigation.navigate('selectPeopleByDep',{surePeople: this.getReportPeople})
    }
    // 获取选中负责人员数据
    getReportPeople = (data) => {
        this.setState({
            selectPeople: {fId: data.fId, fName: data.fUserName}
        });
    }
    //根据分页查询设备维修记录
    getMaintenanceRecord = async() => {
        const {date1, date, selectPeople,deviceData, levelData, manufacturerData, maintenanceData, pageSize, currentPage} = this.state;
        this.setState({ isLoadMore: true });
        global.loading.show();
        const res = await deviceService.getMaintenanceRecord({
            fCurrtentPage: currentPage,
            fEndTime: date1?new Date(date1.replace(/-/g, '/')).getTime(): null,
            fEquipmentId: deviceData.fId,
            fEquipmentLevel: levelData.fId,
            fMaintenanceType: maintenanceData.fId,
            fMaintenanceUserId: selectPeople.fId,
            fManufacturer: manufacturerData.fId,
            fPageSize: pageSize,
            fStateTime: date?new Date(date.replace(/-/g, '/')).getTime(): null
        })
        global.loading.hide();
        console.log(res);
        this.setState({ isLoadMore: false });
        if(res.success){
            this.setState({
                dataSource: res.obj.items
            })
            if (this.state.pageSize >= res.obj.itemTotal) {
                this.setState({
                    canLoadMore: false,
                })
            }
            
        }else{
            Toast.show(res.msg)
            console.log(res.msg)
        }
    }
    //查询满足条件的各个维修类型下的维修记录数量
    getMaintenanceSelectNum = async() => {
        const {date1, date, selectPeople,deviceData, levelData, manufacturerData, maintenanceData, pageSize, currentPage} = this.state;
        const res = await deviceService.getMaintenanceSelectNum({
            fCurrtentPage: currentPage,
            fEndTime: date1?new Date(date1.replace(/-/g, '/')).getTime(): null,
            fEquipmentId: deviceData.fId,
            fEquipmentLevel: levelData.fId,
            fMaintenanceType: maintenanceData.fId,
            fMaintenanceUserId: selectPeople.fId,
            fManufacturer: manufacturerData.fId,
            fPageSize: pageSize,
            fStateTime: date?new Date(date.replace(/-/g, '/')).getTime(): null
        })
        if(res.success){
            let arr = []
            let obj = res.obj;
            let num = 0;
            obj.map((item) => {
                num += item.num
            })
            obj.map((item) => {
                arr.push({
                    fName: item.fName,
                    option: {
                        title: {
                            text: item.num+'次',
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
                                    {value:item.num, itemStyle: {
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
                                    {value:(num-item.num), itemStyle: {
                                        color: '#F3F3F3'
                                    }},
                                    
                                ]
                            }
                        ]
                    }
                })
            })
            this.setState({
                option: arr
            })
            console.log('arr',arr)
        }else{
            Toast.show(res.msg)
            console.log(res.msg)
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
            this.getMaintenanceRecord()
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
                this.getMaintenanceRecord()
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
        let moreText = '下拉加载更多数据';
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

    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#fff' }} />;
    }
    _createListHeader = () => {
        const { showMoreSearch,deviceData, manufacturerData, maintenanceData, levelData} = this.state;
        return(<View style={styles.content}>
            <View style={{padding: 10,borderRadius: 4,backgroundColor: '#fff'}}>
                <View style={[styles.itemStyle]}>
                    <Image source={require('../../image/workStatus/start.png')} style={{marginRight: 10}}/>
                    <View style={styles.contentView}>
                        <Text>开始日期</Text>
                        <DatePicker
                            style={{width: 180}}
                            date={this.state.date}
                            mode="datetime"
                            placeholder="请选择开始时间"
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
                                    color: '#999'
                                },
                                placeholderText: {
                                    color: '#999'
                                }
                            }}
                            iconComponent={<AntDesign name="right" size={12} style={{ color: '#C1C1C1',marginLeft: 10 }}/>}
                            onDateChange={(date) => {this.setState({date: date})}}
                                    />
                    </View>
                </View> 
                <View style={styles.itemStyle}>
                    <Image source={require('../../image/workStatus/stop.png')} style={{marginRight: 10}}/>
                    <View style={styles.contentView}>
                        <Text>结束日期</Text>
                        <DatePicker
                            style={{width: 190}}
                            date={this.state.date1}
                            mode="datetime"
                            placeholder="请选择结束时间"
                            format="YYYY-MM-DD HH:mm"
                            minDate={this.state.date? moment(parseTime(this.state.date)+60000).format('YYYY-MM-DD HH:mm'): moment().format('YYYY-MM-DD HH:mm')}
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
                            iconComponent={<AntDesign name="right" size={12} style={{ color: '#C1C1C1',marginLeft: 10 }}/>}
                            onDateChange={(date) => {this.setState({date1: date})}}
                        />
                    </View>
                </View>
                { showMoreSearch  ?<TouchableOpacity style={[styles.itemStyle,{height: 50,justifyContent: "space-between",paddingRight: 10}]} onPress={this.chooseReportPerson}>
                      <View style={{flexDirection: "row",alignItems: "center"}}>
                          <View style={{flexDirection: "row"}}>
                              <Image source={require('../../image/troubleQuery/user.png')} style={{marginRight: 3}}/>
                          </View>
                          <Text style={{color: "#666", fontSize: 14,marginLeft: 9}}>维修责任人</Text>
                      </View>
                      <View style={{flexDirection: "row", alignItems: "center"}}>
                          <Text style={{fontSize: 14, color: "#999999"}}>{this.state.selectPeople.fId ? this.state.selectPeople.fName : '不限'}</Text>
                          {
                              this.state.selectPeople.fId ? 
                              <TouchableOpacity onPress={()=>this.setState({ selectPeople: null })}>
                                  <AntDesign name="closecircleo" size={12} style={{ color: '#C1C1C1',marginLeft: 5 }} />
                              </TouchableOpacity>
                              :
                              <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 5 }}/>
                          }
                      </View>
                  </TouchableOpacity>: null }
                { showMoreSearch && this.state.type == 4 ? 
                <TouchableOpacity style={[styles.itemStyle, {paddingBottom: 5}]} onPress={this.chooseAlldDevice}>
                    <Image source={require('../../image/workStatus/cash-register.png')} style={{marginRight: 10}}/>
                    <View style={[styles.contentView]}>
                        <Text>维修设备</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Text style={{color: '#999',marginRight: 2}}>{deviceData&&deviceData.fName? deviceData.fName : '请输入维修设备'}</Text>
                            <AntDesign name="right" color="#C1C1C1"/>
                        </View>
                    </View>
                </TouchableOpacity> : null }
                { showMoreSearch && this.state.type == 4 ? 
                <TouchableOpacity style={[styles.itemStyle, {paddingBottom: 5}]} onPress={this.chooseDeviceLevel}>
                    <Image source={require('../../image/troubleDetails/leavel.png')} style={{marginRight: 10}}/>
                    <View style={[styles.contentView]}>
                        <Text>设备级别</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Text style={{color: '#999',marginRight: 2}}>{levelData&&levelData.fName?levelData.fName: '请选择维修级别'}</Text>
                            <AntDesign name="right" color="#C1C1C1"/>
                        </View>
                    </View>
                </TouchableOpacity> : null }
                { showMoreSearch && this.state.type == 4 ? 
                <TouchableOpacity style={[styles.itemStyle, {paddingBottom: 5}]} onPress={this.chooseManufacturer}>
                    <Image source={require('../../image/workStatus/user-group-fill.png')} style={{marginRight: 10}}/>
                    <View style={[styles.contentView]}>
                        <Text>设备厂商</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Text style={{color: '#999',marginRight: 2}}>{manufacturerData&&manufacturerData.fName?manufacturerData.fName: '请选择设备厂商'}</Text>
                            <AntDesign name="right" color="#C1C1C1"/>
                        </View>
                    </View>
                </TouchableOpacity> : null }
                { showMoreSearch? 
                <TouchableOpacity style={[styles.itemStyle, {paddingBottom: 5}]} onPress={this.chooseMaintenanceType}>
                    <Image source={require('../../image/troubleDetails/leavel.png')} style={{marginRight: 10}}/>
                    <View style={[styles.contentView]}>
                        <Text>维修级别</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Text style={{color: '#999',marginRight: 2}}>{maintenanceData&&maintenanceData.fName?maintenanceData.fName: '请选择维修级别'}</Text>
                            <AntDesign name="right" color="#C1C1C1"/>
                        </View>
                    </View>
                </TouchableOpacity> : null}
                <TouchableOpacity onPress={()=>this.setState({showMoreSearch: !showMoreSearch})} style={{justifyContent: 'center',alignItems: 'center',backgroundColor:'#fff',paddingTop: 5,paddingBottom: 5}}>
                      <AntDesign name={showMoreSearch ? 'up' : 'down'}/>
                  </TouchableOpacity>
            </View>
            <View style={styles.pannelView}>
                <View style={styles.rowTextView}>
                  <Text style={{fontSize: 16,color: '#000',fontWeight: 'bold'}}>维修概况</Text>
                </View>
                <View style={{ flexDirection: 'row',paddingBottom: 15,flexWrap: 'wrap',borderBottomColor: '#f0f0f0',borderBottomWidth: 1}}>
                            {
                                this.state.option.length >4 ?
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <View style={{display: "flex", flexDirection:"row"}}>
                                        {this.state.option.map((item,index) => {
                                                return (<View style={{width: 130,height: 100,position: 'relative'}}>
                                                <ECharts option={item.option} key={index}/>
                                                <View style={styles.hideLine}/>
                                                <Text style={styles.echartsText}>{item.fName}</Text>
                                            </View>)
                                        })}
                                    </View>
                                </ScrollView>
                                    :
                                <View style={{display: "flex", flexDirection:"row",justifyContent:"space-between",width: "100%"}}>
                                    {this.state.option.map((item,index) => {
                                        return (<View style={{height: 100,position: 'relative',width: 100}}>
                                        <ECharts option={item.option} key={index}/>
                                        <View style={styles.hideLine}/>
                                        <Text style={styles.echartsText}>{item.fName}</Text>
                                    </View>)
                                    })}
                                </View>
                            }
                </View>
            </View>
          </View>)
    }
    renderItem = ({item,index}) => {
        return(<TouchableOpacity style={{backgroundColor: '#fff',marginBottom: 10,marginLeft: 10,marginRight: 10}} onPress={() => {this.props.navigation.navigate('MaintainAdd',{getDetailId: item.fId})}}>
                        <View style={styles.recordDetail}>
                            <View style={{flexDirection: "row"}}>
                                <View style={[styles.rowStyle,{marginRight: 40}]}>
                                    <Text style={styles.recordLabel}>维修时间</Text> 
                                    <Text style={styles.recordValue}>{parseDate(item.fBeginTime,'YYYY-MM-DD HH:mm')}</Text> 
                                </View>
                                <View style={styles.rowStyle}>
                                    <Text style={styles.recordLabel}>维修时长</Text> 
                                    <Text style={styles.recordValue}>{isDot((parseTime(item.fEndTime)-parseTime(item.fBeginTime))/3600000)}小时</Text> 
                                </View>
                            </View>
                            
                            <View style={styles.rowStyle}>
                                <Text style={styles.recordLabel}>维修负责人</Text> 
                                {
                                    item.tMaintenanceUsers.map((item) => {
                                        return(<Text style={[styles.recordValue,{marginRight: 5}]}>{item.fUserName}</Text>)
                                    })
                                }
                             
                            </View>
                            <View style={styles.rowStyle}>
                                <Text style={styles.recordLabel}>维修级别</Text> 
                                <Text style={[styles.recordValue, {color: '#4058FD'}]}>{item.fMaintenanceTypeName}</Text> 
                            </View>
                        </View>
                    </TouchableOpacity>
        )
    }
    render() {
        
         return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText={'设备维修'}
                    props={this.props}
                    hidePlus= {this.state.type == 1? true: false}
                    rightBtn={
                        this.state.type == 1?
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('MaintainAdd',{initData: this.initData,fId: this.props.navigation.state.params.detail.fId? this.props.navigation.state.params.detail.fId: ''})}}>
                          <Text style={{color: '#fff',fontSize: 14,marginRight: 5}}>添加维修</Text>
                        </TouchableOpacity> : null
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
                        ListFooterComponent={this._createListFooter.bind(this)}
                        ListEmptyComponent={<Text style={{width, textAlign: 'center',marginTop: 10,color: '#c9c9c9', paddingBottom: 50}}>暂无数据</Text>}
                        onEndReached={() => this._onLoadMore()}
                        ListHeaderComponent={this._createListHeader.bind(this)}
                        onEndReachedThreshold={0.1}
                        // ItemSeparatorComponent={()=>this._separator()}
                    /> 
              
            </View>
        );
    }
}



const styles = StyleSheet.create({
      hideLine: {
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
        position: 'absolute',
        bottom: 13
      },
    echartsView: {
        width: 100,
        height: 100,
        position: 'relative'
    },
    
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        
        height: 50,
        
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    contentView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        paddingRight: 10
    },
    pannelView: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#fff',
        marginTop: 10,
        borderRadius: 4,
        marginTop: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    content: {
        backgroundColor: '#F4F4F4',
        padding: 10
    },
    
    echartsText: {
        color: '#666666',
        fontSize: 12,
        textAlign: 'center'
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
        borderBottomColor: '#E0E0E0',
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
    recordDetail: {
      padding: 10,
      paddingTop: 10,
      paddingBottom: 15
      ,borderBottomColor:"#E0E0E0",
      borderBottomWidth: 1
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
      marginLeft: 10
    },
    item: {
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 10,
        paddingBottom: 10
    },
});
