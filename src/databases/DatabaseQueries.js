
import { DatabaseConnection } from "./DatabaseConnection";

const database = DatabaseConnection.getConnectionDatabase();

export const consultReagents = (setData, setFilteredData) => {
    database.transaction(tx => {
      tx.executeSql(
        'SELECT produto.nome, lote.quantidade_geral, lote.unidade_medida, lote.validade, lote.numero, lote.localizacao, lote.quantidade_frascos, lote.quantidade_unitario, lote.id FROM produto JOIN lote ON produto.lote_id = lote.id',
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

export const consultGlasswares = (setData, setFilteredData) => {
  database.transaction(tx => {
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

export const consultEquipments = (setData, setFilteredData) => {
  database.transaction(tx => {
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