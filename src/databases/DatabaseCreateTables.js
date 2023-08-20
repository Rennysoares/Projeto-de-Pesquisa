import { DatabaseConnection } from "./DatabaseConnection";

const database = DatabaseConnection.getConnectionDatabase();

export const createTableReagents = () => {
  database.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS lote (id INTEGER PRIMARY KEY AUTOINCREMENT, numero TEXT, validade TEXT, quantidade_geral REAL, unidade_medida TEXT, localizacao TEXT, quantidade_frascos INTEGER, quantidade_unitario REAL)',
        [],
        () => {
          console.log('tabela lote criada com sucesso ou verificada se existe');
        },
        error => {
          console.log('Erro ao criar tabela produto:', error);
        }
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS produto (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, lote_id INTEGER, FOREIGN KEY (lote_id) REFERENCES lote (id))',
        [],
        () => {
          console.log('tabela produto criada com sucesso ou verificada se existe');
        },
        error => {
          console.log('Erro ao criar tabela lote:', error);
        }
      );
    });
  };

 export const createTableEquipments = () => {
    database.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Equipamentos ( id INTEGER PRIMARY KEY AUTOINCREMENT,nome TEXT NOT NULL, quantidade INTEGER NOT NULL, validade TEXT, localizacao TEXT)',
        [],
        () => {
          console.log('tabela Equipamentos criada com sucesso ou verificada se existe');
        },
        error => {
          console.log('Erro ao criar tabela produto:', error);
        }
      );
    });
};

export const createTableGlasswares = () => {
  database.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS Vidrarias ( id INTEGER PRIMARY KEY AUTOINCREMENT,nome TEXT NOT NULL,descricao TEXT, quantidade INTEGER NOT NULL)',
      [],
      () => {
        console.log('tabela Vidrarias criada com sucesso ou verificada se existe');
      },
      error => {
        console.log('Erro ao criar tabela produto:', error);
      }
    );

    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS Capacidades (id INTEGER PRIMARY KEY AUTOINCREMENT,vidraria_id INTEGER NOT NULL,capacidade TEXT NOT NULL,quantidade INTEGER NOT NULL,FOREIGN KEY (vidraria_id) REFERENCES Vidrarias(id));',
      [],
      () => {
        console.log('tabela produto criada com sucesso ou verificada se existe');
      },
      error => {
        console.log('Erro ao criar tabela lote:', error);
      }
    );
  });
};

