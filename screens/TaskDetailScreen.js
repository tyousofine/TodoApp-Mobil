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
            <Text>Task edit and detail comming soon!</Text>

            <Text>task id: {id}</Text>

        </View>
    )
}

export default TaskDetailScreen;