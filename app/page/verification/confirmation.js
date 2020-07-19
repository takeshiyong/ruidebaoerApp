import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView,Image,ImageBackground} from 'react-native';
import Header from '../../components/header';
import IntegralServer from '../../service/integralServer';
import { parseTime, parseDate } from '../../utils/handlePhoto';
import config from '../../config';
import Toast from '../../components/toast';



const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null,
        
    });
    state ={
        obj: {}
    }
    componentDidMount () {
        console.log(this.props.navigation.state.params)
        if(this.props.navigation.state.params&&this.props.navigation.state.params.id){
            this.getForDetails(this.props.navigation.state.params.id)
        }
    }
    //核销确认页核销信息
    getForDetails = async (id) => {
        const res = await IntegralServer.getForDetails(id);
        if(res.success){
            this.setState({
                obj: res.obj
            })
        }else{
            console.log(res.msg)
        }
        console.log(res)
    }
    affrim = async (id) => {
        const res = await IntegralServer.writeOffStatus(id);
        console.log(res);
        if(res.success){
            Toast.show(res.msg)
            this.props.navigation.replace('VerificationSuccess',{obj: this.state.obj});
        }else{
            console.log(res.msg)
        }
    }
    render() {
        const { pop } = this.props.navigation;
        const { obj } = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="核销信息"
                    hidePlus={false} 
                    props={this.props}
                />
                <View style={{paddingLeft: 16,paddingRight: 16,backgroundColor: "#fff"}}>
                    <View style={styles.topBar}>
                        <View style={{flexDirection: "row"}}>
                            <Text style={{fontSize: 14,color: "#333",marginRight: 8}}>{obj.fCommName?obj.fCommName: '--'}</Text>
                            <Text style={{fontSize: 14,color: "#333"}}>{obj.fCommSpecification?obj.fCommSpecification:'--'}</Text>
                            <Text style={{fontSize: 14,color: "#333"}}>*{obj.fCommodityNumber!=null?obj.fCommodityNumber:'--'}</Text>
                        </View>
                        <View style={styles.useBox}>
                            <Text style={{fontSize: 14,color: "#1ACFAA"}}>{obj.fIsConversion? (obj.fIsConversion==1?'未兑换': (obj.fIsConversion==2?'已兑换':'已过期')): '--'}</Text>
                        </View>
                    </View>
                    <View style={{width: "100%",alignItems: "center"}}>
                        <Image style={{width:166,height: 150,backgroundColor: "#E0E0E0",marginTop: 35,marginBottom: 16}} source={{uri: config.imgUrl+obj.fCommPath}}/>
                        <Text style={{fontSize: 12,color: "#999",marginBottom: 36}}>有效期至：{obj.fValidTime? parseDate(obj.fValidTime,'YYYY-MM-DD HH:mm'): '--'}</Text>
                    </View>
                </View>
                {
                    obj.fIsConversion&&obj.fIsConversion==1?
                <View style={{paddingLeft: 16,paddingRight: 16,width: width,flexDirection: "row",marginTop: 16}}>
                    <TouchableOpacity style={styles.cannelButton} onPress={() => {this.props.navigation.pop()}}>
                        <Text style={{color: "#333",fontSize: 14}}>取消核销</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.successButton} onPress={() => {this.affrim(obj.fOrderNumber)}}>
                        <Text style={{color: "#fff",fontSize: 14}}>确定核销</Text>
                    </TouchableOpacity>
                </View>:null
                }
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
    topBar: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 48,
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 1,
        alignItems: "center"
    },
    useBox: {
        width: 56,
        height: 20,
        backgroundColor: "#D2FFF6",
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    },
    cannelButton: {
        flex: 3,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        height: 42,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        marginRight: 13
    },
    successButton: {
        flex: 7,
        height: 42,
        backgroundColor: "#4058FD",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5
        
    }
});

