import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

import * as SQLite from "expo-sqlite";

import DeleteIcon from 'react-native-vector-icons/AntDesign';


const TaskDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [row, setRow] = useState([])

    const db = SQLite.openDatabase('taskDB');

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM taskDB WHERE id = ${id}`,
                [],
                (_, result) => {
                    if (result.rows.length > 0) {
                        const res = result.rows.item(0);
                        setRow(res)
                        console.log('success')
                    } else {
                        console.log('No task found');
                    }

                },
                (_, error) => {
                    console.log('Error executing SQL query:', error);
                }
            );
        });

    }, []);


    return (
        <View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>Task:</Text>
                <TouchableOpacity>
                    <DeleteIcon name='delete' size={30} style={{ color: 'red' }} />
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.titleInput}
                defaultValue={row.taskName}
            // onChangeText={setTaskName}

            />

            <TextInput
                defaultValue={row.taskDueDate}


            />
            <TextInput
                defaultValue={row.taskDetail}


            />

            <Text>task id: {id} Task name: {row.taskName}</Text>

        </View>
    )
}

export default TaskDetailScreen;

const styles = StyleSheet.create({
    titleInput: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        width: '90%',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 4,
        paddingVertical: 6
    },

})