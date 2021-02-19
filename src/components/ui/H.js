import React from 'react';
import { Text, StyleSheet } from 'react-native';

const H = (props) => {
    return (
        <Text {...props} style={[styles.h, props.style]}> {props.children} </Text>
    )
}

const styles = StyleSheet.create({
    h:{
        fontSize: 28,
        fontWeight: 'bold'
    }
})

export default H;