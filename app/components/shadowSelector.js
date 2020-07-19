import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { withNavigation } from 'react-navigation';
import {sH, sW, sT, barHeight, navHeight,isIphoneX} from '../utils/screen';

const navStyle = navHeight();
const isAndroid = Platform.OS === 'android';
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    alignItems: 'center',
    position: 'relative',
  },
  selectModal: {
    position: 'absolute',
    top:  isAndroid ? navStyle.height-4 :  (isIphoneX() ? 30+navStyle.height: 20+navStyle.height),
    right: 5
  },
  icon: {
    position: 'absolute',
    right: 12,
    top: -9
  },
  selectItem: {
    flexDirection: 'row',
    width: width/3,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
});

class ShadowSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  handleTo = (path) => {
    this.props.onRequestClose();
    if (path == 'ScanQRcode') {
      this.props.navigation.push('ScanQRcode', {toDetail: true})
      return;
    }
    this.props.navigation.navigate(path);

  }
  render() {
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={this.props.isShow}
        onRequestClose={this.props.onRequestClose ? this.props.onRequestClose : () => {}}
      >
        <TouchableHighlight underlayColor={'rgba(0, 0, 0, 0.0)'} style={styles.modalStyle} onPress={this.props.onRequestClose ? this.props.onRequestClose:()=>{}}>
          <View style={styles.selectModal}>
            <AntDesign name="caretup" size={14} color={'rgba(0, 0, 0, 0.5)'} style={styles.icon}/>
            <TouchableOpacity onPress={()=>{this.handleTo('HandPhoto')}}>
              <View style={[styles.selectItem, {borderTopLeftRadius: 5,borderTopRightRadius: 5,marginBottom: 1}]}>
                <Icon name="camera" size={16} color={'#fff'}/>
                <Text style={{color: '#fff',marginLeft: 10}}>随手拍</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.handleTo('ScanQRcode')}}>
              <View style={[styles.selectItem, {borderBottomLeftRadius: 5,borderBottomRightRadius: 5}]}>
                <Icon name="barcode" size={16} color={'#fff'}/>
                <Text style={{color: '#fff',marginLeft: 10}}>扫一扫</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableHighlight>
      </Modal>
    );
  }
}

export default withNavigation(ShadowSelector);