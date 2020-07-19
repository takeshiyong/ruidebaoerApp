import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,Modal,Switch, ScrollView,Image,TextInput} from 'react-native';
import Header from '../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import Picker from 'react-native-wheel-picker';
import IntegralServer from '../../service/integralServer';
import Toast from '../../components/toast';
import {parseDate,parseTime,isDot} from '../../utils/handlePhoto';


const {width, height} = Dimensions.get('window');
const PickerItem = Picker.Item;
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        fShelfOnPrice: null,
        fShelfOnNumber: null,
        fShelfOnTime:null,
        fIsDiscount: false,
        fDiscountNumber: null,
        typeData: 1,
        fShelfOnTimes: null
    }
    componentDidMount() {
        console.log(this.props.navigation.state.params)
        if(this.props.navigation.state.params&&this.props.navigation.state.params.item){
            this.setData(this.props.navigation.state.params.item)
        }
        if(this.props.navigation.state.params&&this.props.navigation.state.params.listItem&&this.props.navigation.state.params.id&&this.props.navigation.state.params.formerlyInter){
            this.setAnotherData(this.props.navigation.state.params.listItem,this.props.navigation.state.params.formerlyInter)
        }
    }
    setData = (data) =>{
        this.setState({
            id: data.fId,
            fShelfOnPrice: data.fCommPrice+'',
            fShelfOnTime: data.fCommIntegral+'',
            fShelfOnTimes: data.fCommIntegral+'',
            typeData: 1
        })
    }
    setAnotherData = (data,formerlyInter) =>{
        this.setState({
            fShelfOnNumber: data.fShelfOnNumber+ '',
            fShelfOnPrice: data.fShelfOnPrice+'',
            fShelfOnTime: data.fShelfOnTime+'',
            fShelfOnTimes: formerlyInter+'',
            fIsDiscount: data.fIsDiscount,
            fDiscountNumber: data.fDiscountNumber?data.fDiscountNumber+'': data.fDiscountNumber,
            typeData: 2
        })
    }
    
    //开关按钮
    changeSwitch = (value) => {
        this.setState({fIsDiscount: value},() => {
            if(!this.state.fIsDiscount){
                this.setState({
                    fShelfOnTime: this.state.fShelfOnTimes,
                    fDiscountNumber: null,
                })
            }
        })
    }
    //上架
    insertTCommDetai = async () => {
        const { fShelfOnPrice,fShelfOnNumber,fShelfOnTime,fIsDiscount,fDiscountNumber } = this.state;
        
        if(fShelfOnNumber == null){
            Toast.show('上架数量不能为空');
            return;
        }else{
            if(isNaN(fShelfOnNumber*1)){
                Toast.show('上架数量只能为数字类型');
                return;
            }
        }
        if(fIsDiscount){
            if(fDiscountNumber == null||fDiscountNumber ==''){
                Toast.show('折扣数量不能为空');
                return;
            }else if(isNaN(fDiscountNumber*1)){
                Toast.show('折扣数量只能为数字类型');
                    return;
            }else if(fDiscountNumber >= 10){
                Toast.show('折扣数量不能大于等于10');
                return;
            }
        }
        
        if(fShelfOnTime == null){
            Toast.show('上架积分不能为空');
            return;
        }else{
            if(isNaN(fShelfOnTime*1)){
                Toast.show('上架积分只能为数字类型');
                return;
            }
        }
        const res = await IntegralServer.insertTCommDetai({
            fCommodityId: this.props.navigation.state.params.item.fId,
            fDiscountNumber: fDiscountNumber?fDiscountNumber: null,
            fShelfOnNumber: fShelfOnNumber,
            fShelfOnPrice: fShelfOnPrice,
            fShelfOnTime:fShelfOnTime,
            fIsDiscount:fIsDiscount
        })
        if(res.success){
            Toast.show(res.msg);
            this.props.navigation.state.params.getTCommCategory()
            this.props.navigation.pop();
        }else{
            Toast.show(res.msg);
        }
    }
    //上架积分设置
    setIntervalPrice = (text) => {
        if(this.state.fIsDiscount&&text.trim() != ''&&text.trim() != null){
            this.setState({
                fDiscountNumber: text.trim(),
            },() => {
                this.setState({
                    fShelfOnTime: isDot((this.state.fDiscountNumber/10)*this.state.fShelfOnTimes)+''
                })
            })
        }else{
            this.setState({
                fDiscountNumber: text.trim()
            });
        }
    }
    //编辑修改0
    updateShellOnRecord = async() => {
        const { fShelfOnPrice,fShelfOnNumber,fShelfOnTime,fIsDiscount,fDiscountNumber } = this.state;
        
        if(fShelfOnNumber == null){
            Toast.show('上架数量不能为空');
            return;
        }else{
            if(isNaN(fShelfOnNumber*1)){
                Toast.show('上架数量只能为数字类型');
                return;
            }
        }
        if(fIsDiscount){
            if(fDiscountNumber == null||fDiscountNumber ==''){
                Toast.show('折扣数量不能为空');
                return;
            }else if(isNaN(fDiscountNumber*1)){
                Toast.show('折扣数量只能为数字类型');
                    return;
            }else if(fDiscountNumber >= 10){
                Toast.show('折扣数量不能大于等于10');
                return;
            }
        }
        if(fShelfOnTime == null){
            Toast.show('上架积分不能为空');
            return;
        }else{
            if(isNaN(fShelfOnTime*1)){
                Toast.show('上架积分只能为数字类型');
                return;
            }
        }
        const res = await IntegralServer.updateShellOnRecord({
            fCommodityId: this.props.navigation.state.params.listItem.fCommodityId,
            fDiscountNumber: fDiscountNumber?fDiscountNumber: null,
            fShelfOnNumber: fShelfOnNumber,
            fShelfOnPrice: fShelfOnPrice,
            fShelfOnTime:fShelfOnTime,
            fIsDiscount:fIsDiscount,
            fId: this.props.navigation.state.params.listItem.fId,
            fExchangeNumber: this.props.navigation.state.params.listItem.fExchangeNumber,
            fShelfOnStatus: this.props.navigation.state.params.listItem.fShelfOnStatus,
            fShelfOffTime: this.props.navigation.state.params.listItem.fShelfOffTime
        })
        if(res.success){
            Toast.show(res.msg);
            this.props.navigation.state.params.selectCommMobeilByPage(this.props.navigation.state.params.id)
            this.props.navigation.pop();
        }else{
            Toast.show(res.msg);
        }
    }
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="上架商品"
                    hidePlus={false} 
                    props={this.props}
                />
                <ScrollView>
                    <View style={styles.content}>
                    
                    <View style={styles.item}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Text style={{color: "#333333", fontSize: 14}}>商品积分</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Text style={{color: "#333",textAlign: "center"}}>{this.state.fShelfOnTimes}</Text>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Text style={{color: "#333333", fontSize: 14}}>上架数量</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <TextInput
                                style={{height: "100%", borderWidth: 0,color: "#333",textAlign: "right"}}
                                placeholder="请输入上架数量"
                                multiline={false}
                                maxLength={8}
                                placeholderTextColor= "#999"
                                value={this.state.fShelfOnNumber}
                                onChangeText={(text)=>{
                                    this.setState({
                                        fShelfOnNumber: text.trim()
                                    });
                                  }}
                            />
                        </View>
                    </View>
                    <View style={[styles.item,{height: 47}]}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Image source={require("../../image/carshops/sync.png")} style={{width: 14,height: 14,marginRight: 5,marginLeft: 2}}/>
                            <Text style={{color: "#333333", fontSize: 14,fontWeight: "600",marginLeft: 5}}>是否打折</Text>
                        </View>
                        <Switch
                            style={{width: 30,marginRight: 5}}
                            //动态改变value
                            value={this.state.fIsDiscount}
                            //当切换开关室回调此方法
                            onValueChange={(value)=>{this.changeSwitch(value)}}
                            thumbColor = "#5970FE"
                        />
                    </View>
                    
                    {
                        this.state.fIsDiscount?
                        <View style={styles.item}>
                            <View style={{flexDirection: "row",alignItems: "center"}}>
                                <Text style={{color: "#333333", fontSize: 14}}>折扣数量</Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <TextInput
                                    style={{height: "100%", borderWidth: 0,color: "#333",textAlign: "right"}}
                                    placeholder="请输入折扣数量(例如5折请入5)"
                                    multiline={false}
                                    maxLength={8}
                                    placeholderTextColor= "#999"
                                    value={this.state.fDiscountNumber}
                                    onChangeText={(text) => this.setIntervalPrice(text)}
                                />
                            </View>
                        </View>
                        : null
                    }
                    <View style={styles.item}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Text style={{color: "#333333", fontSize: 14}}>上架积分</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <TextInput
                                style={{height: "100%", borderWidth: 0,color: "#333",textAlign: "right"}}
                                placeholder="请输入上架积分"
                                multiline={false}
                                maxLength={8}
                                placeholderTextColor= "#999"
                                value={this.state.fShelfOnTime}
                                onChangeText={(text)=> { 
                                    this.setState({
                                        fShelfOnTime: text.trim()
                                    })
                                }}
                            />
                        </View>
                    </View>
                </View>
                    
                    <View style={{paddingLeft: 16,paddingRight: 16}}>
                        <TouchableOpacity style={{width: "100%",height: 44,backgroundColor: "#4058FD",borderRadius: 5,marginTop: 16}} onPress={() => {this.state.typeData == 1? this.insertTCommDetai() : this.updateShellOnRecord()}}>
                            <Text style={{fontSize: 16,color: "#fff",textAlign: "center",lineHeight: 44}}>提交</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        backgroundColor: '#F4F4F8',
        display: "flex"
    },
    content:{
        width: "100%",
        marginTop: 12,
        backgroundColor: "#fff",
        borderTopLeftRadius:5,
        borderTopRightRadius: 5,
        paddingLeft: 17,
        paddingRight: 17
    },
    item: {
        borderBottomColor: "#F6F6F6",
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        height: 48
    },
    photoBox: {
        width: "100%",
        height: 183,
        backgroundColor: "#fff",
        marginTop: 12,
        paddingLeft: 16,
        paddingRight: 16
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
    publishButton: {
        width: width-32,
        height:44,
        backgroundColor: "#4058FD",
        borderRadius: 5,
        marginTop: 17,
        alignItems: "center",
        justifyContent: "center"
    }
});
