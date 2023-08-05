import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Button, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatabaseConnection } from '../../src/databases/DatabaseConnection';
import { fetchDados } from './FetchDados';
import { TextInput } from 'react-native-gesture-handler';
import { AntDesign, Ionicons, Feather } from 'react-native-vector-icons';
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
          'CREATE TABLE IF NOT EXISTS lote (id INTEGER PRIMARY KEY AUTOINCREMENT, numero TEXT, validade TEXT, quantidade_geral REAL, unidade_medida TEXT, localizacao TEXT, quantidade_frascos INTEGER, quantidade_unitario REAL)',
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
        <View style={{width: 250, overflow: 'hidden'}}>
          <Text>Reagente: {item.nome}</Text>
        </View>
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
        <View style={{height: '93%' }}>
        <FlatList
          data={filteredData}
          extraData={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
        </View>
      </View>
      <TouchableOpacity
        style={{position: 'absolute', bottom: 0, right: 0, padding: 25}}
        onPress={()=>{navigation.navigate('CadastroReagentes')}}
      >
          <AntDesign name="pluscircle" size={65} color={'rgb(0, 200, 0)'}/>
      </TouchableOpacity>
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

              <ScrollView style={{height: 350}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
                <Image source={require("../../assets/reagenticon.png")} style={{height: 55, width: 55}}/>
                <Text style={{fontSize: 18, width:190, fontWeight: 'bold'}}>{selectedItem?.nome}</Text>
              </View>
              <View style={{gap: 10}}>
              <View>
                <Text style={{fontSize: 16}}>Lote: </Text>
                <Text style={{fontSize: 16}}>{selectedItem?.numero}</Text>
              </View>

              <View>
                <Text style={{fontSize: 16}}>Quantidade de Frascos: </Text>
                <Text style={{fontSize: 16}}>{selectedItem?.quantidade_frascos}</Text>
              </View>

              <View>
                <Text style={{fontSize: 16}}>Quantidade Unitário: </Text>
                <Text style={{fontSize: 16}}>{selectedItem?.quantidade_unitario + selectedItem?.unidade_medida}</Text>
              </View>

              <View>
                <Text style={{fontSize: 16}}>Quantidade Total: </Text>
                <Text style={{fontSize: 16}}>{selectedItem?.quantidade_geral + selectedItem?.unidade_medida}</Text>
              </View>

              <View>
                <Text style={{fontSize: 16}}>Validade: </Text>
                <Text style={{fontSize: 16}}>{selectedItem?.validade}</Text>
              </View>

              <View>
                <Text style={{fontSize: 16}}>Localização: </Text>
                <Text style={{fontSize: 16}}>{selectedItem?.localizacao}</Text>
              </View>
              </View>
              </ScrollView>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              height: 60
            }}>
              <TouchableOpacity
              onPress={()=>{setModalVisible(false);navigation.navigate('EditarReagentes', {selectedItem})}}
              >
                <Feather name='edit' size={37} color={'rgb(0, 0, 0)'}/>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{setModalVisible2(true); setModalVisible(false)}}>
                <AntDesign name='delete' size={37} color={'rgb(240, 10, 10)'}/>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => {setModalVisible(false)}} style={{position: 'absolute', top: 0, right: 0, padding: 5}}>
                <Ionicons name='close' size={30} color={'rgb(0, 0, 0)'}/>
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
    height: 450,
    width: '80%',
    borderRadius: 10,
    rowGap: 5,
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