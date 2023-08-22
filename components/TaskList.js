import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import TaskDetailScreen from '../screens/TaskDetailScreen';

import { useNavigation } from '@react-navigation/native';

import Checked from 'react-native-vector-icons/FontAwesome';


import { Dimensions } from 'react-native';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const TaskList = (props) => {
    const [tasks, setTasks] = useState(props.data);
    const navigation = useNavigation()

    useEffect(() => {

        setTasks(props.data);
    }, [props.data]);





    const onTaskDone = (id) => {
        props.onTaskDone(id)

    }

    return (
        tasks?.map((item) => (

            <View style={styles.tasks}
                key={item.id}>
                <View>
                    <TouchableOpacity
                        onPress={() => onTaskDone(item.id)}>
                        <Checked
                            name={item.taskDone ? 'check-square-o' : 'square-o'}
                            size={25}
                            style={{ color: 'grey', paddingTop: 4, width: 25 }} />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => navigation.navigate('Edit Task', { id: item.id })
                        }
                        style={{ width: windowWidth }}
                    ><Text
                        style={[item.taskDone ? styles.textLineThrough : styles.normalText]}>{item.taskName}
                        </Text>
                        <Text style={{ color: 'grey', fontSize: 12 }}>{item.taskDueDate}</Text>
                    </TouchableOpacity>
                </View>

            </View>

        ))
    )
}

export default TaskList;


const styles = StyleSheet.create({

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
