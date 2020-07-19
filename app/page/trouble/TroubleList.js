import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, TextInput} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import Header from '../../components/header';
import TrackList from './TroubleTrack/TrackList';
import Trouble from '../../service/troubleService';
import Toast from '../../components/toast';

const {width, height} = Dimensions.get('window');
class TroubleList extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
      super(props);
      this.state = {
        type: 0,
        obj: [],
        allNum: 0,
      }
    }
    componentDidMount() {
      SplashScreen.hide();
      this.getSelectLevelNum()
    }

    //查询各个级别隐患数量
    getSelectLevelNum = async () => {
      const res = await Trouble.getSelectLevelNum();
        if(res.success){
          let arr = [];
          allNum = 0
          for(let item of res.obj){
            arr.push({
              fId: item.fId,
              fLevelName: item.fLevelName,
              num: item.num
            })
          allNum += item.num
        }
        this.setState({
          obj: arr,
          allNum: allNum
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
                    titleText="隐患列表"
                    hidePlus={false} 
                    props={this.props}
                />
                <View style={styles.navView}>
                  <TouchableOpacity 
                    style={[styles.navItem, type==0?styles.navActive: {}]} 
                    onPress={()=>this.setState({type: 0})}
                  >
                      <Text style={[styles.navText, type == 0 ? styles.textActive : {}]}>全部 {this.state.allNum !== 0 ? '('+this.state.allNum+')' : ''}</Text>
                  </TouchableOpacity>
                  {
                    this.state.obj.map((data)=>{
                      return (
                        <TouchableOpacity 
                          style={[styles.navItem, type==data.fId?styles.navActive: {}]}
                          onPress={()=>this.setState({type: data.fId})}
                        >
                            <Text style={[styles.navText, type == data.fId ? styles.textActive : {}]}>{data.fLevelName} {data.num !== 0 ? '('+data.num+')' : ''}</Text>
                        </TouchableOpacity>
                      );
                    })
                  } 
                </View>
                <View style={{width: '100%', flex: 1, marginTop: 15,paddingBottom: 15, visibility: 'hidden'}}>
                    <TrackList fLevelId={!this.state.type? null: this.state.type} state={[2,3,4,5,7,8,10]} refreshNum={this.getSelectLevelNum}/> 
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
  return {
    troubleLevel: state.troubleReducer.troubleLevel
  }
}

export default connect(mapStateToProps)(TroubleList);

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
    },
    
});
