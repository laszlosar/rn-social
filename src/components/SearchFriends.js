import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Platform} from 'react-native';
import { List, Input, Label,  Item, Text } from 'native-base';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';

import colorPallet from '../components/ui/color';
import { FriendCard } from '../components';

class SearchFriends extends Component {
    constructor(props){
        super(props);
        this.state = {
            users:[]
        };
    }
    formatData = () => {
        return this.state.users.map(user => {
            user.key = user.uid;
            return user;
        });
    }

  
    gotData = (data) => {
        users = Object.values(data.val());
        filteredUsers = users.filter(user => !this.props.exclude.includes(user.uid)); 
        this.setState({ users: filteredUsers }); 
    }
    
    errData = (err) => {
        console.log(err);
    }

    onTextChange = name => text => {
        this.setState({[name]:text}, this.searchPlayers)
    }

    searchPlayers = () => {
        const searchCode = Platform.OS === 'android' ? '\u{F8FF}' : '\uf8ff'
        console.log(this.state.search, this.props);
        // Todo Implement advanced search
        firebase.database().ref(`usersFriends/${this.props.user.user.uid}`)
            .orderByChild('name')
            .startAt(`${this.state.search}`)
            .endAt(`${this.state.search}${searchCode}`)
            .limitToFirst(30)
            .once('value', this.gotData, this.errData);    
    }

    componentDidMount(){
        if(this.props.user &&  this.props.user.user && this.props.user.user.uid){
            firebase.database().ref(`usersFriends/${this.props.user.user.uid}`).limitToFirst(30).once("value", this.gotData, this.errData);        
        }
    }

    btnMethod = uid => {
        this.props.btnMethod(uid);
    }    

    render(){
        console.log(this.props);
        return (
            <View style={styles.container}>
            
                <Item floatingLabel>
                    <Label  style={{ color: colorPallet.dark }}>Search By Name</Label>
                    <Input onChangeText={this.onTextChange('search')}/>
                </Item>
                <List>
                    <FlatList 
                        data={this.formatData()}
                        renderItem={ (info) => <FriendCard key={info.item.key} actions={this.props.actions} {...info.item}/> }
                    />
                </List>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        flex:1,
        backgroundColor:"#fff",
        width: '100%',
    }
})

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

  export default connect(mapStateToProps, null)(SearchFriends);
