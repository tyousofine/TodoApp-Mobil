import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native';


const TaskList = () => {
    return (
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
    )

}

export default TaskList;