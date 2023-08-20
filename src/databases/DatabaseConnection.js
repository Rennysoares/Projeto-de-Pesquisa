import * as SQLite from "expo-sqlite";

//Conexões - banco de dados

export const DatabaseConnection = {
    getConnectionDatabase: () => SQLite.openDatabase("database.db"),
    getConnectionDBReagent: () => SQLite.openDatabase("dbreagent.db"),
    getConnectionDBGlassware: () => SQLite.openDatabase("dbglassware.db"),
    getConnectionDBEquipment: () => SQLite.openDatabase("dbequipment.db"),
};
