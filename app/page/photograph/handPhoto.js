import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, ImageBackground, Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import Header from '../../components/header';
import { getAllTroubleType } from '../../store/thunk/systemVariable';
import Config from '../../config';


const {width, height} = Dimensions.get('window');
class HandPhoto extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });

    componentDidMount() {
        this.refreshType();
    }
    // 跳转新增随手拍的页面
    toDetail = (data) => {      
        this.props.navigation.navigate('PhotographEdit', 
            { typeId: data.fId, typeName: data.fTypeName }
        );
    }

    // 更新隐患类型数据
    refreshType = () => {
        this.props.dispatch(getAllTroubleType());
    }

    // 判断字段返回对应类型图片
    judgeIconByType = (type) => {
        switch (type) {
            case 'cl': 
                return require('../../image/handPhoto/Stone-car(2).png');
            default:    
                return require('../../image/handPhoto/Stone-car(2).png');
        }
    }
    render() {
        const { goBack } = this.props.navigation;
        const { troubleType } = this.props;
        console.log('troubleType', troubleType)
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="随手拍"
                    hidePlus={true} 
                    props={this.props}
                />
                <ScrollView>   
                    <View style={styles.banner}>
                        <View style={styles.bannerText}>
                            <Text style={styles.upload}>上传有奖 安全共享</Text>
                            <TouchableOpacity>
                                <View style={styles.press}>
                                    <Text style={{color:"#FFFFFF", fontSize: 12}}>随手拍范围及奖励</Text>
                                    <AntDesign name={'right'} size={14} style={{ color: 'white',marginLeft: 3 }}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Image source={require('../../image/handPhoto/img.png')} style={{width: 134, height: 146}}/>
                    </View>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('HandSearch')}>
                        <View style={styles.checkout}>
                            <View style={{display: "flex", flexDirection: "row", }}>
                                <Image source={require('../../image/handPhoto/Stone-search.png')} style={{width: 16, height: 16, marginRight: 9,marginTop: 3}}/>
                                <Text style={{color:"#FFFFFF", fontSize: 16}}>随手拍记录</Text>
                            </View>
                            <AntDesign name={'right'} size={16} style={{ color: 'white'}}/>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.items}>
                        {
                            troubleType.map((data)=> {
                                console.log('troubleType', troubleType);
                                return (
                                    <TouchableOpacity key={data.fId} style = {styles.item} onPress = {() => this.toDetail(data)}>
                                        <Image source={{uri: `${Config.imgUrl}/${data.tFileManagementDTO.fFileLocationUrl}`}} style={{width: 34, height: 34}}/>
                                        <Text style={styles.itemText}>{data.fTypeName}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        
                        {/* <TouchableOpacity style = {styles.item} onPress = {() => this.toDetail(1)}>
                            <Image source={require('../../image/handPhoto/Stone-cube.png')} style={{width: 54, height: 54}}/>  
                            <Text style={styles.itemText}>设备问题</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.item} onPress = {() => this.toDetail(1)}>
                        <Image source={require('../../image/handPhoto/Stone-cellular.png')} style={{width: 54, height: 54}}/>
                            <Text style={styles.itemText}>边坡问题</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.item} onPress = {() => this.toDetail(1)}>
                            <Image source={require('../../image/handPhoto/Stone-contact.png')} style={{width: 54, height: 54}}/>
                            <Text style={styles.itemText}>人员问题</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.item} onPress = {() => this.toDetail(1)}>
                            <Image source={require('../../image/handPhoto/Stone-barcode.png')} style={{width: 54, height: 54}}/>
                            <Text style={styles.itemText}>道路问题</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.item} onPress = {() => this.toDetail(1)}>
                            <Image source={require('../../image/handPhoto/Stone-business.png')} style={{width: 54, height: 54}}/>
                            <Text style={styles.itemText}>建筑问题</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.item} onPress = {() => this.toDetail(1)}>
                            <Image source={require('../../image/handPhoto/Stone-apps.png')} style={{width: 54, height: 54}}/>
                            <Text style={styles.itemText}>其他问题</Text>
                        </TouchableOpacity> */}
                    </View>
                </ScrollView> 
            </View>
        );
    }
}

const mapStateToProps = state => ({
    troubleType: state.troubleReducer.troubleType,
});

export default connect(mapStateToProps)(HandPhoto);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F8',
        display: "flex"
    },
    banner: {
        width,
        height: 178,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#4B74FF",
        alignItems: "center",
        justifyContent: "center",
    },
    bannerText: {
        marginRight: 23
    },
    upload: {
        color:"#FFFFFF",
        fontSize: 18,
        fontSize: 24,
        width: 98,
        lineHeight: 35,
        fontWeight: "600",
        marginBottom: 12,
        marginLeft: 20
    },
    press: {
        display:"flex",
        flexDirection: "row",
        alignItems: "center",
        width: 140,
        height: 34,
        borderRadius: 18,
        backgroundColor: "#5E82FE",
        justifyContent: "center"
    },
    checkout: {
        width,
        height: 55,
        backgroundColor: "#5E82FE",
        paddingLeft: 28,
        paddingRight: 28,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    items: {
        width,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    item:{
        display: "flex",
        flexDirection: "column",
        width: width/3,
        height: width/3,
        backgroundColor: "white",
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor:'#e8e8e8',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        
    },
    itemText: {
        fontSize: 16,
        color: "#777777",
        marginTop: 5
    }
});
