import React, { Component } from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, TouchableOpacity, FlatList,Image,RefreshControl,ActivityIndicator,ImageBackground} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import config from '../../config';
import Header from '../../components/header';
import Toast from '../../components/toast';

const { width, height } = Dimensions.get('window');
export default class App extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state = {
      list: [],
      selectList: []
    }
    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state && this.props.navigation.state.params.fMaintenancePlanItemIdList) {
        let list = [...this.props.navigation.state.params.fMaintenancePlanItemIdList];
        
        this.setState({
            list
        })
      }
    }
    pushValue = () => {
        let selectList = [];
        for(let item of this.state.list){
            // if(item.select == true) {
                selectList.push(item)
            // }
        }
        const {navigate,goBack,state} = this.props.navigation;
        state.params.getCarshopItems(selectList);
        goBack();
    }
    changeCheck = (index) => {
        let list = [...this.state.list];
        list[index].select = !list[index].select
        this.setState({
            list
        })
    }
    render() {
      const { typeList } = this.state;
        return (
          <View style={styles.container}>
            <Header 
              titleText="保养项设置"
              backBtn={true}
              hidePlus={true}
            />
            <View style={{paddingLeft: 16,paddingRight: 16,width,height: "100%"}}>
                <View style={{alignItems: "center",flexDirection: "row",marginTop: 12}}>
                    <Text style={{color: "#333",fontSize: 16,fontWeight: "500"}}>统计: </Text>
                    <Text style={{color: "#333",fontSize: 16,fontWeight: "500"}}>{this.state.list.length !== 0? this.state.list.length : 0}项</Text>
                </View>
                <ScrollView style ={{marginTop: 12}}>
                    {
                        this.state.list.length !== 0?
                        <View >
                            {
                                this.state.list.map((item,index) => {
                                    return(<TouchableOpacity style={styles.items} onPress={() => {this.changeCheck(index)}}>
                                        <View style={[styles.itemList,{backgroundColor: item.select? "#4058FD" :"#fff"}]}>
                                            {
                                                item.select? <AntDesign name="check" color="#fff" /> :null
                                            }
                                        </View>
                                        <Text style={{fontSize: 16,color: "#333",fontWeight: "500"}}>{item.fMaintainItemsTitle}</Text>
                                    </TouchableOpacity>)
                                })
                            }
                            
                        </View> : null
                    }
                </ScrollView>
                {
                    this.state.list.length !== 0?
                    <View style={{bottom: 80}}>
                        <TouchableOpacity style={styles.bottomButton} onPress= { () => {this.pushValue()}}>
                            <Text style={{color: "#fff", fontSize: 16}}>点击保存</Text>
                        </TouchableOpacity> 
                    </View> : null
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
      width,
      height
    },
    bottomButton: {
        width: '100%', 
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4058FD",
        borderRadius: 4,
        bottom: 10 
      },
    itemList: {
        
        width: 30,
        height:30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10
    },
    items:{
        width: "100%",
        backgroundColor: "#fff",
        height: 60,
        alignItems: "center",
        borderRadius: 4,
        marginBottom: 10,
        flexDirection: "row",
        paddingLeft: 10
    }
});
