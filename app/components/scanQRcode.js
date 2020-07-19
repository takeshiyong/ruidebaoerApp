//扫描二维码
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Easing,
    Dimensions
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IntegralServer from '../service/integralServer';
import deviceServer from '../service/deviceServer';
import Header from './header';
import Toast from '../components/toast';
const {width, height} = Dimensions.get('window');

class ScanScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            moveAnim: new Animated.Value(0),
            light: RNCamera.Constants.FlashMode.off
        };
    }

    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    componentDidMount() {
        this.startAnimation();
    }

    startAnimation = () => {
        this.state.moveAnim.setValue(0);
        Animated.timing(
            this.state.moveAnim,
            {
                toValue: -200,
                duration: 1500,
                easing: Easing.linear
            }
        ).start(() => this.startAnimation());
    };
    // 识别二维码
    onBarCodeRead = async (result) => {
        console.log(result, this.props.navigation.state.params);
        if (this.props.navigation.state.params && this.props.navigation.state.params.fromVerif) {
            const res = await IntegralServer.getForDetails(result.data);
            if(res.success){
                this.props.navigation.replace('Confirmation',{id:result.data});
            }else{
                Toast.show("商品二维码有误")
                console.log(res.msg)
            }
        }
        if (this.props.navigation.state.params && this.props.navigation.state.params.fromDevice) {
            const res = await deviceServer.getDeviceDetailById(result.data);
            if (res.success) {
                this.props.navigation.replace('DeviceDetail', {type: 1, item: {fEquipmentId: result.data, fPatrolTaskId: this.props.navigation.state.params.taskId, fId: result.data},onRefresh: this.props.navigation.state.params.onRefresh});
              } else {
                 Toast.show("设备二维码有误")
                 console.log(res.msg)
              }
        }
        if (this.props.navigation.state.params && this.props.navigation.state.params.toDetail) {
            const res = await deviceServer.getDeviceDetailById(result.data);
            if (res.success) {
                this.props.navigation.replace('DeviceDetail', {type: 2, item: {fId: result.data}});
              } else {
                Toast.show("设备二维码有误")
                console.log(res.msg)
              }
        }
    };
    // 切换灯光
    openLight = () => {
        if(this.state.light == RNCamera.Constants.FlashMode.off){
            this.setState({
                light: RNCamera.Constants.FlashMode.torch
            })
        }else{
            this.setState({
                light: RNCamera.Constants.FlashMode.off
                })
            }
            
    }   
    render() {
        return (
            <View style={{flex: 1}}>
                <Header 
                    titleText="扫一扫"
                    backBtn={true}
                />
                <View style={styles.container}>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
                        flashMode={this.state.light}
                        onBarCodeRead={this.onBarCodeRead}
                        autoFocus={RNCamera.Constants.AutoFocus.on}
                    >
                        <View style={styles.rectangleContainer}>
                            <View style={styles.rectangle}>
                                <Icon 
                                name="flashlight" 
                                size={30} 
                                color="white"  
                                onPress={this.openLight}/>
                            </View>
                            <Animated.View style={[
                                styles.border,
                                {transform: [{translateY: this.state.moveAnim}]}]}/>
                            <Text style={styles.rectangleText}>将二维码放入框内，即可自动扫描</Text>
                        </View>
                    </RNCamera>
                </View>
            </View>
        );
    }
}

export default ScanScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    rectangle: {
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#00FF00',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rectangleText: {
        flex: 0,
        zIndex: 999,
        color: '#fff',
        marginTop: 10
    },
    border: {
        flex: 0,
        width: 200,
        height: 2,
        backgroundColor: '#00FF00',
    }
});