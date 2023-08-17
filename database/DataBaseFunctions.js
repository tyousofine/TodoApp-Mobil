


export const retrieveFromDatabase = () => {
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

