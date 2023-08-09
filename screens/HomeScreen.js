import React from 'react';
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';


const HomeScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <View style={styles.topTasks}>
                <Button
                    title="View all tasks"
                    onPress={() => navigation.navigate('Tasks List')}></Button>
                <Text>Top Tasks</Text>
                <Text>List of tasks here</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Task Detail')}>
                    <Text>An individual task navigating to its screen on click</Text>
                </TouchableOpacity>

            </View>
            <View style={styles.addTask}>
                <Text>Add Task</Text>
                <TextInput>task name input here</TextInput>
                <TextInput>task detail input here</TextInput>
                <Button
                    title="Add Task"></Button>
            </View>
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    topTasks: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },

    addTask: {
        flex: 1,
    },

})

