import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

import * as SQLite from "expo-sqlite";

import AddIcon from 'react-native-vector-icons/Ionicons';

import Checked from 'react-native-vector-icons/FontAwesome';




const HomeScreen = ({ navigation, props }) => {
    let newDone = []
    const [dataFromDatabase, setDataFromDatabase] = useState([]);
    const [done, setDone] = useState([])
    console.log('done STATE REPORT: ', done)



    const db = SQLite.openDatabase('taskDB');


    // Data and DB functions:
    useEffect(() => {
        retrieveFromDatabase();
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS taskDB (id INTEGER PRIMARY KEY NOT NULL, taskName TEXT, taskDetail TEXT, taskDone BOOLEAN);',
                [],
                () => console.log('TABLE CREATED!'),
                (_, result) => console.log('TABLE CREATE failed:' + result)
            );
        });
        setDone(dataFromDatabase.map((check) => check.taskDone))

    }, []);

    let entries = []
    retrieveFromDatabase = () => {
        // clear data currently stored

        console.log('RETREIVE FROM DB CALLED!')
        db.transaction(
            tx => {
                tx.executeSql("SELECT * FROM taskDB",
                    [],
                    (_, { rows }) => {
                        (rows._array).map((row) => entries.push(row)),
                            console.log(entries),
                            setDataFromDatabase(entries)

                    },
                    (_, result) => {
                        console.log('SELECT failed!');
                        console.log(result);
                    }
                )
            }
        );
        console.log('DATA FROM DB AFTER RETRIVE: ', dataFromDatabase)
    }

    onTaskDone = (index) => {
        let newArray = [...done];
        newArray[index] = !newArray[index];
        setDone(newArray)
        console.log(done)
    }

    return (
        <View style={styles.container}>

            {/* top tasks sections */}
            <ScrollView>
                <View style={styles.topTasks}>
                    <Text>Top Tasks</Text>
                    <View style={{}}>
                        {dataFromDatabase.length > 0 ?
                            dataFromDatabase.map((item) => (
                                <View style={{ flexDirection: 'row', gap: 10 }}
                                    key={item.id}>
                                    <TouchableOpacity
                                        onPress={() => onTaskDone(item.id)}>
                                        <Checked
                                            name={done[item.id] ? 'check-square-o' : 'square-o'}
                                            size={25}
                                            style={[done[item.id] ? styles.textLineThrough : styles.normalText]} /></TouchableOpacity>
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => navigation.navigate(`Task Detail`, { id: item.id })}
                                    ><Text
                                        style={[done[item.id] ? styles.textLineThrough : styles.normalText]}>{item.taskName}</Text>
                                    </TouchableOpacity>
                                </View>

                            )) :
                            <Text>You have no tasks!</Text>}
                    </View>
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

    addIcon: {
        position: 'absolute',
        bottom: 25,
        right: 25
    },

    normalText: {
    },

    textLineThrough: {
        textDecorationLine: 'line-through',
        color: '#a9a9a9'
    }
})

