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
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalEdit, setModalEdit] = useState(false)

  const handleShowModal = (iditem) =>{
    setModalVisible2(true)
    setSelectedItem(iditem)
  }
  const handleShowModalEdit = () =>{
    setModalEdit(true)
  }
  const deleteItem = (iditem) =>{
    dbglassware.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Capacidades WHERE id = ?',
        [iditem],
        () => {
          console.log('Item deletado com sucesso!');
        },
        error => {
          console.log('Erro ao deletar item:', error);
        }
      );
    });

    fetchDados(setData, dbglassware, setFilteredData);
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
        <Text style={styles.itemQuantidade}>{item.capacidade}</Text>
        <Text style={styles.itemQuantidade}>{`Quantidade: ${item.quantidade}`} unidades</Text>
        <Text style={styles.itemDescricao}>{item.descricao}</Text>
      </View>

      <View style={{flexDirection: 'row', gap: 10}}>
        <TouchableOpacity onPress={()=>{handleShowModalEdit()}}>
          <Feather name='edit' size={37} color={'rgb(0, 0, 0)'}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{handleShowModal(item)}}>
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
        <View style={{height: '93%' }}>
        <FlatList
          data={filteredData}
          renderItem={renderVidrariaItem}
          keyExtractor={(_, item) => item.toString()}
        />
        </View>
        <Modal
          visible={modalVisible2}
          transparent={true}
          animationType="fade"
        >
        <View style={styles.centermodal}>
          <View style={styles.modal2}>
            <Text style={{textAlign: 'center'}}>Tem certeza?</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity
                onPress={()=>{deleteItem(selectedItem.idcapacidades); setModalVisible2(false)}}
              >
                <View style={[styles.buttonmodal, {backgroundColor: 'rgb(0, 255, 0 )'}]}>
                <Text>Sim</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={()=>{setModalVisible2(false);}}
              >
                <View style={[styles.buttonmodal, {backgroundColor: 'rgb(255, 0, 0 )'}]}>
                <Text>Não</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>  
        </View>
        </Modal>
        <Modal
          visible={modalEdit}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.centermodal}>
          <View style={styles.modal2}>
            <Text>Teste</Text>
            <TouchableOpacity onPress={() => {setModalEdit(false)}} style={{position: 'absolute', top: 0, right: 0, padding: 5}}>
                <Ionicons name='close' size={30} color={'rgb(0, 0, 0)'}/>
            </TouchableOpacity>
          </View>
          </View>
        </Modal>
        <TouchableOpacity
        style={{position: 'absolute', bottom: 0, right: 0, padding: 25}}
        onPress={()=>{navigation.navigate('CadastroVidrarias')}}
          >
          <AntDesign name="pluscircle" size={65} color={'rgb(0, 200, 0)'}/>
        </TouchableOpacity>
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
    fontSize: 14,
  },
  itemQuantidade: {
    fontSize: 14,
  },
  itemCapacidade: {
    fontSize: 14,
  },
  centermodal:{
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  modal2:{
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 20,
    height: '25%',
    width: '75%',
    borderRadius: 15,
    rowGap: 5,
    justifyContent: 'space-around'
  },
  buttonmodal:{
    borderRadius: 10,
    height: 40,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

