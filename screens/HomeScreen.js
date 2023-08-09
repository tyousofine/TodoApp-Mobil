import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';


const HomeScreen = ({ navigation }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDetail, setTaskDetail] = useState('');
    const [date, setDate] = useState(new Date(1598051730000));
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(true);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    return (
        <View style={styles.container}>

            {/* top tasks sections */}
            <View style={styles.topTasks}>
                <Button
                    title="View all tasks"
                    onPress={() => navigation.navigate('Tasks List')}>
                </Button>
                <Text>Top Tasks</Text>
                <Text>List of tasks here</Text>
                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Task Detail')}>
                        <Text>An individual task navigating to its screen on click and blab blaba blab</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Add task section */}
            <View style={styles.addTask}>
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
                    <TouchableOpacity style={styles.dateBtn} onPress={showDatepicker} title="Due Date" ><Text style={{ color: 'white' }}>Select Due Date</Text></TouchableOpacity>
                    {show &&
                        <Text style={styles.dateOutput}>{date.toLocaleDateString()}</Text>
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
                    onPress={() => console.log('button clicked')}></Button>
            </View>
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

