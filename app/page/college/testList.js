import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, TextInput,FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import collegeServer from '../../service/collegeServer';
import Toast from '../../components/toast';
import Header from '../../components/header';

const {width, height} = Dimensions.get('window');
class TestList extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    
    constructor(props) {
      super(props);
      this.state = {
        dataSource: [],
        refreshing: false,
      }
    }

    componentDidMount() {
      SplashScreen.hide();
      this.fetchTestList();
    }
    
    // 查询考试列表数据
    fetchTestList = async () => {
      const { pageCurrent, pageSize, dataSource } = this.state;
      this.setState({refreshing: true});
      const res = await collegeServer.getTestList();
      this.setState({refreshing: false})
      console.log('查询考试列表数据', res);
      if (res.success) {
        this.setState({
            dataSource: res.obj
        });
      } else {
        Toast.show(res.msg);
      }
    }

    // 刷新列表数据
    onRefresh = () => {
        const { refreshing } = this.state;
        if (refreshing) return;
        this.fetchTestList()
    }

    /**
     * list上每行渲染的内容
     */
    renderItem = ({item}) => {
      return (
        <TouchableOpacity 
          style={[styles.itemView, styles.rowCenter, {borderLeftColor: item.fCorrectSubjectNumber == item.fSubjectNumber ? '#51D292': "#FF632E"}]} 
          onPress={()=>{
            this.props.navigation.push('TestDetail', { item,onRefresh: this.onRefresh})
          }}>
          <Text style={{fontSize: 15, color: '#000'}}>{item.fTitle != null ?item.fTitle: '--'}</Text>
          <Text style={{fontSize: 15, color: '#A9A9A9'}}>{item.fSubjectNumber != null? item.fSubjectNumber: '--'}题</Text>
        </TouchableOpacity>
      )
    }

    render() {
      return (
        <View style={styles.container}>
          <Header
              backBtn={true}
              titleText="考试"
              hidePlus={false}
              
          />
          <FlatList
              refreshControl={
                <RefreshControl
                    title={'Loading'}
                    colors={['#000']}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                />
              } 
              refreshing={this.state.refreshing}
              data={this.state.dataSource}
              renderItem={this.renderItem}
              ListEmptyComponent={<Text style={{width, textAlign: 'center',marginTop: 10,color: '#c9c9c9', paddingBottom: 50}}>暂无数据</Text>}
              ItemSeparatorComponent={()=>(<View style={{height: 10,backgroundColor: '#F6F6F6'}}/>)}
          />
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F4F4',
      display: "flex",
      alignItems: 'center',
    },
    rowCenter: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    itemView: {
      marginTop: 10,
      width: width-20,
      marginRight: 10,
      marginLeft: 10,
      alignItems: 'center',
      borderLeftWidth: 4,
      borderLeftColor: '#51D292',
      justifyContent: 'space-between',
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: '#fff',
    
    },
    
});

const mapStateToProps = state => ({
  troubleLevelParam: state.troubleReducer.troubleLevelParam,
  troubleTypeParam: state.troubleReducer.troubleTypeParam,
  troubleImgParam: state.troubleReducer.troubleImgParam,
})

export default connect(mapStateToProps)(TestList);