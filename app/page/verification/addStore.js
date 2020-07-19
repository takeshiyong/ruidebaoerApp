import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,Modal, ScrollView,Image,TextInput} from 'react-native';
import Header from '../../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CameraUpload from '../../components/ImageAbout/CameraUpload';
import Picker from 'react-native-wheel-picker';
import IntegralServer from '../../service/integralServer';
import Toast from '../../components/toast';

const {width, height} = Dimensions.get('window');
const PickerItem = Picker.Item;
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        MoneyScale: 1,
        storeName: '',
        storeNorms: '',
        storePrice: null,
        storeIntegral: null,
        picArr: [],
        pickerList: [],
        changeData: {},
        itemList: [],
        CategoryType: [],
        typeData: {
            index: 0,
            fId: '',
            fName: '请选择商品类型'
        },
        showPicker: false,
        item:{},
        status: false
    }
    componentDidMount() {
        this.getTCommCategory();
        this.getMoneyScale();
        if(this.props.navigation.state.params&&this.props.navigation.state.params.item){
            this.setData(this.props.navigation.state.params.item)
        }
    }
    setData = (data) =>{
        console.log('bbbbbbbbbbbbbb',data,data.fStock);
        this.setState({
            item: data,
            status: true,
            typeData: {fId:data.fCategoryId,fName:data.fCateName},
            storeIntegral: data.fCommIntegral+'',
            storeName: data.fCommName,
            storePrice: data.fCommPrice+'',
            storeNorms: data.fCommSpecification,
            picArr: [{
            path: data.fCommPath,
            status: "success",
            type: 1}]
        },() => {console.log('aaaaaaaaaaaa',this.state.storePrice)})
    }
    //查询所有的商品类型信息
    getTCommCategory = async () => {
        const res = await IntegralServer.getTCommCategory();
        if(res.success){
            this.setState({
                CategoryType: res.obj
            })
        }else{
            console.log(res.msg)
        }
    }
    //商品类型
    chooseCategoryType = () => {
        const {CategoryType} = this.state;
        if(CategoryType.length > 0){
            const selectList = CategoryType.map((data, index)=>{
                return {
                    index: index,
                    fId: data.fId,
                    fName: data.fCateName
                }
            });
            console.log(selectList)
            this.setState({
                itemList: selectList,
                pickerList: selectList.map((data)=>(data.fName)),
                changeData: selectList[CategoryType.index],
                showPicker: true,
            });
        } 
    }
    //获取金钱比
    getMoneyScale = async () => {
        const res = await IntegralServer.selectByType(1);
        if(res.success){
            this.setState({
                MoneyScale: res.obj.value
            })
        }else{
            console.log(res.msg)
        }
    }
    setValue = (text) => {
        if(isNaN(text*1)){
            Toast.show('请输入数字');
            return;
        }
        let storeIntegral= text*this.state.MoneyScale+'';
        this.setState({
            storePrice: text.trim(),
            storeIntegral
        });
    }
    //picker确认改值
    onPickerSelect = () => {
        const {typeData, changeData} = this.state;
        this.setState({
            showPicker: false,
            typeData: {
                index: typeData.index,
                fName: changeData.fName,
                fId: changeData.fId,
            },
        })
        
    }

    // picker滚动的时候改值
    onPickerChange = (index) => {
        const { changeData, itemList } = this.state;
        this.setState({
            changeData: itemList[index]
        });
    }
    //修改商品信息
    updateTCommodity  = async () =>{
        const { typeData, storeName, storeNorms, storePrice, storeIntegral, storeNum, picArr} = this.state;
        if(typeData.fId.length == 0){
            Toast.show('商品类型不能为空');
            return;
        }
        if(storeName.trim().length == 0){
            Toast.show('商品名称不能为空');
            return;
        }
        if(storeNorms.trim().length == 0){
            Toast.show('商品规格不能为空');
            return;
        }
        if(storePrice == null){
            Toast.show('商品价格不能为空');
            return;
        }else{
            if(isNaN(storePrice*1)){
                Toast.show('商品价格只能为数字类型');
                return;
            }
        }
        if(storeIntegral == null){
            Toast.show('商品积分不能为空');
            return;
        }else{
            if(isNaN(storeIntegral*1)){
                Toast.show('商品积分只能为数字类型');
                return;
            }
        }
        if(storeIntegral == null){
            Toast.show('商品积分不能为空');
            return;
        }else{
            if(isNaN(storeIntegral*1)){
                Toast.show('商品积分只能为数字类型');
                return;
            }
        }
        
        if(picArr.length == 0){
            Toast.show('商品图片不能为空');
            return;
        }
        const res = await IntegralServer.updateTCommodity({
            "fCategoryId": typeData.fId,
            "fCommIntegral": storeIntegral,
            "fCommName": storeName,
            "fCommPath": picArr[0].path,
            "fCommPrice": storePrice,
            "fCommSpecification": storeNorms,
            'fId': this.state.item.fId
        })
        if(res.success){
            console.log(res.msg);
            this.props.navigation.state.params.getTCommCategory();
            this.props.navigation.pop()
            Toast.show(res.msg)
        }else{
            console.log(res.msg);
            Toast.show(res.msg)
        }
    }
    //新增商品信息
    addTCommodity = async () => {
        const { typeData, storeName, storeNorms, storePrice, storeIntegral, storeNum, picArr} = this.state;
        if(typeData.fId.length == 0){
            Toast.show('商品类型不能为空');
            return;
        }
        if(storeName.trim().length == 0){
            Toast.show('商品名称不能为空');
            return;
        }
        if(storeNorms.trim().length == 0){
            Toast.show('商品规格不能为空');
            return;
        }
        if(storePrice == null){
            Toast.show('商品价格不能为空');
            return;
        }else{
            if(isNaN(storePrice*1)){
                Toast.show('商品价格只能为数字类型');
                return;
            }
        }
        if(storeIntegral == null){
            Toast.show('商品积分不能为空');
            return;
        }else{
            if(isNaN(storeIntegral*1)){
                Toast.show('商品积分只能为数字类型');
                return;
            }
        }
        if(storeIntegral == null){
            Toast.show('商品积分不能为空');
            return;
        }else{
            if(isNaN(storeIntegral*1)){
                Toast.show('商品积分只能为数字类型');
                return;
            }
        }
        
        if(picArr.length == 0){
            Toast.show('商品图片不能为空');
            return;
        }
        const res = await IntegralServer.addTCommodity({
            "fCategoryId": typeData.fId,
            "fCommIntegral": storeIntegral,
            "fCommName": storeName,
            "fCommPath": picArr[0].path,
            "fCommPrice": storePrice,
            "fCommSpecification": storeNorms,
        })
        if(res.success){
            console.log(res.msg);
            this.props.navigation.state.params.getTCommCategory();
            this.props.navigation.pop()
            Toast.show(res.msg)
        }else{
            console.log(res.msg);
            Toast.show(res.msg)
        }
    }
    render() {
        const { pop } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="添加商品"
                    hidePlus={false} 
                    props={this.props}
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
                                
                                onValueChange={(index) => this.onPickerChange(index)}>
                                {this.state.pickerList.map((value, i) => (
                                    <PickerItem label={value} value={i} key={value}/>
                                ))}
                            </Picker>
                        </View>
                    </View>
                </Modal>
                <ScrollView>
                    <View style={styles.content}>
                    <TouchableOpacity style={[styles.item,{height: 48}]} onPress={() => {this.chooseCategoryType()}}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Text style={{color: "#333333", fontSize: 14}}>商品分类</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Text style={{fontSize: 14, color: "#999999"}}>{this.state.typeData.fName? this.state.typeData.fName: '请选择商品类型'}</Text>
                            <AntDesign name={'right'} size={12} style={{ color: '#C1C1C1',marginLeft: 5 }}/>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.item}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Text style={{color: "#333333", fontSize: 14}}>商品名称</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <TextInput
                                style={{height: "100%", borderWidth: 0,color: "#333",textAlign: "right"}}
                                placeholder="请输入商品名称"
                                multiline={false}
                                maxLength={20}
                                placeholderTextColor= "#999"
                                value={this.state.storeName}
                                onChangeText={(text)=>{
                                    this.setState({
                                        storeName: text.trim()
                                    });
                                  }}
                            />
                        </View>
                    </View>
                    <View style={styles.item}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Text style={{color: "#333333", fontSize: 14}}>商品规格</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <TextInput
                                style={{height: "100%", borderWidth: 0,color: "#333",textAlign: "right"}}
                                placeholder="请输入商品规格"
                                multiline={false}
                                maxLength={30}
                                placeholderTextColor= "#999"
                                value={this.state.storeNorms}
                                onChangeText={(text)=>{
                                    this.setState({
                                        storeNorms: text.trim()
                                    });
                                  }}
                            />
                        </View>
                    </View>
                    <View style={styles.item}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Text style={{color: "#333333", fontSize: 14}}>商品价格</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <TextInput
                                style={{height: "100%", borderWidth: 0,color: "#333",textAlign: "right"}}
                                placeholder="请输入商品价格(默认元)"
                                multiline={false}
                                maxLength={13}
                                placeholderTextColor= "#999"
                                value={this.state.storePrice}
                                onChangeText={(text)=> this.setValue(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.item}>
                        <View style={{flexDirection: "row",alignItems: "center"}}>
                            <Text style={{color: "#333333", fontSize: 14}}>商品积分</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <TextInput
                                style={{height: "100%", borderWidth: 0,color: "#333",textAlign: "right"}}
                                placeholder="请输入商品积分"
                                multiline={false}
                                maxLength={8}
                                placeholderTextColor= "#999"
                                value={this.state.storeIntegral}
                                onChangeText={(text)=>{
                                    this.setState({
                                        storeIntegral: text.trim()
                                    });
                                  }}
                            />
                        </View>
                    </View>
                </View>
                    <View style={styles.photoBox}>
                    <Text style={{fontSize: 14,color: "#333",marginTop: 23,marginBottom: 15}}>商品照片</Text>
                    <View style={{flexDirection: "row",marginTop: 5,marginBottom: 10,flexWrap: "wrap",justifyContent: "space-between"}}>
                            <CameraUpload
                                limit = {1}
                                value={this.state.picArr}
                                onChange={(picArr)=>this.setState({picArr})}
                                imgStyle={{width: width*0.26, height: width*0.26}}
                            />
                    </View>
                </View>
                    <View style={{paddingLeft: 16,paddingRight: 16}}>
                        <TouchableOpacity style={{width: "100%",height: 44,backgroundColor: "#4058FD",borderRadius: 5,marginTop: 16}} onPress={() => {this.state.status ? this.updateTCommodity():this.addTCommodity()}}>
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
