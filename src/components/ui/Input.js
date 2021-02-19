import React from 'react';
import { TextInput, StyleSheet, Platform } from 'react-native';
import pallet from './color';

const Input = (props) => {
    // <TextInput {...props} style={[styles[Platform.OS === 'android' ? 'inputAndroid' : 'inputIOS'], props.style, {borderBottomColor: props.color || pallet.main }]} />
    return (
        Platform.OS === 'android'
        ? <TextInput {...props} style={[styles.inputAndroid, props.style ]} underlineColorAndroid= {props.color || pallet.main}  />
        : <TextInput {...props} style={[styles.inputIOS, props.style, {borderBottomColor: props.color || pallet.main }]} />
    )
}

const styles = StyleSheet.create({
    inputIOS:{
        width: '80%',
        borderBottomWidth: 2,
        margin: 10,
        padding: 10,
        color:'black',
    },
    inputAndroid:{
        width: '80%',
        margin: 10,
        padding: 10,
        color:'black',
    }
})

export default Input;