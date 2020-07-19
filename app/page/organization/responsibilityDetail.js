import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,TextInput,ImageBackground, ScrollView,Image, FlatList,RefreshControl} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';

import organizationServer from '../../service/organizationServer';
import Header from '../../components/header';
import Toast from '../../components/toast';
import SelectAnotherPeople from '../../components/selectAnotherPeople';
import { parseTime, parseDate } from '../../utils/handlePhoto';
import ShowDonwModal from './showDonwModal';


const {width, height} = Dimensions.get('window');
export default  class Organize extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
            obj: {}
        };
    }

    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state && this.props.navigation.state.params.item) {
          this.securityTargetSelectById(this.props.navigation.state.params.item.fId);
      }
      
    }
    securityTargetSelectById =  async(id) => {
        const res = await organizationServer.securityTargetSelectById(id);
        console.log(res);
        if(res.success){
            this.setState({
                obj: res.obj
            })
        }else{

        }
    }
    getDetailWay = (fType) => {
        switch (fType){
            case 'jpeg': 
                return require('../../image/documentIcon/image.png');
            case 'gif': 
                return require('../../image/documentIcon/image.png');
            case 'png': 
                return require('../../image/documentIcon/image.png');
            case 'pdf': 
                return require('../../image/documentIcon/pdf.png');
            case 'ppt': 
                return require('../../image/documentIcon/ppt.png');
            case 'xls':
                return require('../../image/documentIcon/excel.png');
            case 'xlsx':
                return require('../../image/documentIcon/excel.png');
            case 'doc':
                return require('../../image/documentIcon/word.png');
            case 'docx':
                return require('../../image/documentIcon/word.png');
            default:
                return require('../../image/documentIcon/unfile.png');
        } 
        
    }
    render() {
        const { pop } = this.props.navigation;
        const { obj } = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="责任书详情"
                    hidePlus={true} 
                />
                <View style={{padding: 10}}>
                    <View style={[styles.itemStyle,{ flexDirection: "row"}]}>
                        <Text style={styles.titleText}>标题:</Text>
                        <Text style={styles.conText}>{obj.fName?obj.fName: '--'}</Text>
                    </View>
                    <View style={[styles.itemStyle,{ flexDirection: "row",marginTop: 10}]}>
                        <Text style={styles.titleText}>内容:</Text>
                        <Text style={styles.conText}>{obj.fCount?obj.fCount: '--'}</Text>
                    </View>
                    <View style={[styles.itemStyle,{marginTop: 10}]}>
                        <View style={{flexDirection:"row",alignItems: "center",justifyContent: 'space-between'}}>
                            <View style={{flexDirection:"row",alignItems: "center"}}>
                                <Text style={styles.titleText}>甲方:</Text>
                                <Text style={{fontSize: 16,color: "#333"}}>{obj.fOwners?obj.fOwners.length:'--'}人</Text>
                            </View>
                            {obj.fOwners&&obj.fOwners.length>5?
                            <TouchableOpacity style={{flexDirection:"row",alignItems: "center"}} onPress = {() => {this.props.navigation.navigate('ShowPeople',{peopleList:obj.fOwners})}}>
                                <Text>查看更多</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#666666', marginLeft: 13 }}/>
                            </TouchableOpacity>: null}
                        </View>
                        {
                        obj.fOwners&&obj.fOwners.length>0?
                            <View style={{flexDirection: 'row',alignItems: "center",marginTop: 5}}>
                                { obj.fOwners.slice(0,5).map((item)=>{
                                    return (
                                        <View style={styles.userIcon} key={item.fId}>
                                        <View style={styles.userImgs}>
                                            <View style={styles.userImg}>
                                                <Text style={{fontSize: 14,color: "white"}}>
                                                    {item.fUserName ? item.fUserName.substr(item.fUserName.length-2,2) : ''}
                                                </Text>
                                            </View> 
                                        </View>
                                        <Text style={{width: '100%',textAlign: 'center',fontSize: 13}} numberOfLines={1}>{item.fUserName}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        :null}
                    </View>
                    <View style={[styles.itemStyle,{marginTop: 10}]}>
                        <View style={{flexDirection:"row",alignItems: "center",justifyContent: 'space-between'}}>
                            <View style={{flexDirection:"row",alignItems: "center"}}>
                                <Text style={styles.titleText}>乙方:</Text>
                                <Text style={{fontSize: 16,color: "#333"}}>{obj.fSeconds?obj.fSeconds.length:'--'}人</Text>
                            </View>
                            {obj.fSeconds&&obj.fSeconds.length>5?
                            <TouchableOpacity style={{flexDirection:"row",alignItems: "center"}} onPress = {() => {this.props.navigation.navigate('ShowPeople',{peopleList:obj.fSeconds})}}>
                                <Text>查看更多</Text>
                                <AntDesign name={'right'} size={12} style={{ color: '#666666', marginLeft: 13 }}/>
                            </TouchableOpacity>: null}
                        </View>
                        {
                        obj.fSeconds&&obj.fSeconds.length>0?
                            <View style={{flexDirection: 'row',alignItems: "center",marginTop: 5}} >
                                { obj.fSeconds.slice(0,5).map((item)=>{
                                    return (
                                        <View style={styles.userIcon} key={item.fId}>
                                        <View style={styles.userImgs}>
                                            <View style={styles.userImg}>
                                                <Text style={{fontSize: 14,color: "white"}}>
                                                    {item.fUserName ? item.fUserName.substr(item.fUserName.length-2,2) : ''}
                                                </Text>
                                            </View> 
                                        </View>
                                        <Text style={{width: '100%',textAlign: 'center',fontSize: 13}} numberOfLines={1}>{item.fUserName}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        :null}
                    </View>
                    <View style={[styles.itemStyle,{ flexDirection: "row",marginTop: 10}]}>
                        <Text style={styles.titleText}>签订日期:</Text>
                        <Text style={styles.conText}>{obj.fSignedTime?parseDate(obj.fSignedTime,'YYYY.MM.DD'): '--'}</Text>
                    </View>
                    {
                        obj.tFiles&&obj.tFiles.length> 0?
                        <View style={[styles.itemStyle,{marginTop: 10,marginBottom: 5}]}>
                            <Text style={styles.titleText}>附件:</Text>
                            {
                                 obj.tFiles.map((item) => {
                                    return(<TouchableOpacity style={{flexDirection: "row",paddingTop: 10,paddingBottom: 10,alignItems: "center"}} onPress={() => {this.ShowModal.show(item)}}>
                                    <Image source={this.getDetailWay(item.fCoursewareTitle)} style={{width: 40, height: 40}}/>
                                    <View style={{marginLeft: 10,alignItems: "center"}}>
                                        <Text style={{color: "#333"}}>{item.fFileName?item.fFileName:'--'}</Text>
                                    </View>
                                </TouchableOpacity>)
                                })
                            }
                        </View>
                       
                        
                        :null
                    }
                </View>
                <ShowDonwModal ref={(ref)=>this.ShowModal = ref} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#F4F4F8',
    },
    itemStyle: {
       
        backgroundColor: "#fff",
        width: "100%",
        padding: 10,
        borderRadius: 5
    },
    titleText: {
        fontSize: 16,
        color: "#333",
        marginRight: 10,
        fontWeight: '500'
    },
    conText: {
        fontSize: 16,
        color: "#333",
        flex: 1
    },
    userIcon: {
        alignItems: 'center',
        width: 70,
        height: 70,
        position: 'relative'
      },
    userImgs:{
        width: 47,
        height: 48,
        backgroundColor: "#D9DEFF",
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
      },
    userImg:{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: "#4058FD",
          alignItems: "center",
          justifyContent: "center"
      },
    
});
