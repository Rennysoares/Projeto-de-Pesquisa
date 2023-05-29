import * as SQLite from "expo-sqlite";

//Conexão ao banco de dados

export const DatabaseConnection = {
    getConnectionDBReagent: () => SQLite.openDatabase("dbreagent.db"),
    getConnectionDBGlassware: () => SQLite.openDatabase("dbglassware.db"),
    getConnectionDBEquipment: () => SQLite.openDatabase("dbequipment.db"),
};
