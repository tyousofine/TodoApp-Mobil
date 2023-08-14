import React from 'react'

const DateInputComponent = () => {
    const [taskDueDate, setTaskDueDate] = useState(new Date());
    const [show, setShow] = useState(false);

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
            <TouchableOpacity onPress={(event) => showDatepicker()} title="Due Date" style={{}} >
                <DateIcon name='date' size={40} style={styles.dateBtn} />

            </TouchableOpacity>
        </View>

    )
}

export default DateInputComponent;