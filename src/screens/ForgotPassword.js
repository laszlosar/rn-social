import React, { Component } from 'react';
import { View, StyleSheet, Image,  Dimensions, TouchableOpacity  } from 'react-native';
import { Button, Segment, Text } from 'native-base';
import { Input, BigButton, SecondButton } from '../components/ui';
import { connect } from 'react-redux'; 
import { setUser } from '../store/actions'
import firebase from 'react-native-firebase';
import colorPallet from '../components/ui/color';
import logo from '../assets/rally_logo.png';
import corner from '../assets/corner_ball.png';
import go from './main/goTo.js';

class ForgotPassword extends Component {
  constructor(props){
    super(props);
    this.state = {
      msg: "Please enter email to reset your password"
    }
  }
  onTextChange = name => text => {
    console.log(name, text);
    this.setState({[name]:text})
  }

  forgotPassword = () => {
    console.log('hello', this.state.email);
    firebase.auth().sendPasswordResetEmail(this.state.email)
    .then(res => {
      this.setState({msg:"An email has been sent with instructions to reset your password"});
      if (res) {
        console.log('default app user ->',res);
      }
    }).catch(err => console.log(err));
  }
 
  goTo = destination => {
    go(this.props.navigator, destination);
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <Image source={corner} style={styles.cornerTop}/>
        <Image source={corner} style={styles.cornerBottom}/>
      <View style={styles.container}>
          <Image source={logo} style={styles.logo}/>
          <Segment style={styles.segment}>
                <Button style={styles.btn} first onPress={() => this.goTo('Rally.SignUp')}>
                    <Text style={styles.txt}>Sign Up</Text>
                </Button>
                <Button style={styles.btn} last onPress={() => this.goTo('Rally.SignIn')}>
                    <Text style={styles.txt}>Sign In</Text>
                </Button>
          </Segment>
      </View>
      <View>
        <Text style={styles.txt}>{this.state.msg}</Text>
      </View>
      <View style={styles.container}>
          <Input placeholder="Email" keyboardType="email-address" textContentType="emailAddress" onChangeText={this.onTextChange('email')}/>
          <BigButton onPress={this.forgotPassword}> Reset Password </BigButton>
      </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent:'space-around',
    flex: 1
  },
  logo:{
    width: Dimensions.get('window').width * .8,
    height: Dimensions.get('window').height * .3,
    resizeMode: Image.resizeMode.contain
  },
  cornerTop:{
    position: 'absolute',
    top:0,
    right:0,
    zIndex:-999,
    transform: [{ rotate: '180deg'}]

  },
  cornerBottom:{
    position: 'absolute',
    bottom:0,
    left:0
  },
  container:{
      width: '100%',
      alignItems: 'center',
      marginBottom:20
  },
  txtwrapper:{
      width: '100%',
      alignItems: 'center',
      marginTop:20
  },
  segment:{
    marginTop:10,
    backgroundColor:'#fff'
  },
  selectedBtn:{
    borderColor: colorPallet.main,
    backgroundColor: colorPallet.main
  },
  selectedTxt:{
    fontSize: 19,
    color: 'white'
  },
  btn:{
    borderColor: colorPallet.main
  },
  txt:{
    fontSize: 19,
    color: colorPallet.main
  },
  lrgtxt:{
    fontSize: 29,
    color: colorPallet.main
  }
})

const mapDispatchToProps = dispatch => {
  return {
      setUser: (user) => {
          dispatch(setUser(user));
      }
  }
}

export default connect(null, mapDispatchToProps)(ForgotPassword);