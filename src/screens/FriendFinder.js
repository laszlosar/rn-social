import React, { Component } from 'react';
import { View, StyleSheet, FlatList} from 'react-native';
import { List, Icon, Input, Label,  Item, Text, Picker } from 'native-base';
import { FriendCard } from '../components';
import colorPallet from '../components/ui/color';
import { connect } from 'react-redux';

import Icn from 'react-native-vector-icons/Ionicons';

class FriendFinder extends Component {
    constructor(props){
        super(props);
        this.state = {
            users:[]
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }
    onNavigatorEvent = e => {
        if(e.type === 'NavBarButtonPress' &&   e.id === 'closeModal'){
            this.props.navigator.dismissModal({
                animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
              });
            // rootNavigator = this.props.navigator
        }
    }
   
    viewFriendProfile = (key, name) => {
        Promise.all([
            Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
        ]).then( source => {
            this.props.navigator.showModal({
                screen: 'Rally.FriendProfile', // unique ID registered with Navigation.registerScreen
                title: name, // title of the screen as appears in the nav bar (optional)
                passProps: {friendUserId: key, name: name}, // simple serializable object that will pass as props to the modal (optional)
                // navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
                navigatorButtons:{
                    leftButtons: [
                        {
                            icon: source[0],
                            title: 'Menu',
                            id: 'closeModal'
                        }
                    ]
                },
                animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
            });
        });
    }
    formatData = () => {
        return this.state.users.map(user => {
            user.key = user.uid;
            return user;
        });
    }

    gotData = (data) => {
        let users = data.hits.map(x => x._source).filter(x => x.phone);
        this.setState({ users });
    }
    
    errData = (err) => {
        console.log(err);
    }
    
    searchPlayers = () => {
        let url = `http://35.238.22.22//elasticsearch/users/user/_search?default_operator=AND&analyze_wildcard=true&q=name:*${this.state.name ? this.state.name : ""}*`
        if(this.state.location)
            url = `${url}+location:*${this.state.location}*`;
        if(this.state.rating)
            url = `${url}+location:*${this.state.rating}*`;
        
        fetch(url, {
            headers:{
              'Content-Type': 'application/json',
              'Authorization': 'Basic dXNlcjpralpQcXFSN2szeDM='
            }
        })
        .then(x => x.json())
        .then(x => {
            this.gotData(x.hits);
        })
    }
    onTextChange = name => text => {
        this.setState({[name]:text}, () => this.searchPlayers());
    }

    onValueChange = (key) => (value) => {
        this.setState({[key]: value}, () => this.searchPlayers());
    }
   
    chatWithFriend = props => {
        Promise.all([
            Icn.getImageSource('ios-arrow-down-outline',30), // friends and groups 
        ]).then( source => {
            this.props.navigator.showModal({
                screen: 'Rally.UserChat', // unique ID registered with Navigation.registerScreen
                title: props.name, // title of the screen as appears in the nav bar (optional)
                passProps: props, // simple serializable object that will pass as props to the modal (optional)
                // navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
                navigatorButtons:{
                    leftButtons: [
                        {
                            icon: source[0],
                            title: 'Menu',
                            id: 'closeModal'
                        }
                    ]
                },
                animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
            });
        });
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <Text style={styles.txtHead}> Search Rally Comunity </Text>
                    <Item floatingLabel>
                        <Label  style={{ color: colorPallet.dark }}>Name</Label>
                        <Input onChangeText={this.onTextChange('name')}/>
                    </Item>
                    <Item floatingLabel>
                        <Label  style={{ color: colorPallet.dark }}>Location</Label>
                        <Input onChangeText={this.onTextChange('location')}/>
                    </Item>
                    <Item picker style={styles.pickerItems}>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="ios-arrow-down-outline" />}
                            style={{ width: undefined }}
                            placeholder="Rating"
                            placeholderStyle={{color: colorPallet.dark }}
                            placeholderIconColor={colorPallet.dark}
                            selectedValue={this.state.rating}
                            onValueChange={this.onValueChange('rating')}
                        >
                            {/* <Picker.Item label="1.0" value="1" /> */}
                            <Picker.Item label="" value="" />
                            <Picker.Item label="2.0" value="2.0" />
                            <Picker.Item label="2.5" value="2.5" />
                            <Picker.Item label="3.0" value="3.0" />
                            <Picker.Item label="3.5" value="3.5" />
                            <Picker.Item label="4.0" value="4.0" />
                            <Picker.Item label="4.5" value="4.5" />
                            <Picker.Item label="5.0" value="5.0" />
                        </Picker>
                    </Item>
                </View>
                <List>
                    <FlatList 
                        style={styles.listContainer}
                        data={this.formatData()}
                        renderItem={ (info) => <FriendCard {...info.item} /> }
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
    },
    wrapper: {
        width: '90%',
        alignSelf: 'center'
    },
    listContainer: {
        width: '100%',
    },
    txtHead:{
        textAlign:'center',
        fontSize:25,
        color: colorPallet.main,
        margin: 20
    }

})

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps, null)(FriendFinder);