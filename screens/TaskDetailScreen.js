import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';


import * as SQLite from "expo-sqlite";

import DeleteIcon from 'react-native-vector-icons/AntDesign';
import BackIcon from 'react-native-vector-icons/Feather';


const TaskDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [row, setRow] = useState([]);
    const [editedTask, setEditedTask] = useState('');
    const [editedDate, setEditedDate] = useState('');
    const [editedDetail, setEditedDetail] = useState('')


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

    const editTaskInDB = () => {
        db.transaction((tx) => {
            tx.executeSql(`REPLACE INTO taskDB (id, taskName, taskDetail, taskDone, taskDueDate) VALUES (?, ?, ?, 0, ?)`,
                [row.id, editedTask, editedDetail, editedDate],
                [],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        console.log(" update success!")
                    }

                },
                (_, error) => console.log('UPDATE failed:' + error))
        })

    }

    const deleteFromDB = () => {
        Alert.alert(
            'DELETE TASK', 'Are you sure?',
            [
                {
                    text: 'CANCEL',
                    style: 'cancel'
                },
                {
                    text: 'DELETE',
                    onPress: () => db.transaction((tx) => {
                        tx.executeSql(
                            `DELETE FROM taskDB WHERE id = ${row.id}`,
                            [],
                            (tx, results) => {
                                console.log('Results', results.rowsAffected);
                                if (results.rowsAffected > 0) {
                                    Alert.alert(
                                        'SUCCESS',
                                        'Task has been deleted',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => navigation.navigate('Tasks')
                                            }
                                        ]
                                    );
                                } else {
                                    alert('Please insert a valid User Id');
                                }
                            }
                        )
                    })
                }

            ])

    }


    return (
        <View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>Task:</Text>
                <TouchableOpacity
                    onPress={deleteFromDB}>
                    <DeleteIcon
                        name='delete' size={30} style={{ color: 'red' }} />
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.titleInput}
                defaultValue={row.taskName}
                onChangeText={setEditedTask}

            />

            <TextInput
                defaultValue={!!row.taskDueDate ? row.taskDueDate : 'No due date was set'}
                onChangeText={setEditedDate}


            />
            <TextInput
                defaultValue={!!row.taskDetail ? row.taskDetail : 'No detail was set'}
                onChangeText={setEditedDetail}
            />



            <BackIcon
                name="arrow-left-circle"
                size={40}
                style={styles.backIcon}
                onPress={() => navigation.navigate('Tasks')} />

            <TouchableOpacity
                onPress={editTaskInDB}>
                <Text>Save Changes</Text>
            </TouchableOpacity>
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