import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import * as SQLite from "expo-sqlite";

import AddIcon from 'react-native-vector-icons/Ionicons';
import SearchIcon from 'react-native-vector-icons/AntDesign'
import Checked from 'react-native-vector-icons/FontAwesome';

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


    // const extractDone = () => {
    //     setDone(dataFromDatabase.map((check) => check.taskDone))
    // }
    // Data and DB functions:
    useEffect(() => {

        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS taskDB (id INTEGER PRIMARY KEY NOT NULL, taskName TEXT, taskDetail TEXT, taskDone BOOLEAN, taskDueDate TEXT);',
                [],
                () => console.log('TABLE CREATED!'),
                (_, result) => console.log('TABLE CREATE failed:' + result)
            );
        });
        retrieveFromDatabase();
        // extractDone();

    }, []);

    useEffect(() => {
        if (isFocused) {
            retrieveFromDatabase()
        }

    }, [isFocused, dataFromDatabase])

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
        dataToLoop = dataFromDatabase;
    }

    onTaskDone = (index) => {

        db.transaction(
            tx => {
                tx.executeSql(`UPDATE taskDB SET taskDone = ((taskDone | 1) - (taskDone & 1)) WHERE id = ${index}`,

                    [],
                    (_, result) => {
                        console.log('RESULT: ', result)
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
        console.log('SEARCH RESULTES: ', searchResults)
        setSearchArray(searchResults);
        setDataFromDatabase(searchResults);

        console.log('DATA FROM DATABASE: ', dataFromDatabase)

    }



    return (
        <View style={styles.container}>

            {/* top tasks sections */}
            <ScrollView
                keyboardDismissMode='handled'>
                <View style={{
                    display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center',
                    backgroundColor: 'lightblue',
                    padding: 10
                }}>

                    <TextInput
                        style={{ borderWidth: 0.25, width: '90%', borderColor: 'lightgrey', backgroundColor: 'white', height: 40 }}
                        value={searchValue}
                        onChangeText={setSearchValue}
                        maxLength={100}
                    // onChange={() => { if (searchValue === '') { retrieveFromDatabase() } }}
                    >
                    </TextInput>
                    <TouchableOpacity
                        onPress={() => searchTasks(searchValue)}
                        onSubmitEditing={Keyboard.dismiss}
                    >
                        <SearchIcon name='search1' size={25} style={{ color: '#171717' }}></SearchIcon>
                    </TouchableOpacity>
                </View>
                <View style={styles.tasksContainer}>
                    {(dataFromDatabase.length > 0) && (searchArray.length === 0) ?
                        dataFromDatabase.map((item) => (
                            <View style={styles.tasks}
                                key={item.id}>
                                <View>
                                    <TouchableOpacity
                                        onPress={() => onTaskDone(item.id)}>
                                        <Checked
                                            name={item.taskDone ? 'check-square-o' : 'square-o'}
                                            size={25}
                                            style={{ color: 'grey', paddingTop: 4, width: 25 }} /></TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => navigation.navigate(`Edit Task`, { id: item.id })
                                        }
                                        style={{ width: windowWidth }}
                                    ><Text
                                        style={[item.taskDone ? styles.textLineThrough : styles.normalText]}>{item.taskName}
                                        </Text>
                                        <Text style={{ color: 'grey', fontSize: 12 }}>{item.taskDueDate}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        )) :
                        <Text style={styles.noTasks}>No Tasks to display</Text>}
                </View >
            </ScrollView>
            <TouchableOpacity
                onPress={() => navigation.navigate('Add Task')}
                style={styles.addIcon}
            >
                <AddIcon name="add-circle-sharp" size={60} color="#318CE7" />
            </TouchableOpacity>

        </View >
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    tasksContainer: {
        paddingHorizontal: 12,
        backgroundColor: '#fafafa',
        paddingTop: 15,
        minHeight: windowHeight,
    },

    noTasks: {
        fontSize: 20,
        marginLeft: windowWidth / 5,
        marginTop: 30
    },


    tasks: {
        borderBottomWidth: 0.5,
        borderColor: 'lightgrey',

        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 7,

        borderBottomColor: 'lightgrey',
        padding: 5
    },

    addIcon: {
        position: 'absolute',
        bottom: 25,
        right: 25
    },

    normalText: {
        color: '#171717',
        fontSize: 15
    },

    textLineThrough: {
        textDecorationLine: 'line-through',
        color: '#a9a9a9',
        fontSize: 15
    }
})

