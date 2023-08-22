import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import * as SQLite from "expo-sqlite";

import DateIcon from 'react-native-vector-icons/Fontisto';
import BackIcon from 'react-native-vector-icons/Feather';

const AddTaskScreen = ({ navigation }) => {

    const [taskName, setTaskName] = useState('');
    const [taskDetail, setTaskDetail] = useState('');
    const [taskDueDate, setTaskDueDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [forNoDatePicked, setForNoDatePicked] = useState(true);

    const [success, setSuccess] = useState(false)

    const db = SQLite.openDatabase('taskDB');

    // add task to db function
    saveToDatabase = () => {
        // check for empty task name field
        if (taskName === '') {
            alert('Please enter a task')
            return
        }
        // db query
        db.transaction(
            tx => {
                tx.executeSql("INSERT INTO taskDB (taskName, taskDetail, taskDueDate, taskDone) values (?, ?, ?, false)",
                    [taskName, taskDetail, forNoDatePicked ? '' : taskDueDate.toLocaleDateString()],
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            setSuccess(true);
                            setTaskName('');
                            setTaskDetail('');
                            clearDate()
                        }
                        // change button for succcess transaction
                        setTimeout(() => setSuccess(false), 2000)
                    },
                    (_, result) => console.log('INSERT failed:' + result)
                );
            }
        );
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
            display: 'calendar',
        });
    };

    const showDatepicker = () => {
        setTaskDueDate(new Date());
        showMode('date');
        setShow(false);
        setForNoDatePicked(false)
    };

    const clearDate = () => {
        setTaskDueDate(new Date())
        setShow(false);
        setForNoDatePicked(true);
    }


    return (
        < View style={styles.addTaskContainer} >
            <TextInput
                style={styles.titleInput}
                value={taskName}
                onChangeText={setTaskName}
                placeholder='Task'
                maxLength={100}
                textAlignVertical='top'
                cursorColor={'#7E38B7'}
            />

            <View style={styles.dateContainer}>
                <View style={styles.dateOutputFrame}>
                    <Text style={{ color: 'grey' }}>Due Date:
                    </Text>
                    {show &&
                        <TouchableOpacity
                            onPress={clearDate}
                            style={styles.dateOutputBtn}
                        >
                            <Text >{taskDueDate.toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                    }

                </View>
                <TouchableOpacity onPress={(event) => showDatepicker()} title="Due Date" >
                    <DateIcon name='date' size={40} style={styles.dateBtn} />
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.detailInput}
                value={taskDetail}
                onChangeText={setTaskDetail}
                placeholder='Detail'
                editable
                multiline={true}
                numberOfLines={8}
                cursorColor={'#7E38B7'}
                textAlignVertical='top'
            />
            <View style={styles.btnsContainer}>
                <BackIcon
                    name="arrow-left-circle"
                    size={40}
                    style={styles.backIcon}
                    onPress={() => navigation.navigate('Tasks')} />

                {/* Button change conditional for success */}
                {!success ? (
                    <TouchableOpacity
                        TouchableOpacity={0.5}
                        style={styles.saveBtn}
                        onPress={() => saveToDatabase()}>
                        <Text style={styles.saveBtnTxt}>ADD</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        TouchableOpacity={0.5}
                        style={[styles.saveBtn, { backgroundColor: '#A679CA' }]}>
                        <Text style={styles.saveBtnTxt}>Success</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View >
    )
}

export default AddTaskScreen;

const styles = StyleSheet.create({
    addTaskContainer: {
        display: 'flex',
        gap: 10,
        marginTop: 10
    },

    dateContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        marginHorizontal: 20,
    },

    dateBtn: {
        color: '#7E38B7',
    },

    dateOutputFrame: {
        display: 'flex',
        position: 'relative',
        justifyContent: 'space-between',
        borderWidth: 1,
        padding: 4,
        borderRadius: 4,
        borderColor: "lightgrey",
        width: '70%',
        height: 40,
    },

    btnText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    },

    dateOutputBtn: {
        position: 'absolute',
        right: 0,
        top: 5,
    },

    titleInput: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        width: '90%',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 4,
        fontSize: 14

    },

    detailInput: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        width: '90%',
        marginHorizontal: 20,
        borderRadius: 4,
        fontSize: 14,
        paddingHorizontal: 4
    },

    btnsContainer: {

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'

    },

    saveBtn: {
        borderRadius: 20,
        color: 'white',
        width: '25%',
        marginLeft: 'auto',
        marginRight: 20,
        padding: 6,
        backgroundColor: '#7E38B7',
        marginTop: 5
    },

    saveBtnTxt: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 4,
        fontWeight: 'bold'
    },

    backIcon: {
        color: "#7E38B7",
        marginLeft: 20,
    }


})
