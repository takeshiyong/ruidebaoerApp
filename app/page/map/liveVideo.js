import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  NativeModules,
  processColor,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions
} from 'react-native';
import KSYVideo from 'react-native-ksyvideo';
import AntDesign from 'react-native-vector-icons/AntDesign'
import AudioController from './AudioController';
import SplashScreen from 'react-native-splash-screen';
import config from '../../config';

const { width, height } = Dimensions.get('window');
export default class LiveScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {showbar: true, degree: 0 , mirror: false, volume: 0.5};
    }

    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    componentDidMount() {
      SplashScreen.hide();
    }

    onPressRotate(){
        //this.state.degree=(this.state.degree+90)%360;
        // this.video.setRotateDegree(this.state.degree);
        this.setState({degree: this.state.degree?0:270});
    }
    
    onAudioProgressChanged(newPercent) {
        if (newPercent >= 0){
          this.setState({volume: newPercent/100});
        }
    }

    render() {
    const {params} = this.props.navigation.state;
    const {volume} = this.state;
    console.log(config.cameraDes+params.fChannel)
        return (
      <View style={[styles.container, {alignItems: !this.state.degree?'flex-start':'flex-end', flexDirection: !this.state.degree?'row':'column'}]}>
          <KSYVideo
              ref={(video)=>{this.video = video}}
              source={{uri: config.cameraDes+params.fChannel}}
              bufferSize={30}
              bufferTime={4}
              repeat={true}
              mirror={this.state.mirror}
              degree={this.state.degree}
              resizeMode={'contain'}
              volume={volume}
              onTouch={()=>{
                      this.setState({showbar: !this.state.showbar})
              }}
              onLoad={(data)=>{console.log("JS onPrepared, video size = " + data.naturalSize.width + "x" +  data.naturalSize.height);}}
              onEnd={(data)=>{this.props.navigation.goBack();console.log("JS onCompletion");}}
              onError={(data)=>{this.props.navigation.goBack();console.log("JS onError:" + data.error.what + data.error.extra);}}
              style={styles.fullScreen}
            />        

          {this.state.showbar && !this.state.degree?(
            <TouchableOpacity style={{justifyContent:'flex-start', width:40, marginTop:15,height: 40,borderRadius: 50,backgroundColor: 'rgba(0,0,0,0.6)',justifyContent: 'center',alignItems: 'center',marginLeft: 15}} onPress={()=>this.props.navigation.goBack()}>
              {/* <Image source={require('../../image/goBack.png')} style={{width: 25,height: 25,marginTop: 20,marginLeft: 15}}/> */}
              <AntDesign name="arrowleft" color="#fff" size={20}/>
            </TouchableOpacity>):(null)}

          {this.state.showbar && !this.state.degree?(
            <View style={{marginRight:10, justifyContent: 'center',alignItems: 'center',height}}>
              <TouchableOpacity style={{marginTop:20}} onPress={()=>{this.video.saveBitmap();}}>
                 <Image style={{width:40,height:40}} source={require("../../image/map/live/screen_shot.png")}/>
              </TouchableOpacity>

              <TouchableOpacity style={{marginTop:40}} onPress={this.onPressRotate.bind(this)}>
                <Image style={{width:40,height:40}} source={require("../../image/map/live/rotation.png")}/>
              </TouchableOpacity>
            </View>):(null)}

        {this.state.showbar && this.state.degree?(
          <View style={{width: 40,height: 40,borderRadius: 50,backgroundColor: 'rgba(0,0,0,0.6)',justifyContent: 'center',alignItems: 'center',marginTop: 15,marginRight: 25}}>
            <TouchableOpacity  onPress={()=>this.props.navigation.goBack()}>
              <AntDesign name="arrowup" color="#fff" size={20}/>
            </TouchableOpacity>
          </View>):(null)}

          {this.state.showbar && this.state.degree?(
            <View style={{marginBottom:10, alignItems: 'center',justifyContent: 'center',flexDirection: 'row',width,height: 50,borderColor: 'red'}}>
              <TouchableOpacity  onPress={this.onPressRotate.bind(this)}>
                <Image style={{width:40,height:40}} source={require("../../image/map/live/rotation-left.png")}/>
              </TouchableOpacity>

              <TouchableOpacity style={{marginLeft: 50}} onPress={()=>{this.video.saveBitmap();}}>
                 <Image style={{width:40,height:40}} source={require("../../image/map/live/screen_shot-left.png")}/>
              </TouchableOpacity>
            </View>):(null)}

          

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'black',
  },

  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },

 videoView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  controller: {
    height: 30,
    width: 250,
    justifyContent: "center",
    alignItems: "center"
  },
  progressBar: {
    alignSelf: "stretch",
    margin: 30
  },
});