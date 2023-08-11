import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as SQLite from "expo-sqlite";


const AddTaskScreen = () => {

    const [taskName, setTaskName] = useState('');
    const [taskDetail, setTaskDetail] = useState('');
    const [taskDueDate, setTaskDueDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const db = SQLite.openDatabase('tasksDB');

    saveToDatabase = () => {
        console.log('SAVE TO DB CALLED')
        db.transaction(
            tx => {
                tx.executeSql("INSERT INTO tasksDB (taskName, taskDetail) values (?, ?)",
                    [taskName, taskDetail],
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            console.log('ROW INSERTED!')
                        }
                        else { console.log('INSERT FAILED!') }
                    },
                    (_, result) => console.log('INSERT failed:' + result)
                );
            }
        );
        retrieveFromDatabase()
    }

    // Date picker functions
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(true);
        setTaskDueDate(currentDate);
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: taskDueDate,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        setTaskDueDate(new Date());
        showMode('date');
        setShow(false);
    };

    const clearDate = () => {
        setTaskDueDate(new Date())
        setShow(false);
    }
    return (
        < View style={styles.addTask} >
            <Text>Add Task</Text>
            <TextInput
                style={styles.titleInput}
                value={taskName}
                onChangeText={setTaskName}
                placeholder='Task Name'
                maxLength={40}
                textAlignVertical='top'
            />

            <View style={styles.dateContainer}>
                <TouchableOpacity style={styles.dateBtn} onPress={(event) => showDatepicker()} title="Due Date" ><Text style={{ color: 'white' }}>Select Due Date</Text></TouchableOpacity>
                {show &&
                    <TouchableOpacity
                        onPress={clearDate}
                        style={styles.dateOutput}
                    >
                        <Text >{taskDueDate.toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>
                }
            </View>

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
                onPress={() => saveToDatabase()}>
            </Button>
        </View >
    )
}

export default AddTaskScreen;

const styles = StyleSheet.create({
    addTask: {
        flex: 1,
    },

    dateContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 10,
        marginHorizontal: 20,
    },

    dateBtn: {
        width: '40%',
        backgroundColor: 'blue',
    },

    dateOutput: {
        backgroundColor: 'yellow',
        width: '40%'
    },

    titleInput: {
        borderWidth: 1,
        borderColor: 'lightgrey',

        width: '90%',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 4
    },

    detailInput: {
        borderWidth: 1,
        borderColor: 'lightgrey',

        width: '90%',
        marginHorizontal: 20,
        borderRadius: 4

    }

})
