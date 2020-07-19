import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, TextInput} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SplashScreen from 'react-native-splash-screen';

import Header from '../../../components/header';
import ExamineList from './ExamineList';
import TrackList from '../TroubleTrack/TrackList';
import troubleService from '../../../service/troubleService';
import Toast from '../../../components/toast';

const {width, height} = Dimensions.get('window');
export default class ExamineMain extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    
    constructor(props) {
      super(props);
      this.state = {
        type: 1,
        num1: 0,
        num2: 0
      }
    }

    componentDidMount() {
      SplashScreen.hide();
      if (this.props.navigation.state.params && this.props.navigation.state.params.examine) {
        this.setState({
          type: 2
        });
      }
      this.selectNumByState();
    }
    //根据隐患状态集合查询隐患数量
    selectNumByState = async () => {
      Promise.all([troubleService.selectNumByState({fStateList: [1]}),troubleService.selectNumByState({fStateList: [2]})])
      .then((result) => {
        if(result[0].success&&result[1].success){
          this.setState({
            num1: result[0].obj,
            num2: result[1].obj,
          })
        }else{
          Toast.show(result[0].msg);
          Toast.show(result[1].msg);
          console.log(result[0].msg,result[1].msg)
        }
      })
    }
    // 切换隐患跟踪类型
    chooseType = (type) => {
      this.setState({
        type
      })
    };

    render() {
      const { type } = this.state;
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="隐患审核"
                    hidePlus={false} 
                    props={this.props}
                />
                <View style={styles.navView}>
                  <TouchableOpacity 
                    style={[styles.navItem, type==1?styles.navActive: {}]} 
                    onPress={()=>this.setState({type: 1})}
                  >
                      <Text style={[styles.navText, type == 1 ? styles.textActive : {}]}>待审核 {this.state.num1 !== 0? '('+this.state.num1+')': ''}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.navItem, type==2?styles.navActive: {}]}
                    onPress={()=>this.setState({type: 2})}
                  >
                      <Text style={[styles.navText, type == 2 ? styles.textActive : {}]}>已审核 {this.state.num2 !== 0? '('+this.state.num2+')': ''}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{width: '100%', flex: 1, marginTop: 15,paddingBottom: 15, visibility: 'hidden'}}>
                   <TrackList state={[this.state.type]} refreshNum={this.selectNumByState}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        display: "flex",
        alignItems: 'center',
    },
    navView: {
      width: '93%',
      marginTop: 10,
      flexDirection: 'row'
    },
    navItem: {
      flex: 1,
      height: 34,
      borderWidth: 1,
      borderColor: '#E7E7E7',
      backgroundColor: '#fff',
      borderRightWidth: 0,
      alignItems: 'center',
      justifyContent: 'center'
    },
    navText: {
      fontSize: 13,
      color: '#999'
    },
    navActive: {
      backgroundColor: '#455DFD',
      borderColor: '#455DFD',
    },
    textActive: {
      color: '#fff'
    }
});
