import React, { Component } from 'react';
import { View, StyleSheet} from 'react-native';
import {Input, Label,  Item, Text } from 'native-base';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import Icn from 'react-native-vector-icons/Ionicons';
import colorPallet from '../components/ui/color';
import {BigButton} from '../components/ui/';
import go from './main/goTo.js';

class CreateGroup extends Component {
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }
    
    onNavigatorEvent = e => {
        if(e.type === 'NavBarButtonPress' &&   e.id === 'closeModal'){
            this.props.navigator.dismissModal({
                animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
              });
            rootNavigator = this.props.navigator
        }
    }

    // goTo = destination => {
    //     go(this.props.rootNav, destination);
    // }
    
    createGroup = () => {
        // console.log(this.state);
        if( !this.state.name )return false;
        const groupRef = firebase.database().ref(`groups`).push();
        const groupKey = groupRef.key;
        firebase.database().ref(`groups/${groupKey}`)
          .set({...this.state, gid: groupKey}, () => console.log('oh yeah'))
          .catch(err => console.log('oh no', err));
        
        firebase.database().ref(`users/${this.props.user.user.uid}/groups/${groupKey}`)
          .set({[groupKey]:groupKey}, () => this.props.rootNav.dismissModal())
          .catch(err => console.log('oh no', err));
          console.log(groupKey);
    }

    onTextChange = name => text => {
        this.setState({[name]:text})
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <Text style={styles.txtHead}> Create A Group </Text>
                    <Item floatingLabel>
                        <Label  style={{ color: colorPallet.dark }}>Name</Label>
                        <Input onChangeText={this.onTextChange('name')} />
                    </Item>
                    <Item floatingLabel>
                        <Label  style={{ color: colorPallet.dark }}>Group Description</Label>
                        <Input onChangeText={this.onTextChange('description')} />
                    </Item>
                </View>
                <BigButton onPress={this.createGroup}>
                    Create Group
                </BigButton>
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
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
        rootNav: state.navigator.rootNav,
        user: state.user,
    }
  }
export default connect(mapStateToProps, null)(CreateGroup);