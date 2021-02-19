import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { DatePicker, BigButton } from '../components/ui';
import { Textarea, Input, Label, Item, Picker, Icon, CheckBox, Body, Text } from 'native-base';
import colorPallet from '../components/ui/color';
export default class SetGameDetails extends Component {
    constructor(props){
        super(props);
        let d = new Date();
        this.state = {
            chosenDate: d,
            chosenTime: d.getTime(),
            noLimit: true,
            gameNote: null,
            toggle: 'firstToRespond',
            groupSize: null
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    setDate = newDate => {
        // console.log(newDate)
        // console.log(Date.parse(newDate))
        this.setState({ chosenDate: newDate });
        this.setState({ chosenTime: Date.parse(newDate) });
    }

    // setTime = newTime => {
    //     console.log(newTime);
    //     this.setState({ chosenTime: newTime });
    // }
    
    onNavigatorEvent = e => {
        if(e.type === 'NavBarButtonPress' &&   e.id === 'leftDrawerToggle')
            this.props.navigator.toggleDrawer();
    }
    
    onValueChange = (key) => (value) => {
        this.setState({[key]: value});
    }
    
    onTextChange = name => text => {
        console.log(name, text);
        this.setState({[name]:text})
    }
   
    onNumberChange = name => number => {
        console.log(name, number);
        if(isNaN(parseInt(number)) && name === "groupSize"){
            this.setState({error: "groupSize"});
        }else{
            if(name === "groupSize"){
                this.setState({error: null});
            }
            this.setState({[name]:parseInt(number)})
        }
    }

    goToInvite = () => {
        if(this.state.toggle === "inviteInOrder" && !this.state.hoursToRespond) return false;
        if((!this.state.errors && this.state.groupSize && !this.state.noLimit) || this.state.noLimit){
            this.props.navigator.push({
                screen:'Rally.InviteDetails',
                title: "Invite Players", 
                passProps: {
                    gameDetails: this.state,
                    foo : 'bar'
                }
            });
        }
        if(!this.state.groupSize && !this.state.noLimit){
            this.setState({error: "groupSize"});
        }
    }

    handleCheckbox = key => () => {
        if(!this.state.noLimit && key==="noLimit"){
            this.setState({toggle:'firstToRespond', error:null, groupSize:null})
            // this.setState({error:null});
        }

        this.setState({[key]: !this.state[key]});
    }

    handleToggle = key => () => {
        this.setState({toggle: key});
    }

    render(){
        const groupColor = this.state.noLimit ? '#ffffff' : '#aeaeae';
        const hoursColor = this.state.toggle != "inviteInOrder" ? '#ffffff' : '#aeaeae';
        return(
                <View style={styles.container}>
                    <View style={styles[ Platform.OS === 'android' ? 'androidContainer' : 'IOSContainer']}>
                        <DatePicker setDate={this.setDate} />
                    </View>
                    <View  style={styles.wrapper}>
                        {/* <View style={styles.pickerItemsContainer} >
                            <Item picker style={styles.pickerItems}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    placeholder="Play Type"
                                    placeholderStyle={{ color: colorPallet.dark }}
                                    placeholderIconColor={colorPallet.dark}
                                    selectedValue={this.state.playType}
                                    onValueChange={this.onValueChange('playType')}
                                >
                                    <Picker.Item label="Mixed Doubles" value="Mixed Doubles" />
                                    <Picker.Item label="Mens" value="Mens" />
                                    <Picker.Item label="Womens" value="Womens" />
                                    <Picker.Item label="Doubles" value="Doubles" />
                                    <Picker.Item label="Any" value="Any" />
                                </Picker>
                            </Item>
                        </View>  */}
                        {/* <Textarea rowSpan={3} bordered placeholder="Write a note about the game..."  onTextChange={this.onTextChange('gameNote')}/> */}
                        <Item floatingLabel>
                            <Label style={{ color: colorPallet.dark }} >Note</Label>
                            <Input onChangeText={this.onTextChange('gameNote')} />
                        </Item>
                        <Item floatingLabel>
                            <Label style={{ color: colorPallet.dark }} >Location</Label>
                            <Input onChangeText={this.onTextChange('location')} />
                        </Item>
                        <View style={styles.groupInputWrapper}>
                            <View style={styles.groupCheckBox}>
                                <CheckBox style={styles.checkBox} onPress={this.handleCheckbox('noLimit')} checked={!this.state.noLimit} color={colorPallet.main} />
                                <Body>
                                    <Text style={styles.txt}>Set Group Limit</Text>
                                </Body>
                            </View>
                            <Item style={{height:50, flex: 7, borderColor: (this.state.error === "groupSize" ? colorPallet.error : groupColor)}}>
                                {/* <Label style={{ color: colorPallet.dark }} >Group Size</Label> */}
                                <Input 
                                    keyboardType = 'numeric'
                                    onChangeText={this.onNumberChange('groupSize')} 
                                    disabled = {this.state.noLimit}
                                    value= {this.state.groupSize ? String(this.state.groupSize): ""}
                                />
                            </Item>
                            
                        </View>
                        {this.state.noLimit
                        ? null
                        : <View>
                            <View style={styles.row}>
                                <CheckBox onPress={this.handleToggle('firstToRespond')} checked={this.state.toggle === "firstToRespond"} color={colorPallet.main} />
                                <Text style={styles.txtTwo}>Invite all. First to respond is in</Text>
                            </View>
                           <View style={styles.row}>
                                <CheckBox onPress={this.handleToggle('inviteInOrder')} checked={this.state.toggle === "inviteInOrder"} color={colorPallet.main} />
                                <Text style={styles.txtTwo}>Invite in order - respond in</Text>
                                <Item inlineLabel style={{height:30, width:30, marginLeft:25, position: 'relative', bottom: 7, borderColor: ((this.state.error === "hours" || (this.state.toggle === "inviteInOrder" && !this.state.hoursToRespond)) ? colorPallet.error : hoursColor)}}>
                                    <Input 
                                        keyboardType = 'numeric'
                                        onChangeText={this.onNumberChange('hoursToRespond')} 
                                        disabled = {this.state.toggle != "inviteInOrder"}
                                    />
                                </Item>
                                <Text style={styles.txtTwo}>hours</Text>
                            </View>
                        </View>
                        }
                        
                    </View>
                    <BigButton onPress={this.goToInvite}> Invite Players </BigButton>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    IOSContainer: {
        width: '100%',
      },
      androidContainer: {
        width: '100%',
        marginBottom:30,
        marginTop:30,
      },
      row:{
          width:'100%',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height:30
      },
      wrapper:{
          display:'flex',
          flex: 1,
      },
    container: {
        backgroundColor:'#fff',
        width: '100%',
        flex:1,
        alignItems: 'center'
    },
    pickerItemsContainer:{
        flexDirection: 'row',
    },
    pickerItems:{
        width:'100%',
        alignItems: 'center'
    },
    groupInputWrapper:{
        width:'100%',
        height:50,
        marginBottom:15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    groupCheckBox:{
        height:50,
        flex:7,
        flexDirection: 'row',
    },
    checkBox:{
        position:'relative',
        top:23,
    },
    txt:{
        position:'relative',
        top:8,
    },
    txtTwo:{
        // textAlign: 'left',
        position:'relative',
        left:15,
        
    },
    foo:{
        borderColor: "black"
    },
    comment:{
        borderColor: "black",
        borderRadius:10,
        height:90
    },
    checkbox:{
        position:'relative',
        top:10
    }

})