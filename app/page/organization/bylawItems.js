import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,TextInput,ActivityIndicator, ScrollView,Image, FlatList,RefreshControl} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import SplashScreen from 'react-native-splash-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import organizationServer from '../../service/organizationServer';
import Header from '../../components/header';
import Toast from '../../components/toast';
import { parseTime, parseDate } from '../../utils/handlePhoto';
import ShowDonwModal from './showDonwModal';

const PAGESIZE = 10;
const {width, height} = Dimensions.get('window');
export default  class Organize extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            showX: false,
            dataSource: [],
            currentDataSource: [],
            item: {},
            selectDep: [{fName:'全部文件'}],
            showType: false,
            currentShowType: false,
            showFsort: 1
        };
    }

    componentDidMount() {
      SplashScreen.hide();
      this.securitySystemType();
    }

    //查询全部规章制度类型信息
    securitySystemItem = async () => {
        const { text, showFsort,item} = this.state;
        console.log(item);
        const res = await organizationServer.securitySystemItem({
            "fSearchCount": text,
            "fSort": showFsort,
            "fType": item.fId?item.fId: ''
        })
        if(res.success){
            this.setState({
                dataSource: res.obj
            })
        }else{
            console.log(res.msg);
        }
    }
    //查询全部规章制度类型信息
    securitySystemType = async () => {
        const res = await organizationServer.securitySystemType();
        console.log(res);
        if(res.success){
            this.setState({
                dataSource: res.obj
            })
        }
    }

    //当值发生变换时
    handleChange = (text) => {
        this.setState({
            currentDataSource: this.state.dataSource
        })
        console.log(text);
        if(text == ''){
            this.setState({
                showType: this.state.currentShowType,
                showX:false,
                text,
                item: {},
                dataSource: this.state.currentDataSource
            })
        }else{
            this.setState({
                currentShowType:this.state.showType,
                showType: true,
                showX:true,
                text,
                item: {}
            },() => {this.securitySystemItem()})
        }
        
    }
    
    getDetailWay = (fType) => {
        console.log(fType)
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
        const { selectDep } = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="规章制度"
                    hidePlus={true} 
                />
                <View style={[styles.topBar, this.state.showX ? {borderBottomWidth: 0} : {}]}>
                    <View style={styles.barInput}>
                        <Feather name={'search'} size={14} style={{ color: '#696A6C', lineHeight: 30,marginRight: 5}} />
                        <TextInput  
                            style={{padding: 0,width: "100%", height: "100%", flex: 9, fontSize: 14,color: '#5D6A76'}}
                            placeholder={"搜索"}
                            allowFontScaling={true}
                            onChangeText={(text) => {this.handleChange(text)}}
                            value = {this.state.text}
                        />
                        {this.state.showX ? 
                            <TouchableOpacity style={{height: "100%",flex: 1,alignItems: "center"}} onPress={() => {this.setState({text: ""}, ()=>this.handleChange(this.state.text))}}>
                                <Feather name={'x'} size={16} style={{ color: 'rgba(148, 148, 148, .8)',lineHeight: 35}} />
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                </View>
                {
                    this.state.showX ? null :
                    <View style={styles.headerView}>
                        <ScrollView horizontal ref={ref => this.rowScroll} showsHorizontalScrollIndicator={false} style={{paddingLeft: 3}}>
                            {selectDep.map((item, index)=>{
                                return (
                                    <View key={index} style={styles.rowStyle}>
                                        <TouchableOpacity onPress={()=>{this.setState({showType: false,text: ''},() => {this.securitySystemType()})}}>
                                            <Text style={styles.headerText}>{item.fName}</Text>
                                        </TouchableOpacity> 
                                        <AntDesign name="right" color="#DEDEDE"/>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View>
                }
                <View style={{backgroundColor: '#fff'}}>
                    {
                        this.state.showType?( this.state.dataSource.length > 0?
                        <TouchableOpacity style={styles.setTime} onPress= {() => {this.setState({showFsort: this.state.showFsort == 1 ? 2: 1},() => {this.securitySystemItem()})}}>
                            <Text>时间排序</Text>
                            {this.state.showFsort == 1? <AntDesign name="caretup" color="#E0E0E0" style={{marginLeft: 10}}/>: <AntDesign name="caretdown" color="#E0E0E0" style={{marginLeft: 10}}/>}
                            
                        </TouchableOpacity>: null): null
                    }
                    
                    <View style={{paddingLeft: 15,paddingRight: 15}}>
                        {!this.state.showType? (this.state.dataSource.length > 0?this.state.dataSource.map((item,index) => {
                            return (<TouchableOpacity style={{flexDirection: "row",paddingTop: 10,paddingBottom: 10,alignItems: "center"}} onPress={() => {this.setState({showType:true,item},() => {this.securitySystemItem()})}}>
                            <Image source={require("../../image/documentIcon/file.png")} style={{width: 40, height: 40}}/>
                            <View style={{marginLeft: 10}}>
                                <Text>{item.fTypeName?item.fTypeName:'--'}</Text>
                            </View>
                        </TouchableOpacity>)
                        }): <Text style={styles.tipsText}>暂无文件</Text>): null}
                    </View>
                    {this.state.showType?(this.state.dataSource.length > 0?
                        this.state.dataSource.map((item) => {
                            return<View style={styles.items}>
                                <Text style={{marginBottom: 10,paddingTop: 5}}>{item.fMonth?item.fMonth:'--'}</Text>
                                {item.systemInfoRes&&item.systemInfoRes.length != 0? item.systemInfoRes.map((item) => {
                                    return (<TouchableOpacity style={{flexDirection: "row",paddingTop: 10,paddingBottom: 10}} onPress={() => {this.ShowModal.show(item)}}>
                                    <Image source={this.getDetailWay(item.fCoursewareTitle)} style={{width: 40, height: 40}}/>
                                    <View style={{marginLeft: 10}}>
                                        <Text style={{color: "#333"}}>{item.fFileName?item.fFileName:'--'}</Text>
                                        <View style={{flexDirection: "row"}}>
                                            <Text>{item.fCreateTime?parseDate(item.fCreateTime,'YYYY/MM/DD HH:mm'):'--'}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>)
                                }): null}
                            </View>
                        }): <Text style={styles.tipsText}>暂无文件</Text>): null
                        
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
    
    topBar:{
        width,
        height: 54,
        backgroundColor: "white",
        borderBottomColor: "#E1E1E1",
        borderBottomWidth: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    barInput:{
        height: 35,
        paddingLeft: 10,
        width: width-20,
        borderRadius: 5,
        backgroundColor: "#F6F8FA",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    headerView: {
        height: 40,
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 10
    },
    setTime: {
        flexDirection: "row",
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    footerView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
        paddingBottom: 20
    },
    headerView: {
        height: 40,
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 10
    },
    headerText: {
        color: '#4972FE',
        marginRight: 8,
        marginLeft: 8
    },
    rowStyle: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center'
    },
    items: {
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
        paddingLeft: 15,
        paddingRight: 15
    },
    tipsText: {
        width,
        height: 40,
        textAlign: "center",
        paddingTop: 10,
        fontSize: 16
    }
});
