import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView,Animated, TouchableHighlight,Image} from 'react-native';

import Header from '../../components/header';
import Toast from '../../components/toast';
import { SwipeListView,SwipeRow} from 'react-native-swipe-list-view';
import {ECharts} from 'react-native-echarts-wrapper';
import ModalDropdown from '../../components/modalDropdown';
import meetingServer from '../../service/meetingServer'

const {width, height} = Dimensions.get('window');
export default class SelectPeopleByDep extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
            newArr : [...this.props.navigation.state.params.initArr],
            
        };
    }
    changeState = (index) => {
        
        let arr = this.props.navigation.state.params.initArr
        for(indexs in arr){
            if(indexs == index){
                arr[indexs].fActualState = arr[indexs].fActualState == 1 ? 2 : 1
            }
            
        }
        this.setState({
            newArr: arr
        })
    }
     // 确认选择
     chooseTrue = () => {
        const {navigate,goBack,state} = this.props.navigation;
        const { newArr } = this.state;
        state.params.surePeople(newArr);
        goBack();
    }
    componentDidMount() {
        console.log(this.props.navigation.state.params)
    }
    
    render() {
        return (
            <View style={styles.container}>
                
                <Header 
                    backBtn={true}
                    titleText="参会人列表"
                    hidePlus={true} 
                />
                <ScrollView style={{width: '100%'}}>
                        <View>
                            <View style={{height: 40,paddingLeft: 15,paddingRight: 15,justifyContent: "center"}}>
                                <Text style={{fontSize: 16,color: '#333',fontWeight: '500'}}>人员 {this.state.newArr.length}</Text>
                            </View>
                            {this.state.newArr? this.state.newArr.map((item, index)=>{
                                console.log(item)
                                return (
                                    <View key={index} style={styles.itemView}>
                                        <View style={[styles.row]}>
                                            <View style={{flexDirection: "row",alignItems: "center",flex:3}}>
                                                <View style={styles.circleView}>
                                                    <Text style={{color: '#fff'}}>{item.fEmpoloyeeName.substr(-2, 2)}</Text>
                                                </View>
                                                <Text style={{color: '#000', fontSize: 16}}>{item.fEmpoloyeeName}</Text>
                                            </View>
                                            <View style={{flexDirection: "row",flex: 3,justifyContent: "space-between"}}>
                                                <Text>{item.position}</Text>
                                                    <TouchableOpacity onPress={() => {this.changeState(index)}}>
                                                        {item.fActualState == 1 ? 
                                                        <View style={{flexDirection: "row",justifyContent: "flex-end",alignItems: "center"}}>
                                                            <Text style={{color: "#1ACFAA",fontSize: 14}}>参加</Text>
                                                            <Image source={require("../../image/meeting/green.png")} style={{width: 9, height: 9,marginLeft: 8}}/>
                                                        </View>
                                                        : 
                                                        <View style={{flexDirection: "row",justifyContent: "flex-end",alignItems: "center"}}>
                                                            <Text style={{color: "#F74747",fontSize: 14}}>未参加</Text>
                                                            <Image source={require("../../image/meeting/red.png")} style={{width: 9, height: 9,marginLeft: 8}}/>
                                                        </View>
                                                        }
                                                    </TouchableOpacity>
                                                    
                                            </View>
                                        </View>
                                    </View>)}): null}
                            
                        </View>
                </ScrollView>
                <TouchableOpacity style={{width: width, height: 50,alignItems: "center",justifyContent: "center",backgroundColor: "#4058FD", }} onPress={ () => this.chooseTrue()}>
                    <Text style={{color: "#fff", fontSize: 16}}>保存</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    circleView: {
      width: 40,
      height: 40,
      borderRadius: 50,
      backgroundColor: '#4058FD',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#F4F4F8',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 1,
        paddingTop: 13,
        paddingBottom: 13
        
    },
    itemView: {
        backgroundColor: '#fff',
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15
    },
    rowBack: {
		alignItems: 'center',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
    },
    backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 90
	},
    backRightBtnLeft: {
		backgroundColor: 'blue',
		right: 90
	},
	backRightBtnRight: {
		backgroundColor: 'red',
		right: 0
    },
    backTextWhite: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: "500"
    },
    echartsText: {
        color: '#666666',
        fontSize: 12,
        textAlign: 'center'
    },
    echartsView: {
        flex: 1,
        height: 100,
        position: 'relative'
    },
    echartsText: {
        color: '#666666',
        fontSize: 12,
        textAlign: 'center'
    },
    dropDownItem: {
        width: 60,
        alignItems: 'center',
        justifyContent: "center"
    },
    changeTitle: {
        width: 60,
        height: 25,
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 5,
        alignItems: "center",
        flexDirection: "row"
    },
    fontText: {
        fontSize: 14,
        color: "green"
    },
    mask: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      },
      contentView: {
        width: '85%',
        height: 200,
        borderRadius: 4,
        backgroundColor: '#fff'
      },
      contentFoot: {
        borderTopColor: '#F2F2F2',
        width: '100%',
        borderTopWidth: 1,
        height: 40,
        flexDirection: 'row'
      },
      textView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      btn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      inputStyle: {
        height: 80,
        padding: 0,
        textAlignVertical: 'top',
        width: '100%',
      }
});
