import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// TaskBar component tarkoitettu Androidille, koska iOS:ssä on oma alapalkki ja se näyttää paremmalta

const TaskBar = ({darkMode}) => {
    return (
        <View style={[styles.container, { backgroundColor: darkMode ? '#333' : '#6200EE' }]}>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 32.5,
        backgroundColor: '#6200EE',

    },
    text: {
        color: '#FFFFFF',
        fontSize: 18,
    },
});
export default TaskBar;