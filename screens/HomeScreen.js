import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';


const HomeScreen = ({ navigation }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDetail, setTaskDetail] = useState('');



    return (
        <View style={styles.container}>
            <View style={styles.topTasks}>
                <Button
                    title="View all tasks"
                    onPress={() => navigation.navigate('Tasks List')}>
                </Button>
                <Text>Top Tasks</Text>
                <Text>List of tasks here</Text>
                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Task Detail')}>
                        <Text>An individual task navigating to its screen on click and blab blaba blab</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={styles.addTask}>
                <Text>Add Task</Text>
                <TextInput
                    style={styles.titleInput}
                    value={taskName}
                    onChangeText={setTaskName}
                    placeholder='Task Name'
                    maxLength={40}
                    textAlignVertical='top'
                />
                <TextInput
                    style={styles.detailInput}
                    value={taskDetail}
                    onChangeText={setTaskDetail}
                    placeholder='Task Detail'
                    editable
                    multiline={true}
                    numberOfLines={8}
                    cursorColor={'grey'}
                    textAlignVertical='top'


                />
                <Button
                    title="Add Task"
                    onPress={() => console.log('button clicked')}></Button>
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

    titleInput: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        height: 50,
        width: '90%',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 4
    },

    detailInput: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        height: 200,
        width: '90%',
        marginHorizontal: 20,
        borderRadius: 4

    }

})

