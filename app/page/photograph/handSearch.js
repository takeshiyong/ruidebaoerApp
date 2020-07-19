import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, TextInput} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';

import Header from '../../components/header';
import TrackList from '../trouble/TroubleTrack/TrackList';

const {width, height} = Dimensions.get('window');
class HandSearch extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    constructor(props) {
      super(props);
      this.state = {
        type: [0,1,2,3,4,5,6,7,8,9]
      }
    }
    componentDidMount() {
      SplashScreen.hide();
    }

    render() {
      const { type } = this.state;
      console.log(this.props.userId, 'this.props.userId');
        return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText="随手拍查询"
                    hidePlus={false} 
                    props={this.props}
                />
                <View style={{width: '100%', flex: 1, marginTop: 15,paddingBottom: 15, visibility: 'hidden'}}>
                    <TrackList state={this.state.type} fReportUserId={this.props.userId} userId={true}/>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
  userId: state.userReducer.userInfo.fEmployeeId,
});

export default connect(mapStateToProps)(HandSearch);

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
