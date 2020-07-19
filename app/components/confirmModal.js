import React, {Component} from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  Modal,
  ActivityIndicator,
  Text,
  TextInput
} from 'react-native';


const {width,height} = Dimensions.get('window');
const styles = StyleSheet.create({
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

export default class ConfirmModal extends Component {
  state = {
    text: ''
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.showModal && !nextProps.showModal) {
      this.setState({text: ''})
    }
  }

  render() {
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={this.props.showModal}
        onRequestClose={()=>this.props.onClose()}
      >
        <View style={styles.mask}>
          <View style={styles.contentView}>
            <View style={styles.textView}>
              <Text style={{color: '#797979',marginBottom: 10,fontSize: 14,width: '100%',paddingRight: 15,paddingLeft: 15}}>{this.props.title}</Text>
              <View style={{width: '90%',borderWidth: 1,padding: 5,borderColor: '#F2F2F2'}}>
                <TextInput
                    style={styles.inputStyle}
                    placeholder={this.props.placeHolder}
                    underlineColorAndroid="transparent"
                    value={this.state.text}
                    multiline={true}
                    onChangeText={(text)=>{
                      this.setState({
                        text: text.trim()
                      });
                    }}
                />
              </View>
            </View>
            <View style={styles.contentFoot}>
              <TouchableOpacity style={styles.btn} onPress={()=>{
                this.setState({text: ''});
                this.props.onCancel();
              }}>
                <Text style={{color: '#4A72FE'}}>取消</Text>
              </TouchableOpacity>
              <View style={{height: '100%', borderRightColor: '#F2F2F2', borderRightWidth: 1 }}/>
              <TouchableOpacity style={styles.btn} onPress={()=>{
                this.props.onOk(this.state.text);
              }}>
                <Text style={{color: '#4A72FE'}}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}
