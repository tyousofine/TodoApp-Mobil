import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import * as SQLite from "expo-sqlite";



const HomeScreen = ({ navigation, props }) => {

    const [dataForDatabase, setDataForDatabase] = useState({});
    const [dataFromDatabase, setDataFromDatabase] = useState([]);

    const db = SQLite.openDatabase('tasksDB');


    // Data and DB functions:
    useEffect(() => {
        retrieveFromDatabase();
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS tasksDB (id INTEGER PRIMARY KEY NOT NULL, taskName TEXT, taskDetail TEXT);',
                [],
                () => console.log('TABLE CREATED!'),
                (_, result) => console.log('TABLE CREATE failed:' + result)
            );
        });

    }, []);



    let entries = []
    retrieveFromDatabase = () => {
        // clear data currently stored

        console.log('RETREIVE FROM DB CALLED!')
        db.transaction(
            tx => {
                tx.executeSql("SELECT * FROM tasksDB",
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

    return (
        <View style={styles.container}>

            {/* top tasks sections */}
            <View style={styles.topTasks}>
                <Text>Top Tasks</Text>
                <View style={{}}>
                    {dataFromDatabase.length > 0 ?
                        dataFromDatabase.map((item) => (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    style={{ borderWidth: 1, width: '60%' }}
                                    key={item.id}
                                    onPress={() => navigation.navigate(`Task Detail`, { id: item.id })}
                                >
                                    <Text>{item.taskName}</Text>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', gap: 15 }}>
                                    <TouchableOpacity><Text>Complete</Text></TouchableOpacity>
                                    <TouchableOpacity><Text>Delete</Text></TouchableOpacity>
                                </View>
                            </View>

                        )) :
                        <Text>You have no tasks!</Text>}
                </View>


            </View >

            <Button
                onPress={() => navigation.navigate('Add Task')}
                title='Add Task'></Button>

        </View >
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    topTasks: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },



})

