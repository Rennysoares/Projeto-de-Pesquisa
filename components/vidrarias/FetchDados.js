export const fetchDados = (setData, dbglassware, setFilteredData) => {
    dbglassware.transaction(tx => {
      tx.executeSql(
        'SELECT Vidrarias.id as idvidrarias, Capacidades.id as idcapacidades, Vidrarias.nome, Vidrarias.descricao, Vidrarias.quantidade, Capacidades.vidraria_id, Capacidades.capacidade, Capacidades.quantidade FROM Vidrarias JOIN Capacidades ON Vidrarias.id = Capacidades.vidraria_id',
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