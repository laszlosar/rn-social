import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { List, Item, Text, Button, Icon, Input } from 'native-base';
import { connect } from 'react-redux';
import { Message } from '../components';
import colorPallet from '../components/ui/color';
import firebase from 'react-native-firebase';

class UserChat extends Component {
    constructor(props){
        super(props);
        this.state ={
            messages: [],
            message: ""
        }
        // order pid and uid alphabetically
        if(props){
            let uid = props.user.user.uid;
            let pid = props.uid;
            const refId = uid < pid ? `${uid}-${pid}` : `${pid}-${uid}`;
            this.ref = firebase.database().ref(`usersMessages/${refId}`);
        }
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
        if(!this.state.message) return false
     
        let uid = this.props.user.user.uid;
        let pid = this.props.uid;
        const refId = uid < pid ? `${uid}-${pid}` : `${pid}-${uid}`;
        firebase.database().ref(`usersMessages/${refId}/${this.state.messages.length}`).set({
                uid: this.props.user.user.uid,
                name: this.props.user.user.name, 
                profileURI: this.props.user.user.profileURI ? this.props.user.user.profileURI : "", 
                message: this.state.message
            }, () => { this.setState({message:""}); })
            .catch(err => console.log('oh no', err));
    }

    componentDidMount(){
        console.log(this.props);
        this.getData();
    }

    componentWillUnMount(){
        this.ref.off();
    }

    render(){
        // const bubbleColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        const bubbleColor = colorPallet.main;
        return(
            <View style={styles.container}>
                <View style={styles.container}>
                    <List>
                        <FlatList 
                            style={styles.messageContainer}
                            data={this.state.messages}
                            renderItem={ (info) => <Message {...info.item} name={this.props.name} bubbleColor={bubbleColor} sentByMe={this.props.user.user.uid === info.item.uid}/> }
                        />
                    </List>
                </View> 
                
                <View style={styles.sendMessage}>
                    <Item rounded style={styles.flex1}>
                        <Input onChangeText={this.onTextChange('message')} value={this.state.message}/>
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

export default connect(mapStateToProps, null)(UserChat);