import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, TextInput} from 'react-native';
import Header from '../../components/header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SplashScreen from 'react-native-splash-screen';
import TrackList from './TroubleTrack/TrackList';
import Trouble from '../../service/troubleService';
import Toast from '../../components/toast';


const {width, height} = Dimensions.get('window');
export default class TroubleTrack extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
      super(props);
      this.state = {
        type: 3,
        obj : {}
      }
    }
    componentDidMount() {
      SplashScreen.hide();
      this.getSelectStateNumber();
      if(this.props.navigation.state.params&&this.props.navigation.state.params.type != null){
        this.setState({
          type: this.props.navigation.state.params.type
        })
      }
    }
     //查询待处理、拒整改、整改中、待复查的任务数量
    getSelectStateNumber = async () => {
      const res = await Trouble.getSelectStateNumber();
      console.log('查询待处理、拒整改、整改中、待复查的任务数量', res);
        if(res.success){
          this.setState({
            obj: {...res.obj}
          })
        }else{
          Toast.show(res.msg);
          console.log('查询各个级别隐患数量',res.msg)
      }
    
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
                    titleText="隐患跟踪"
                    hidePlus={false} 
                    props={this.props}
                />
                <View style={styles.navView}>
                  <TouchableOpacity 
                    style={[styles.navItem, type==3?styles.navActive: {}]} 
                    onPress={()=>this.setState({type: 3})}
                  >
                      <Text style={[styles.navText, type == 3 ? styles.textActive : {}]}>待处理 {this.state.obj.fPendingNum? '('+this.state.obj.fPendingNum+')': ''}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.navItem, type==7?styles.navActive: {}]}
                    onPress={()=>this.setState({type: 7})}
                  >
                      <Text style={[styles.navText, type == 7 ? styles.textActive : {}]}>拒整改 {this.state.obj.fRefuseNum? '('+this.state.obj.fRefuseNum+')': ''}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.navItem, type==4?styles.navActive: {}]} 
                    onPress={()=>this.setState({type:4})}
                  >
                      <Text style={[styles.navText, type == 4 ? styles.textActive : {}]}>整改中 {this.state.obj.fRectifyNum? '('+this.state.obj.fRectifyNum+')': ''}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.navItem, {borderRightWidth: 1}, type == 5 ? styles.navActive : {}]} 
                    onPress={()=>this.setState({type: 5})}
                  >
                      <Text style={[styles.navText, type == 5 ? styles.textActive : {}]}>待复查 {this.state.obj.fReviewNum? '('+this.state.obj.fReviewNum+')': ''}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{width: '100%', flex: 1, marginTop: 15,paddingBottom: 15, visibility: 'hidden'}}>
                    <TrackList state={this.state.type == 3 ? [3, 8, 10] : [this.state.type]} refreshNum={this.getSelectStateNumber}/>
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
