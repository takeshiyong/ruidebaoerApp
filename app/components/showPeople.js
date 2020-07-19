import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView,Animated, TouchableHighlight,Image} from 'react-native';

import Header from '../components/header';
import Toast from '../components/toast';

const {width, height} = Dimensions.get('window');
export default class SelectPeopleByDep extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
        super(props);
        this.state = {
            peopleList: []
        }
    }
    componentDidMount() {
        if(this.props.navigation.state.params&&this.props.navigation.state.params.peopleList){
            this.setState({
                peopleList: this.props.navigation.state.params.peopleList
            })
        }
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="人员列表"
                    hidePlus={true} 
                />
                <ScrollView style={{width: '100%'}}>
                        <View style={{width: "100%"}}>
                            {this.state.peopleList? this.state.peopleList.map((item, index)=>{
                                return (
                                    <View style={styles.userIcon} key={item.fId}>
                                        <View style={styles.userImgs}>
                                            <View style={styles.userImg}>
                                                <Text style={{fontSize: 14,color: "white"}}>
                                                    {item.fUserName ? item.fUserName.substr(item.fUserName.length-2,2) : ''}
                                                </Text>
                                            </View> 
                                        </View>
                                        <Text style={{width: '100%',textAlign: 'center',fontSize: 16,color: "#333"}} numberOfLines={1}>{item.fUserName}</Text>
                                    </View>)}): null}
                        </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
    },
    userIcon: {
        alignItems: 'center',
        width: "100%",
        height: 70,
        position: 'relative',
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 10,
        paddingLeft: 15
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
