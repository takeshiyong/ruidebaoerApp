import React from "react";
import { ActivityIndicator, StyleSheet, Text, View,Dimensions,TouchableOpacity, TouchableHighlight,Image,TextInput} from "react-native";
import Toast from './toast';
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
import QRCode from 'react-native-qrcode-svg';
import { parseTime, parseDate } from '../utils/handlePhoto';
import config from '../config/index';

/**
 * 封装商城点击使用，兑换组件
 *  开启  
 *  关闭   
 */
 
export default class showModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal : false,
            num: 1,
            type: "",
            content: '',
            item:{}
        };
    }
    show = (item) => {
      this.setState({showModal: true})
      if(item){
          console.log(item);
          this.setState({
            item,
            text: item.fId?item.fId:'',
            num: 1
          })
      }
    };
    hide = () => {
      this.setState({
          showModal: false,
          num: 1
        })
    };
    //确认输入内容
    affirm = () => {
        if(this.state.content.trim() == ''){
            Toast.show('输入内容不能为空')
        }else{
            this.hide();
            this.props.getCancelContent(this.state.content)
            this.setState({
                content: ''
            })
        }
    };
    //确认不参加
    affirms = () => {
            this.hide();
            this.props.getParticipate(this.state.content)
            this.setState({
                content: ''
            })
    };
    //确认取消
    affirmCancel = () => {
        this.hide();
        Toast.show('您已取消操作')
        
    }
    render() {
        const { type, affirmContent} = this.props;
        const {item} = this.state;
        if (!this.state.showModal) {
            return null;
        }
        return (
            <View style={{
                flex : 1,
                width : width,
                height : height,
                position : 'absolute',
                backgroundColor : '#10101099',
            }}>
                
                    {type == 'RedeemQRCode'?  //扫描
                        <TouchableHighlight style={{width: "100%",height: "100%",alignItems: "center",justifyContent: "center"}} onPress={() => this.hide()}>
                                <View style={{width: 350,height: 450,backgroundColor: "#fff",alignItems: "center",paddingTop: 21,paddingBottom: 23}}>
                                    <View style={styles.topBox}>
                                        <View style={{flexDirection: "row"}}>
                                            <Image style={{width: 44,height: 44,marginRight: 16,backgroundColor: "#E0E0E0"}} source={{uri: (config.imgUrl+item.fCommPath)}}/>
                                            <View>
                                                <View style={{flexDirection: "row"}}>
                                                    <Text style={{color: "#333",marginRight: 10}}>{item.fCommName?item.fCommName: '--'}</Text>
                                                    <Text style={{color: "#333"}}>{item.fCommSpecification?item.fCommSpecification: '--'} *{item.fExchangeNumber?item.fExchangeNumber: '--'}</Text>
                                                </View>
                                                <Text style={{marginTop: 8,color: "#999",fontSize: 12}}>有效期至：{item.fValidTime?parseDate(item.fValidTime,'YYYY-MM-DD HH:mm'): "--"}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.useText}>
                                            <Text style={{color: '#FF632E'}}>{item.fOrderStatus == 1?'未兑换': (item.fOrderStatus == 2? "已兑换": '已过期')}</Text>
                                        </View>
                                    </View>  
                                    <Text style={{color: "#333",marginTop: 10}}>总价{item.fIntegralNumber !=null? item.fIntegralNumber: '--'} 积分</Text>
                                    <Text style={{fontSize: 14,color:"#333",marginTop: 5}}>兑换商品时请出示此码</Text>
                                    {
                                        this.state.text? 
                                        <View style={{marginTop: 14}}>
                                        <QRCode
                                            value={this.state.text}
                                            size={225}
                                            />
                                        </View>
                                        :null
                                    }
                                    <Text style={{marginTop: 20,color: "#333",fontSize: 14}}>劵号：{item.fOrderNumber? item.fOrderNumber: '--'}</Text>
                                </View>
                        </TouchableHighlight>
                    : null}
                    

                    {type == "conversion"? //核销
                        <View style={{width: "100%",height: "100%",alignItems: "center",justifyContent: "center"}}>
                            <View style={{width: 240,backgroundColor: "#fff",alignItems: "center",paddingBottom: 12}}>
                                <View style={{width: "100%",height: 150,position: "relative"}}>
                                    <TouchableOpacity style={{width:22,height: 22,position: "absolute", right: 16,top: 12,zIndex: 999}} onPress={()=> {this.hide()}}>
                                        <Image style={{width:22,height: 22}} source={require('../image/showShopModal/close.png')}/>
                                    </TouchableOpacity>
                                    <Image style={{width: "100%",height: '100%',backgroundColor: "#E0E0E0"}} source={require("../image/integarlStore/shop.png")}/>
                                    <View style={styles.showNum}>
                                        <Text style={{fontSize: 10,color: '#666666'}}>库存: {item.fStock != null &&item.fExchangeNumber != null?(item.fStock-item.fExchangeNumber): '--'}</Text>
                                    </View>
                                </View>
                                <Text style={{color: "#333",fontSize: 14,fontWeight: "500",marginTop: 14}}>{item.fCommName?item.fCommName:'--'}</Text>
                                <View style={styles.numButtom}>
                                    <TouchableHighlight onPress={() => {this.setState({num: this.state.num <= 1 ? 1 : this.state.num-1})}}>
                                        <Text style={styles.cutButton}>-</Text>
                                    </TouchableHighlight>
                                    <Text style={styles.numStyle}>{this.state.num}</Text>
                                    <TouchableHighlight onPress={() => {this.setState({num: this.state.num+1})}}>
                                        <Text style={styles.addButton}>+</Text>
                                    </TouchableHighlight>
                                </View>
                                <Text style={{fontSize: 12,color: "#9A9A9A",marginTop: 15}}>本次兑换耗费{item.fShelfOnTime?item.fShelfOnTime*this.state.num:'--'}积分</Text>
                                <TouchableOpacity style={styles.button} onPress={() => {this.props.finishConversion(this.state.num,item)}}>
                                    <Text style={{fontSize: 14,color: "#fff"}}>立即兑换</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    :null}
                    {type == "conversionFish"? //结束核销
                        <TouchableHighlight style={{width: "100%",height: "100%",alignItems: "center",justifyContent: "center"}} onPress={() => {this.hide()}}>
                            <View style={{width: 240,height: 305,backgroundColor: "#fff",alignItems: "center",justifyContent: "center"}}>
                                <Image style={{width:110,height: 78}} source={require('../image/showShopModal/finish.png')}/>
                                <Text style={{marginTop: 28,color: "#333",fontSize: 16,fontWeight: "500"}}>兑换成功！</Text>
                            </View>
                        </TouchableHighlight>
                    :null}
                    
                    {type == "cancel"? //取消会议
                        <TouchableHighlight style={{width: "100%",height: "100%",alignItems: "center",justifyContent: "center"}}>
                            <View style={{width: width -20,height: 300,backgroundColor: "#fff",borderRadius: 5}}>
                                <View style={{paddingLeft: 15,paddingRight: 15,}}>
                                    <Text style={{fontSize: 16,color: "#333",fontWeight: "600",marginTop: 20}}>请输入取消会议的原因</Text>
                                    <View style={{width: "100%",height: 130,borderWidth: 1,marginTop: 10,marginBottom: 10,borderColor: "#E0E0E0"}}>
                                        <TextInput
                                            style={{height: "100%", borderWidth: 0,color: "#333",}}
                                            placeholder="请输入取消原因"
                                            multiline={false}
                                            textAlignVertical='top'
                                            placeholderTextColor= "#999"
                                            value={this.state.content}
                                            onChangeText={(text)=>{
                                                this.setState({
                                                    content: text.trim()
                                                });
                                            }}
                                        />
                                    </View>
                                    <Text>注: 会议取消后，系统会实时通知参会人及抄送人</Text>
                                </View>
                                <View style={styles.meetingBotton}>
                                    <TouchableOpacity style={styles.bottomLeft} onPress={() => {this.affirmCancel()}}>
                                        <Text style={{color: "#333", fontSize: 14}}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.bottomRight} onPress={() => {this.affirm()}}>
                                        <Text style={{color: "#fff", fontSize: 14}}>确认</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableHighlight>
                    :null}

                    {type == "affirm"? //开始会议
                        <TouchableHighlight style={{width: "100%",height: "100%",alignItems: "center",justifyContent: "center"}}>
                            <View style={{width: width-40,height: 180, backgroundColor: "#fff",borderRadius: 5}}>
                                <Text style={{marginBottom: 10,marginTop: 15,lineHeight: 24,paddingLeft: 15,paddingRight: 15}}>{affirmContent}</Text>
                                <View style={styles.meetingBotton}>
                                    <TouchableOpacity style={styles.bottomLeft} onPress={() => {this.affirmCancel()}}>
                                        <Text style={{color: "#333", fontSize: 14}}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.bottomRight} onPress={() => {this.hide();this.props.pushType('开始会议')}}>
                                        <Text style={{color: "#fff", fontSize: 14}}>确认</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableHighlight>
                    :null}
                    {type == "participate"? //无法参见会议
                        <TouchableHighlight style={{width: "100%",height: "100%",alignItems: "center",justifyContent: "center"}}>
                            <View style={{width: width -20,height: 270,backgroundColor: "#fff",borderRadius: 5}}>
                                <View style={{paddingLeft: 15,paddingRight: 15,}}>
                                    <Text style={{fontSize: 16,color: "#333",fontWeight: "600",marginTop: 20}}>请输入不方便参加的原因</Text>
                                    <View style={{width: "100%",height: 130,borderWidth: 1,marginTop: 10,marginBottom: 10,borderColor: "#E0E0E0"}}>
                                        <TextInput
                                            style={{height: "100%", borderWidth: 0,color: "#333",width: "100%"}}
                                            placeholder="请输入不方便参加的原因"
                                            multiline={true}
                                            textAlignVertical='top'
                                            placeholderTextColor= "#999"
                                            value={this.state.content}
                                            numberOfLines={10}
                                            onChangeText={(text)=>{
                                                this.setState({
                                                    content: text.trim()
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.meetingBotton}>
                                    <TouchableOpacity style={styles.bottomLeft} onPress={() => {this.affirmCancel()}}>
                                        <Text style={{color: "#333", fontSize: 14}}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.bottomRight} onPress={() => {this.affirms()}}>
                                        <Text style={{color: "#fff", fontSize: 14}}>确认</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableHighlight>
                    :null}
                    {type == "dismiss"? //结束会议
                        <TouchableHighlight style={{width: "100%",height: "100%",alignItems: "center",justifyContent: "center"}}>
                            <View style={{width: width -50,height: 170,backgroundColor: "#fff",borderRadius: 5,alignItems: "center"}}>
                                <Text style={{fontSize: 16,color: "#333",fontWeight: "600",marginTop: 40,marginBottom: 20}}>会议结束后，摄像设备将停止录像</Text>
                                <View style={styles.meetingBotton}>
                                    <TouchableOpacity style={styles.bottomLeft} onPress={() => {this.affirmCancel()}}>
                                        <Text style={{color: "#333", fontSize: 14}}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.bottomRight} onPress={() => {this.hide();this.props.pushType("结束会议")}}>
                                        <Text style={{color: "#fff", fontSize: 14}}>确认</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableHighlight>
                    :null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    numStyle: {
        fontSize: 16,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 20,
        paddingRight: 18,
        borderColor: "#E0E0E0",
        fontWeight: "500"
    },
    button: {
        width: 208,
        height: 44,
        backgroundColor: "#4058FD",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        marginTop: 14,
    },
    numButtom:{
        borderWidth: 1,
        borderColor: "#E0E0E0",
        flexDirection: "row",
        borderRadius: 5,
        alignItems: "center",
        marginTop: 14
    },
    showNum: {
        width: 60,
        height: 20,
        backgroundColor: "#E0E0E0",
        alignItems: "center", 
        justifyContent: "center",
        position: 'absolute',
        bottom: 12,
        right: 12
    },
    topBox:{
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "#E7E7E7",
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingBottom: 16,
        alignItems: "center"
    },
    useText:{
        width: 56,
        height: 20,
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#FFECE6",
        borderRadius: 5,
        marginLeft: 10
    },
    addButton: {
        fontSize: 22,
        padding: 8,
        backgroundColor: "#F6F6F6",
        paddingLeft: 12,
        paddingRight: 12
    },
    cutButton: {
        fontSize: 22,
        padding: 8,
        backgroundColor: "#F6F6F6",
        paddingLeft: 12,
        paddingRight: 12
    },
    meetingBotton: {
        height: 59,
        alignItems: "center", 
        paddingLeft: 16, 
        paddingRight: 16, 
        flexDirection: "row", 
        justifyContent: "space-between",
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: "#fff",
        marginTop: 10
    },
    bottomLeft: {
        flex: 2,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
        height: "100%",
        borderRadius: 5
    },
    bottomRight: {
        flex: 3,
        backgroundColor: "#4058FD", 
        alignItems: "center", 
        justifyContent: "center",
        height: "100%",
        borderRadius: 5
    }
});
