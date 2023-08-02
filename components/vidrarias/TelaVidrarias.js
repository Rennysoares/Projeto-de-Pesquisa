import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Button, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatabaseConnection } from '../../src/databases/DatabaseConnection';
import { TextInput } from 'react-native-gesture-handler';
import { AntDesign, Ionicons, Feather } from 'react-native-vector-icons';

import { fetchDados } from './FetchDados';
const dbglassware = DatabaseConnection.getConnectionDBGlassware();

const TelaVidrarias = ({ navigation }) => {
  const [isDatabaseReady, setDatabaseReady] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const deleteItem = (iditem) =>{
    console.log(iditem)
  }
  const handleSearch = (text) => {
    const filteredItems = data.filter((item) => {
      return item.nome.toLowerCase().includes(text.toLowerCase());
    });
    setFilteredData(filteredItems);
    //setando o array secundário para a flatlist
  };
  useEffect(() => {
    const createTables = () => {
      let firstTableCreated = false;
      let secondTableCreated = false;

      dbglassware.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Vidrarias ( id INTEGER PRIMARY KEY AUTOINCREMENT,nome TEXT NOT NULL,descricao TEXT, quantidade INTEGER NOT NULL)',
          [],
          () => {
            console.log('tabela Vidrarias criada com sucesso ou verificada se existe');
            firstTableCreated = true;
            if (firstTableCreated && secondTableCreated) {
              setDatabaseReady(true);
              fetchDados(setData, dbglassware, setFilteredData);
            }
          },
          error => {
            console.log('Erro ao criar tabela produto:', error);
          }
        );

        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Capacidades (id INTEGER PRIMARY KEY AUTOINCREMENT,vidraria_id INTEGER NOT NULL,capacidade REAL NOT NULL,quantidade INTEGER NOT NULL,FOREIGN KEY (vidraria_id) REFERENCES Vidrarias(id));',
          [],
          () => {
            console.log('tabela produto criada com sucesso ou verificada se existe');
            secondTableCreated = true;
            if (firstTableCreated && secondTableCreated) {
              setDatabaseReady(true);
              fetchDados(setData, dbglassware, setFilteredData);
            }
          },
          error => {
            console.log('Erro ao criar tabela lote:', error);
          }
        );
      });
    };

    createTables();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('A tela principal foi ativada');
      fetchDados(setData, dbglassware, setFilteredData);
    });

    
    unsubscribe;
  }, [navigation]);

  const renderVidrariaItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemDescricao}>{item.descricao}</Text>
        <Text style={styles.itemQuantidade}>{`Quantidade: ${item.quantidade}`}</Text>
        <Text style={styles.itemQuantidade}>{item.capacidade}</Text>
      </View>

      <View>
        <TouchableOpacity onPress={()=>{deleteItem(item.idcapacidades)}}>
          <AntDesign name='delete' size={37} color={'rgb(240, 10, 10)'}/>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View>
      <TextInput
          placeholder="Pesquise aqui"
          placeholderTextColor='rgb(200, 200, 200)'
          onChangeText={handleSearch}
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            margin: 4,
            padding:10
          }}
        />
        <FlatList
          data={filteredData}
          renderItem={renderVidrariaItem}
          keyExtractor={(_, item) => item.toString()}
        />
    </View>
  );
};

export default TelaVidrarias;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    borderRadius: 10,
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  itemNome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescricao: {
    fontSize: 16,
  },
  itemQuantidade: {
    fontSize: 14,
  },
  itemCapacidade: {
    fontSize: 14,
  },
});

