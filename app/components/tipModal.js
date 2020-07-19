import React from "react";
import { ActivityIndicator, StyleSheet, Text, View,Dimensions,TouchableOpacity, TouchableHighlight,Image,TextInput} from "react-native";
import Toast from './toast';
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
 
export default class TipModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal : false,
            num: 1,
            type: "",
            content: ''
        };
    }

    render() {
        const { type, affirmContent} = this.props;
        if (!this.props.showModal) {
          return null;
        }
        return (
            <View style={{
                flex : 1,
                width : width,
                height : height,
                position : 'absolute',
                backgroundColor : '#10101099',
                zIndex: 999
            }}>
                <TouchableHighlight style={{width: "100%",height: "100%",alignItems: "center",justifyContent: "center"}}>
                    <View style={{width: width -50,height: 170,backgroundColor: "#fff",borderRadius: 5,alignItems: "center"}}>
                        <Text style={{fontSize: 16,color: "#333",fontWeight: "600",marginTop: 40,marginBottom: 20,width: '100%',paddingRight: 10,paddingLeft: 10,textAlign: 'center'}}>
                          {this.props.tipText}
                        </Text>
                        
                        <View style={styles.meetingBotton}>
                            <TouchableOpacity style={styles.bottomLeft} onPress={() => {this.props.onCancel && this.props.onCancel()}}>
                                <Text style={{color: "#333", fontSize: 14}}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.bottomRight} onPress={() => {this.props.onOk && this.props.onOk()}}>
                                <Text style={{color: "#fff", fontSize: 14}}>确认</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    numStyle: {
        fontSize: 16,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 20,
        paddingRight: 18,
        borderColor: "#E0E0E0",
        fontWeight: "500"
    },
    button: {
        width: 208,
        height: 44,
        backgroundColor: "#4058FD",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        marginTop: 14,
    },
    numButtom:{
        borderWidth: 1,
        borderColor: "#E0E0E0",
        flexDirection: "row",
        borderRadius: 5,
        alignItems: "center",
        marginTop: 14
    },
    showNum: {
        width: 60,
        height: 20,
        backgroundColor: "#E0E0E0",
        alignItems: "center", 
        justifyContent: "center",
        position: 'absolute',
        bottom: 12,
        right: 12
    },
    topBox:{
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "#E7E7E7",
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingBottom: 16,
        alignItems: "center"
    },
    useText:{
        width: 56,
        height: 20,
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#FFECE6",
        borderRadius: 5,
        marginLeft: 10
    },
    addButton: {
        fontSize: 22,
        padding: 8,
        backgroundColor: "#F6F6F6",
        paddingLeft: 12,
        paddingRight: 12
    },
    cutButton: {
        fontSize: 22,
        padding: 8,
        backgroundColor: "#F6F6F6",
        paddingLeft: 12,
        paddingRight: 12
    },
    meetingBotton: {
        height: 59,
        alignItems: "center", 
        paddingLeft: 16, 
        paddingRight: 16, 
        flexDirection: "row", 
        justifyContent: "space-between",
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: "#fff",
        marginTop: 10,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    bottomLeft: {
        flex: 2,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
        height: "100%",
        borderRadius: 5
    },
    bottomRight: {
        flex: 3,
        backgroundColor: "#4058FD", 
        alignItems: "center", 
        justifyContent: "center",
        height: "100%",
        borderRadius: 5
    }
});
