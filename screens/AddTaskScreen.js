import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as SQLite from "expo-sqlite";

import DateIcon from 'react-native-vector-icons/Fontisto';
import BackIcon from 'react-native-vector-icons/Feather';
import SaveIcon from 'react-native-vector-icons/Entypo'



const AddTaskScreen = ({ navigation }) => {

    const [taskName, setTaskName] = useState('');
    const [taskDetail, setTaskDetail] = useState('');
    const [taskDueDate, setTaskDueDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const [success, setSuccess] = useState(false)

    const db = SQLite.openDatabase('taskDB');

    saveToDatabase = () => {

        if (taskName === '') {
            alert('Please enter a task')
            return
        }

        console.log('SAVE TO DB CALLED')
        db.transaction(
            tx => {
                tx.executeSql("INSERT INTO taskDB (taskName, taskDetail, taskDone) values (?, ?, 'false')",
                    [taskName, taskDetail],
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            console.log('ROW INSERTED!')
                            setSuccess(true);
                            setTaskName('');
                            setTaskDetail('');
                            clearDate()

                        }
                        else { console.log('INSERT FAILED!') }
                    },
                    (_, result) => console.log('INSERT failed:' + result)
                );
            }
        );


        setTimeout(() => setSuccess(false), 2000)
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
            display: 'calendar',


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
        < View style={styles.addTaskContainer} >
            <TextInput
                style={styles.titleInput}
                value={taskName}
                onChangeText={setTaskName}
                placeholder='Task'
                maxLength={40}
                textAlignVertical='top'
            />

            <View style={styles.dateContainer}>
                <TouchableOpacity onPress={(event) => showDatepicker()} title="Due Date" >
                    <DateIcon name='date' size={40} style={styles.dateBtn} />
                    <Text style={{ fontSize: 7, color: '#318CE7' }}>Calendar</Text>
                </TouchableOpacity>
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
            </View>

            <TextInput
                style={styles.detailInput}
                value={taskDetail}
                onChangeText={setTaskDetail}
                placeholder='Detail'
                editable
                multiline={true}
                numberOfLines={8}
                cursorColor={'grey'}
                textAlignVertical='top'
            />
            <View style={styles.btnsContainer}>
                <BackIcon
                    name="arrow-left-circle"
                    size={40}
                    style={styles.backIcon}
                    onPress={() => navigation.navigate('Tasks')} />


                {!success ? (
                    <TouchableOpacity
                        TouchableOpacity={0.5}
                        style={[styles.saveBtn, { backgroundColor: '#318CE7' }]}
                        onPress={() => saveToDatabase()}>
                        <Text style={styles.saveBtnTxt}>ADD</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        TouchableOpacity={0.5}
                        style={[styles.saveBtn, { backgroundColor: 'green' }]}>
                        <Text style={styles.saveBtnTxt}>SUCCESS!</Text>
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
        color: '#318CE7',
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
        paddingVertical: 6
    },

    detailInput: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        width: '90%',
        marginHorizontal: 20,
        borderRadius: 4

    },

    btnsContainer: {

        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row'

    },

    saveBtn: {
        // backgroundColor: "#318CE7",
        color: 'white',
        width: '25%',
        marginLeft: 'auto',
        marginRight: 20,
        padding: 6,
        borderRadius: 4,
        marginTop: 5
    },

    saveBtnTxt: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 4,
        fontWeight: 'bold'
    },

    backIcon: {
        color: "#318CE7",
        marginLeft: 20,
    }


})
