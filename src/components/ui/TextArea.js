import React, { Component } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default class TextArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  render() {
    return (
     <View style={styles.textArea}>
       <TextInput
         multiline = {true}
         numberOfLines = {4}
         onChangeText={(text) => this.setState({text})}
         editable = {true}
         underlineColorAndroid='transparent'
         value={this.state.text}
       />
     </View>
    );
  }
}

const styles = StyleSheet.create({
    textArea: {
        width:'80%',
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 5
    }
})