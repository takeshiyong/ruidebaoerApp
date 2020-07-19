import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, Image, Modal} from 'react-native';
import Header from '../../components/header';
import Toast from 'react-native-root-toast';

const {width, height} = Dimensions.get('window');
export default  class DeviceRecord extends Component {
    //设置头部
    static navigationOptions = () => ({
        header: null
    });
    state= {
        fCause: '',
        fNumber: null,
        fPartName: '',
        index:null
    }

    componentDidMount() {
        if (this.props.navigation.state.params && this.props.navigation.state.params.value) {
            const { value } = this.props.navigation.state.params;
            const { index } = this.props.navigation.state.params;
            this.setState({
                fCause: value.fCause,
                fNumber: value.fNumber,
                fPartName: value.fPartName,
                index
            })
          }
    }
    //判断是不是纯数字
    checknumber (String) {
        var reg = /^[0-9]+.?[0-9]*$/;
        if (reg.test(String)) {
          return true
        }
        return false
      }
    // 确认选择
    chooseTrue = () => {
        
        const {navigate,goBack,state} = this.props.navigation;
        const {fCause,fNumber,fPartName,index} = this.state;
        if(fNumber == null){
            Toast.show('数量不能为空');
            return;
        }else{
            let b= this.checknumber(fNumber);
            if(!b){
                Toast.show('数量只能为数字类型');
                return;
            }
        }
        if(fPartName == ''){
            Toast.show('名字不能为空');
            return;
        }else if(fPartName&&fPartName.trim().length == 0){
            Toast.show('名字不能为空');
            return;
        }
        
        let value = {
            fCause,
            fNumber,
            fPartName,
            index
        }
        state.params.getValue(value);
        goBack();
    }
    //取消选择
    chooseFalse = () => {
        const {navigate,goBack,state} = this.props.navigation;
        goBack();
    }
    render() {
         return (
            <View style={styles.container}>
                <Header 
                    backBtn={true}
                    titleText={'换件信息新增'}
                    props={this.props}
                    hidePlus= {this.state.type == 1? true: false}
                    
                />
                <View style={{backgroundColor: "#fff",paddingLeft: 16,paddingRight: 16}}>
                    <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,}}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                <Image source={require("../../image/workStatus/filePencil.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                        零件名称
                                    </Text>
                                </View>
                            <TextInput
                                style={{height: 40,textAlignVertical: "top"}}
                                onChangeText={(text) => this.setState({fPartName: text.trim()})}
                                placeholder="请输入更换零件名称"
                                multiline={true}
                                value={this.state.fPartName}
                                />
                    </View>
                    <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,}}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                <Image source={require("../../image/workStatus/filePencil.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    <Text style={{color: 'red'}}>*</Text>
                                        更换数量
                                    </Text>
                                </View>
                            <TextInput
                                style={{height: 40,textAlignVertical: "top"}}
                                onChangeText={(text) => this.setState({fNumber: text.trim()})}
                                placeholder="请输入更换数量"
                                maxLength={15}
                                multiline={true}
                                value={this.state.fNumber}
                                />
                    </View>
                    <View style={{borderBottomColor: "#F0F1F6",borderBottomWidth: 1,}}>
                            <View style={{flexDirection: "row",alignItems: "center",marginTop: 20}}>
                                <Image source={require("../../image/workStatus/filePencil.png")} style={{width: 16, height: 16,marginRight: 4}}/>
                                <Text style={{color: "#333333", fontSize: 14,fontWeight: 'bold'}}>
                                    {/* <Text style={{color: 'red'}}>*</Text> */}
                                        原因
                                    </Text>
                                </View>
                            <TextInput
                                style={{height: 80,textAlignVertical: "top"}}
                                onChangeText={(text) => this.setState({fCause: text.trim()})}
                                placeholder="请输入更换原因"
                                multiline={true}
                                value={this.state.fCause}
                                />
                    </View>
                    
                </View>
                <View style={{width: width,paddingLeft: 16,paddingRight: 16,bottom: -250,height: 100,flexDirection: "row",backgroundColor: "#fff"}}>
                    <TouchableOpacity style={[styles.bottom,styles.bottomLeft]} onPress={ () => {this.chooseFalse()}}>
                            <Text style={{color: "#4058FD", fontSize: 16}}>取消</Text>
                        </TouchableOpacity>
                    <TouchableOpacity style={[styles.bottom,{flex: 5}]} onPress={ () => {this.chooseTrue()}}>
                            <Text style={{color: "#fff", fontSize: 16}}>确认</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}




const styles = StyleSheet.create({
    container: {
        width,
        height,
        backgroundColor: '#F4F4F4',
    },
    bottom: {
        width: '100%',
         height: 44,
         marginTop: 10,
         alignItems: "center",
         justifyContent: "center",
         backgroundColor: "#4058FD", 
         borderRadius: 5
    },
    bottomLeft: {
        flex: 3,
        marginRight: 5,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor:"#4058FD"
    }
});
