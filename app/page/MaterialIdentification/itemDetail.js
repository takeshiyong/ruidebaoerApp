import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, RefreshControl} from 'react-native';
import Header from '../../components/header';
import Toast from '../../components/toast';
import config from '../../config/index';


const {width, height} = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
        item: {}
    }
    componentDidMount() {
        if (this.props.navigation.state && this.props.navigation.state.params.item) {
            this.setState({
                item:this.props.navigation.state.params.item
            })
          }
    }
    
    render() {
        const { item } = this.state
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="报警详情"
                    hidePlus={false} 
                    props={this.props}
                />
                
                <View>
                    <View style={{backgroundColor: "#fff",padding: 15,flexDirection: "row",justifyContent: "space-between"}}>
                        <Text style={{color: "#333",fontSize: 16,fontWeight: "500"}}>{item.fVideoName?item.fVideoName: '--'}</Text>
                        <Text>{item.fRecordTime}</Text>
                    </View>
                    <View style={styles.imageBox}>
                        <Image style={{width: "100%",height:343,backgroundColor: "#E0E0E0"}} source={{uri: (config.imgUrl+item.fPaths)}}/>
                        <View style={styles.imageBottomBox}>
                            <Text style={{color: "#fff"}}>异常图片</Text>
                        </View>
                    </View>
                    {
                        item.foreignBodySizes&&item.foreignBodySizes.length > 0?
                        item.foreignBodySizes.map((items,index) => {
                            return(<View style={{backgroundColor: "#fff",padding: 15,marginTop: 10}}>
                                        <Text style={{color: "#333",fontSize: 16,fontWeight: "500"}}>异常详情</Text>
                                        <View style={{flexDirection: "row",justifyContent: "space-between",paddingBottom: 10,paddingTop: 10}}>
                                            <Text style={{fontSize: 14,color: "#333"}}>{item.fType?'大块砂石': "异物"}{index+1}</Text>
                                            <Text style={{fontSize: 14,color: "#333",fontWeight: "500"}}>{items.fLong!=null?items.fLong:'--'}mm*{items.fWidth!=null?items.fWidth:'--'}mm</Text>
                                        </View>
                                    </View>)
                        })
                        
                        : <Text style={styles.tipsBottom}>暂无异常报警</Text>
                    } 
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        display: "flex"
    },
    imageBottomBox: {
        backgroundColor: "rgba(51, 51, 51, 0.5)",
        width: "100%",
        height: 44,
        justifyContent: "center",
        paddingLeft: 15,
        position: "absolute",
        bottom: 20,
        left: 15
    },
    imageBox: {
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: "#fff",
        height: 363,
    },
    tipsBottom: {
        width,
        alignContent: "center",
        textAlign: "center",
        color: "#999",
        // backgroundColor: "#FFF",
        paddingTop: 10,
        paddingBottom: 10
    }
    
});
