import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import * as SQLite from "expo-sqlite";

import AddIcon from 'react-native-vector-icons/Ionicons';
import SearchIcon from 'react-native-vector-icons/AntDesign'
import Checked from 'react-native-vector-icons/FontAwesome';

import TaskList from '../components/TaskList';

import { Dimensions } from 'react-native';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = ({ navigation, props }) => {
    const isFocused = useIsFocused();
    let newDone = []
    const [dataFromDatabase, setDataFromDatabase] = useState([]);
    const [done, setDone] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [searchArray, setSearchArray] = useState([])

    const db = SQLite.openDatabase('taskDB');

    // upon app opening, create db if not exists and load db if exists
    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS taskDB (id INTEGER PRIMARY KEY NOT NULL, taskName TEXT, taskDetail TEXT, taskDone BOOLEAN, taskDueDate TEXT);',
                [],
                () => console.log('TABLE CREATED!'),
                (_, result) => console.log('TABLE CREATE failed:' + result)
            );
        });
        retrieveFromDatabase();
    }, []);

    // reload DB again when focus back to main page. 
    useEffect(() => {
        if (isFocused) {
            retrieveFromDatabase()
        }
    }, [isFocused])

    // load DB Function
    retrieveFromDatabase = () => {
        let entries = []
        db.transaction(
            tx => {
                tx.executeSql("SELECT * FROM taskDB ORDER BY (taskDueDate)",
                    [],
                    (_, { rows }) => {
                        (rows._array).map((row) => entries.push(row)),
                            setDataFromDatabase(entries);
                    },
                    (_, result) => {
                        console.log('SELECT failed!');
                        console.log(result);
                    }
                )
            }
        );
    }

    // Add tasks function
    onTaskDone = (index) => {
        db.transaction(
            tx => {
                tx.executeSql(`UPDATE taskDB SET taskDone = ((taskDone | 1) - (taskDone & 1)) WHERE id = ${index}`,
                    [],
                    (_, result) => {
                        console.log('success')
                    },
                    (_, error) => {
                        console.log('Error executing SQL query:', error);
                    }
                )
            }
        );
        retrieveFromDatabase()
    }

    // Search for tasks based on user search input
    const searchTasks = (searchValue) => {
        let searchResults = []
        dataFromDatabase.map((item) => {
            if (item.taskName.includes(searchValue)) {
                const duplicate = searchResults.find((e) =>
                    e.id === item.id)
                if (duplicate) return;
                searchResults.push(item);
            }

            if (item.taskDetail.includes(searchValue)) {
                const duplicate = searchResults.find((e) =>
                    e.id === item.id)
                if (duplicate) return;
                searchResults.push(item);
            }

            if (item.taskDueDate.includes(searchValue)) {
                const duplicate = searchResults.find((e) =>
                    e.id === item.id)
                if (duplicate) return;
                searchResults.push(item);
            }
        })
        setSearchArray(searchResults);
        setDataFromDatabase(searchResults);
    }

    return (
        <View style={styles.container}>

            <ScrollView
                // search bar
                keyboardDismissMode='true'>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.sesarchBox}
                        value={searchValue}
                        onChangeText={setSearchValue}
                        maxLength={100}
                        cursorColor={'#7E38B7'}
                    >
                    </TextInput>
                    <TouchableOpacity
                        onPress={() => searchTasks(searchValue)}
                        onSubmitEditing={Keyboard.dismiss}>
                        <SearchIcon name='search1' size={30} style={{ color: '#7E38B7' }}></SearchIcon>
                    </TouchableOpacity>
                </View>

                {/* tasks display */}
                <View style={styles.tasksContainer}>
                    {dataFromDatabase.length > 0 ? (
                        <TaskList
                            data={dataFromDatabase}
                            onTaskDone={onTaskDone} />
                    ) : (
                        <Text style={styles.noTasks}>No Tasks to Display</Text>
                    )}
                </View >
            </ScrollView>

            {/* add icon with link to add task page */}
            <TouchableOpacity
                onPress={() => navigation.navigate('Add Task')}
                style={styles.addIcon}>
                <AddIcon name="add-circle-sharp" size={60} color="#7E38B7" />
            </TouchableOpacity>
        </View >
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    tasksContainer: {
        paddingTop: 20,
        paddingHorizontal: 12,
        backgroundColor: '#fafafa',
        minHeight: windowHeight,
    },

    searchContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        backgroundColor: '#E0CDEE',
        paddingVertical: 10,
        paddingHorizontal: 20
    },

    sesarchBox: {
        borderWidth: 0.25,
        width: '90%',
        borderColor: 'lightgrey',
        backgroundColor: 'white',
        height: 40,
        borderRadius: 4
    },

    noTasks: {
        fontSize: 20,
        marginLeft: windowWidth / 5,
        marginTop: 30
    },

    addIcon: {
        position: 'absolute',
        bottom: 25,
        right: 25
    },
})

