import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Button, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatabaseConnection } from '../../src/databases/DatabaseConnection';
import { fetchDados } from './FetchDados';
import { TextInput } from 'react-native-gesture-handler';

const dbreagent = DatabaseConnection.getConnectionDBReagent();

const TelaReagentes = ({ navigation }) => {
  
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDatabaseReady, setDatabaseReady] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible2, setModalVisible2] = useState(false);

  const handleSearch = (text) => {
    const filteredItems = data.filter((item) => {
      return item.nome.toLowerCase().includes(text.toLowerCase());
    });
    setFilteredData(filteredItems);
    //setando o array secundário para a flatlist
  };
  

  const handleShowModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };
  
  const deleteItem = (itemId) => {
    dbreagent.transaction(tx => {
      tx.executeSql(
        'DELETE FROM produto WHERE id = ?',
        [itemId],
        () => {
          console.log('Item deletado com sucesso!');
        },
        error => {
          console.log('Erro ao deletar item:', error);
        }
      );
    });

    dbreagent.transaction(tx => {
      tx.executeSql(
        'DELETE FROM lote WHERE id = ?',
        [itemId],
        () => {
          console.log('Item deletado com sucesso!');
        },
        error => {
          console.log('Erro ao deletar item:', error);
        }
      );
    });
    setModalVisible2(false)
    setModalVisible(false)
    fetchDados(setData, dbreagent, setFilteredData);    
  };

  useEffect(() => {
    const createTables = () => {
      let firstTableCreated = false;
      let secondTableCreated = false;

      dbreagent.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS lote (id INTEGER PRIMARY KEY AUTOINCREMENT, numero TEXT, validade TEXT, quantidade_geral REAL, unidade_medida TEXT, localizacao TEXT, quantidade_frascos, quantidade_unitario)',
          [],
          () => {
            console.log('tabela lote criada com sucesso ou verificada se existe');
            firstTableCreated = true;
            if (firstTableCreated && secondTableCreated) {
              setDatabaseReady(true);
              fetchDados(setData, dbreagent, setFilteredData);
            }
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
            secondTableCreated = true;
            if (firstTableCreated && secondTableCreated) {
              setDatabaseReady(true);
              fetchDados(setData, dbreagent, setFilteredData);
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
      fetchDados(setData, dbreagent, setFilteredData);
    });

    
    unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      
      <View>
        <Text>Reagente: {item.nome}</Text>
        <Text>Quantidade Geral: {item.quantidade_geral + item.unidade_medida}</Text>
        <Text>Validade: {item.validade}</Text>
      </View>
      <View>
        <TouchableOpacity 
          onPress={() => handleShowModal(item)}
          >
          <Image
          source={require('../../assets/iconmore.png')}
          style={{height: 50, width: 50}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View>
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
        <View style={{height: '90%' }}>
        <FlatList
          data={filteredData}
          extraData={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
        </View>
      </View>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
        <View style={styles.centermodal}>
          <View style={styles.modal}>
            <View style={{
              rowGap: 7
            }}>
              <Text>Reagente: {selectedItem?.nome}</Text>
              <Text>Lote: {selectedItem?.numero}</Text>
              <Text>Quantidade de Frascos: {selectedItem?.quantidade_frascos}</Text>
              <Text>Quantidade de cada Frasco: {selectedItem?.quantidade_unitario}</Text>
              <Text>Quantidade Total: {selectedItem?.quantidade_geral + selectedItem?.unidade_medida}</Text>
              <Text>Validade: {selectedItem?.validade}</Text>
              <Text>Localização: {selectedItem?.localizacao}</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
              <TouchableOpacity
              onPress={()=>{setModalVisible(false);navigation.navigate('EditarReagentes', {selectedItem})}}
              >
                <View style={[styles.buttonmodal, {backgroundColor: 'rgb(255, 255, 0)'}]}>
                  {/*<Image
                    source={require('../../assets/iconedit.png')}
                    style={{
                      height: 70,
                      width: 70
                    }}
                  />*/}
                  <Text style={styles.txtbuttonmodal} >Editar</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{setModalVisible2(true); setModalVisible(false)}}>
                <View style={[styles.buttonmodal, {backgroundColor: 'rgb(255, 0, 0)'}]}>
                {/*<Image
                    source={require('../../assets/icondelete.png')}
                    style={{
                      height: 70,
                      width: 70
                    }}
                  />*/}
                  <Text style={styles.txtbuttonmodal}>Apagar</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => {setModalVisible(false)}} style={{position: 'absolute', top: -9, right: 7, padding: 5}}>
                <Text style={{fontSize: 30}}>x</Text>
            </TouchableOpacity>
          </View>
        </View>
        </Modal>
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
                onPress={()=>{deleteItem(selectedItem.id)}}
              >
                <View style={[styles.buttonmodal, {backgroundColor: 'rgb(0, 255, 0 )'}]}>
                <Text>Sim</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={()=>{setModalVisible2(false), setModalVisible(true)}}
              >
                <View style={[styles.buttonmodal, {backgroundColor: 'rgb(255, 0, 0 )'}]}>
                <Text>Não</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>  
        </View>
        </Modal>
    </View>
  );
};

export default TelaReagentes;


const styles = StyleSheet.create({
  item: {
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
  title: {
    fontSize: 15,
  },
  headerReagentes:{
    backgroundColor: 'rgb(255, 255, 255)',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleHeader:{
    fontWeight: '500',
    fontSize: 17,
  },
  image:{
    height: 25,
    width: 25,
    marginHorizontal: 16,
  },
  centermodal:{
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  modal:{
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 20,
    height: '50%',
    width: '75%',
    borderRadius: 15,
    rowGap: 5,
    justifyContent: 'space-evenly'
  },
  buttonmodal:{
    borderRadius: 10,
    height: 40,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtbuttonmodal:{
    fontWeight: 'bold',
    fontSize: 16,
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
});