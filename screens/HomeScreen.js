import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

import * as SQLite from "expo-sqlite";

import AddIcon from 'react-native-vector-icons/Ionicons';

import Checked from 'react-native-vector-icons/FontAwesome';

import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = ({ navigation, props }) => {
    let newDone = []
    const [dataFromDatabase, setDataFromDatabase] = useState([]);
    const [done, setDone] = useState([])

    const db = SQLite.openDatabase('taskDB');


    // Data and DB functions:
    useEffect(() => {
        retrieveFromDatabase();
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS taskDB (id INTEGER PRIMARY KEY NOT NULL, taskName TEXT, taskDetail TEXT, taskDone BOOLEAN, taskDueDate TEXT);',
                [],
                () => console.log('TABLE CREATED!'),
                (_, result) => console.log('TABLE CREATE failed:' + result)
            );
        });
        setDone(dataFromDatabase.map((check) => check.taskDone))

    }, []);

    let entries = []
    retrieveFromDatabase = () => {

        db.transaction(
            tx => {
                tx.executeSql("SELECT * FROM taskDB ORDER BY (taskDueDate)",
                    [],
                    (_, { rows }) => {
                        (rows._array).map((row) => entries.push(row)),

                            setDataFromDatabase(entries)

                    },
                    (_, result) => {
                        console.log('SELECT failed!');
                        console.log(result);
                    }
                )
            }
        );

    }

    onTaskDone = (index) => {
        let newArray = [...done];
        newArray[index] = !newArray[index];
        setDone(newArray)

    }

    return (
        <View style={styles.container}>

            {/* top tasks sections */}
            <ScrollView>

                <View style={styles.tasksContainer}>
                    {dataFromDatabase.length > 0 ?
                        dataFromDatabase.map((item) => (
                            <View style={styles.topTasks}
                                key={item.id}>
                                <View>
                                    <TouchableOpacity
                                        onPress={() => onTaskDone(item.id)}>
                                        <Checked
                                            name={done[item.id] ? 'check-square-o' : 'square-o'}
                                            size={25}
                                            style={{ color: 'grey', paddingTop: 4, width: 25 }} /></TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => navigation.navigate(`Task Detail`, { id: item.id })
                                        }
                                        style={{ width: windowWidth }}
                                    ><Text
                                        style={[done[item.id] ? styles.textLineThrough : styles.normalText]}>{item.taskName}
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
        backgroundColor: '#fafafa',
        paddingTop: 15,
        minHeight: windowHeight,

    },

    noTasks: {
        fontSize: 20,
        marginLeft: windowWidth / 5,
        marginTop: 30
    },


    topTasks: {
        borderWidth: 0.5,
        borderColor: 'lightgrey',

        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 7,
        marginHorizontal: 10,
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

