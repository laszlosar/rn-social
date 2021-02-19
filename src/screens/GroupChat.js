import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { List, Item, Text, Button, Icon, Input } from 'native-base';
import { connect } from 'react-redux';
import { Message } from '../components';
import firebase from 'react-native-firebase';

class GroupChat extends Component {
    constructor(props){
        super(props);
        this.state ={
            messages: [],
            message: ""
        }
        this.ref = firebase.database().ref(`groupChat/${this.props.gid}`);
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
        const arrayOfMessages = Object.keys(responseData).map(key => { return {...responseData[key], key: key}});
        this.setState({messages: arrayOfMessages });
    }

    errData = (err) => {
        console.log(err);
    }

    onTextChange = name => text => {
        this.setState({[name]:text})
    }

    sendChatMessage = () => {
        console.log(this.state);
        console.log(this.props.user.user);
        if(!this.state.message) return false
     
        firebase.database().ref(`groupChat/${this.props.gid}/${this.state.messages.length}`).set({uid: this.props.user.user.uid, message: this.state.message}, 
            () => {
                this.setState({message:""});
            })
            .catch(err => console.log('oh no', err));
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
                            data={this.state.messages}
                            renderItem={ (info) => <Message {...info.item}/> }
                        />
                    </List>
                </View> 
                
                <View style={styles.sendMessage}>
                    <Item rounded style={styles.flex1}>
                        <Input placeholder='Rounded Textbox' onChangeText={this.onTextChange('message')} value={this.state.message}/>
                    </Item>
                    <Button iconLeft transparent >
                        <TouchableOpacity onPress={this.sendChatMessage}>
                            <Icon type="FontAwesome" name='send' size={30} color="#900" />
                        </TouchableOpacity>
                    </Button>
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

export default connect(mapStateToProps, null)(GroupChat);