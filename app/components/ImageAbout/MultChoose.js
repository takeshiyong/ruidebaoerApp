
import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  modalStyle: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  modalStyles: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  modalInner: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    color: '#fff',
    fontSize: 24
  },
  bodyView: {
    height: 120,
    width: width * 0.7,
    backgroundColor: '#fff',
    borderRadius: 3
  },
  btnView: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#c9c9c9',
    flexDirection: 'row',
  },
  tipView: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn: {
    flex: 1,
    borderRightWidth: 1,
    height: 50,
    borderRightColor: '#c9c9c9',
    justifyContent:"center",
    alignItems:'center',
  },
  itemBtn: {
    width: width * 0.85,
    height: 45,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    fontSize: 18,
    color: '#666'
  }
});

export default class MultChoose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={this.props.isShow}
        onRequestClose={this.props.onRequestClose ? this.props.onRequestClose : () => {
        }}
      >
        { !this.props.loading ?

          <View style={[styles.modalStyle]}>
            {this.props.data?this.props.data.map((data, index)=> {
              return (
                <TouchableHighlight
                  style={[styles.itemBtn,
                    {borderBottomWidth: 1,borderBottomColor: '#f9f9f9'},index===0?{borderTopLeftRadius:5, borderTopRightRadius:5}:index===this.props.data.length - 1? {borderBottomLeftRadius:5, borderBottomRightRadius:5,borderBottomWidth: 0}: null]}
                  onPress={this.props.press?this.props.press.bind(this,data.key):()=>{}}
                  underlayColor={'#c9c9c9'}
                  key={index}
                >
                  <Text style={styles.itemText}>
                    {data.name}
                  </Text>
                </TouchableHighlight>
              )
            }): null}
            <TouchableHighlight
              style={[styles.itemBtn, {marginTop: 20,borderRadius: 5,marginBottom: 20}]}
              onPress={this.props.cancel?this.props.cancel:()=>{}}
              underlayColor={'#c9c9c9'}
            >
              <Text style={[styles.itemText,{color: '#698afe'}]}>
                取消
              </Text>
            </TouchableHighlight>
          </View>
          :
          <View style={styles.modalStyles}>
            <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)',width: 100, height: 100,borderRadius:20,justifyContent:'center', alignItems:'center'}}>
              <ActivityIndicator
                animating={true}
                style={styles.centering}
                size="large"
              />
              <Text style={{color: '#fff', fontSize: 16}}>请求中...</Text>
            </View>
          </View>
        }
      </Modal>
    );
  }
}