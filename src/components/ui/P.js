import React from 'react';
import { Text, StyleSheet } from 'react-native';

const P = props => {
    <Text style={[styles.p, props.style]}> {props.children}</Text>
}

const styles = StyleSheet.create({
    p:{
        backgroundColor: 'transparent'
    }
})

export default P;