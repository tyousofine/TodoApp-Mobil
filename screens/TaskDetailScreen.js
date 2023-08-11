import React, { useState } from 'react';
import { View, Text } from 'react-native';

import * as SQLite from "expo-sqlite";

const TaskDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;

    const db = SQLite.openDatabase('tasksDB');

    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM tasksDB where id = (id)',
            [],
            (_, row) => {
                if (!!row) {
                    console.log('success')
                } else {
                    console.log('No task found');
                }
            }
        );
    });

    return (
        <View>
            <Text>Task title here</Text>
            <Text>Task detail here here</Text>
            <Text>Figure out how to edit tasks?</Text>
            <Text>{id}</Text>

        </View>
    )
}

export default TaskDetailScreen;