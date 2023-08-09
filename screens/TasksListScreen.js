import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TasksListScreen = ({ navigation }) => {
    return (
        <View>
            <Text>
                This is tasks list screen
            </Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('Task Detail')}
            >
                <Text>Individual task here</Text>
            </TouchableOpacity>
        </View>
    )
}

export default TasksListScreen;