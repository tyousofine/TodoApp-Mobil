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
    const [editedDetail, setEditedDetail] = useState('');
    const [success, setSuccess] = useState(false)

    const db = SQLite.openDatabase('taskDB');

    // function to perform db query for id passed from homeScreen to display task details
    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM taskDB WHERE id = ${id}`,
                [],
                (_, result) => {
                    if (result.rows.length > 0) {
                        const res = result.rows.item(0);
                        setRow(res),
                            setEditedTask(res.taskName),
                            setEditedDate(res.taskDueDate),
                            setEditedDetail(res.taskDetail)

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


    // function to save task changes to db
    const editTask = () => {
        db.transaction((tx) => {
            tx.executeSql("REPLACE INTO taskDB (id, taskName, taskDetail, taskDone, taskDueDate) VALUES (?, ?, ?, 0, ?)",
                [row.id, editedTask, editedDetail, editedDate],
                (_, result) => {
                    setSuccess(true)
                    if (result.rowsAffected > 0) {
                        console.log('updated task')
                    }
                },
                (_, error) => console.log('UPDATE failed:' + error));
        })
        setTimeout(() => setSuccess(false), 2000)
    }


    // delete from db/tasks function with user confirmation prompts
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
                }])
    }


    return (
        <View>
            <View style={styles.deleteContainer}>
                <TouchableOpacity
                    onPress={deleteFromDB}>
                    <DeleteIcon
                        name='delete' size={30} style={{ color: '#CF6DDE', }} />
                </TouchableOpacity>
            </View>

            <View style={styles.taskDetailContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.fieldTitles}>TASK</Text>
                    <TextInput
                        style={styles.titleInput}
                        defaultValue={row.taskName}
                        cursorColor={'#7E38B7'}
                        onChangeText={setEditedTask}
                    />
                </View>

                <View style={styles.dateSection}>
                    <Text style={styles.fieldTitles}>Due Date: </Text>
                    <TextInput
                        defaultValue={!!row.taskDueDate ? row.taskDueDate : 'No due date was set'}
                        onChangeText={setEditedDate}
                    />
                </View>

                <View>
                    <Text style={styles.fieldTitles}>DETAILS</Text>
                    <TextInput
                        style={styles.detailInput}
                        placeholder='Detail'
                        editable
                        multiline={true}
                        numberOfLines={8}
                        cursorColor={'#7E38B7'}
                        textAlignVertical='top'
                        defaultValue={!!row.taskDetail ? row.taskDetail : 'No detail was set'}
                        onChangeText={setEditedDetail}
                    />
                </View>

                <View style={styles.btnsContainer}>
                    <BackIcon
                        name="arrow-left-circle"
                        size={40}
                        style={styles.backIcon}
                        onPress={() => navigation.navigate('Tasks')} />

                    {/* conditional for button change upon update success */}
                    {!success ? (
                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={editTask}>
                            <Text style={styles.saveBtnTxt}>Edit</Text>
                        </TouchableOpacity>
                    ) : (<TouchableOpacity
                        style={[styles.saveBtn, { backgroundColor: '#A679CA' }]}
                        onPress={editTask}>
                        <Text style={styles.saveBtnTxt}>Success</Text>
                    </TouchableOpacity>)}
                </View>
            </View>
        </View>
    )
}

export default TaskDetailScreen;

const styles = StyleSheet.create({
    taskDetailContainer: {
        display: 'flex',
        paddingHorizontal: 18,
        gap: 20,

    },

    deleteContainer: {
        width: '100%',
        alignItems: 'flex-end',
        paddingVertical: 10,
        marginBottom: 10,
        paddingRight: 15,
    },

    fieldTitles: {
        fontWeight: 'bold',
        color: '#7E38B7',
        marginBottom: 5
    },

    titleInput: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        paddingVertical: 4,
        borderRadius: 4,
        paddingHorizontal: 4
    },

    dateSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 4
    },

    detailInput: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        width: '100%',
        padding: 4,
        borderRadius: 4,
        fontSize: 14,

    },

    btnsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    saveBtn: {
        borderRadius: 20,
        color: 'white',
        width: '25%',
        padding: 6,
        backgroundColor: '#7E38B7',
        marginTop: 5,
    },

    saveBtnTxt: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 4,
        fontWeight: 'bold'
    },

    backIcon: {
        color: "#7E38B7",
    }
})