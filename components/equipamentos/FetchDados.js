export const fetchDados = (setData, dbequipment, setFilteredData) => {
    dbequipment.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Equipamentos',
        [],
        (_, { rows }) => {
          setData(rows._array);
          setFilteredData(rows._array);
        },
        error => {
          console.log('Erro ao buscar dados:', error);
        }
      );
    });
};