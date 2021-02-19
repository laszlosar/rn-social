import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { List, Item, Text, Button, Icon, Input } from 'native-base';
import { connect } from 'react-redux';
import { AlertCard } from '../components';
import firebase from 'react-native-firebase';

class MessageAlerts extends Component {
    constructor(props){
        super(props);
        this.state ={
            messages: [],
            message: ""
        }
        // order pid and uid alphabetically
        console.log(props);
        this.ref = firebase.database().ref(`messageNotifications/${this.props.user.user.uid}`);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = e => {
        if(e.type === 'NavBarButtonPress' &&   e.id === 'closeModal'){
            this.props.navigator.dismissModal({ animationType: 'slide-down' });
        }
    }

    sendMessage = ({uid}) => {
       console.log("message", uid)
    }

    getData = () => {
        this.ref.on("value", this.gotData, this.errData);
    }

    gotData = (data) => {
        responseData = data.val();
        if(!responseData) return false;
        const timeKeys = Object.keys(responseData);
        const uo = {};
        timeKeys.forEach(tk => {
            if(this.props.user && responseData[tk].friendId != this.props.user.user.uid){
                if(!Object.keys(uo).includes(responseData[tk].friendId)){
                    uo[responseData[tk].friendId] = responseData[tk];
                    uo[responseData[tk].friendId].timeKey = tk;
                    uo[responseData[tk].friendId].key = tk;
                }else{
                    let d = uo[responseData[tk].friendId];
                    if(d.timeKey > tk){
                        console.log("we good");
                    }else{
                        uo[responseData[tk].friendId] = responseData[tk];
                        uo[responseData[tk].friendId].timeKey = tk;
                        uo[responseData[tk].friendId].key = tk;
                    }
    
                }
            }
        });
        const arr = Object.values(uo).map(d => ({...d}));
        this.setState({messages: arr });
    }

    formatMessages = () => {
        return this.state.messages;
    }
    errData = (err) => {
        console.log(err);
    }

    componentDidMount(){
        this.getData();
    }

    componentWillUnMount(){
        this.ref.off();
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.container}>
                    <List>
                        <FlatList 
                            style={styles.messageContainer}
                            data={this.formatMessages()}
                            renderItem={ (info) => <AlertCard key={info.item.timeKey} {...info.item}/> }
                        />
                    </List>
                </View> 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:"white",
        width: '100%',
        display:'flex',
        flex:1,
   },
    messageContainer: {
        width: '100%',
   },
   sendMessage: {
    display:"flex",
    flexDirection: "row",
    width:"100%",
    height:50,
    marginBottom:15
   },
   flex1:{
     display:'flex',
     flex:1,
   },
   txt:{
       textAlign:"center"
   }
})

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps, null)(MessageAlerts);