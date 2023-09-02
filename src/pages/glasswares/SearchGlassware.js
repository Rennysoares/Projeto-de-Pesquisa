import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Button, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatabaseConnection } from '../../databases/DatabaseConnection'; 
import { TextInput } from 'react-native-gesture-handler';
import { AntDesign, Ionicons, Feather } from 'react-native-vector-icons';

import { consultGlasswares } from '../../databases/DatabaseQueries';
const database = DatabaseConnection.getConnectionDatabase();

const SearchGlassware = ({ navigation }) => {
  const [isDatabaseReady, setDatabaseReady] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalEdit, setModalEdit] = useState(false)

  const[capacidadeVidraria, setCapacidadeVidraria] = useState('');
  const[quantidadeVidraria, setQuantidadeVidraria] = useState('');
  const[idVidraria, setIdVidraria] = useState('');

  const handleShowModal = (iditem) =>{
    setModalVisible2(true)
    setSelectedItem(iditem)
  }
  const handleShowModalEdit = (item) =>{
    setModalEdit(true)
    setCapacidadeVidraria(item.capacidade)
    setQuantidadeVidraria(''+item.quantidade)
    setIdVidraria(item.idcapacidades)
    console.log(item)
  }
  const editItem = () => {
    database.transaction(tx => {
      tx.executeSql(
        'UPDATE Capacidades SET capacidade = ?, quantidade = ? WHERE id = ?;',
        [capacidadeVidraria,quantidadeVidraria,idVidraria],
        () => {
          console.log('Item atualizado com sucesso!');
          Alert.alert('Sucesso', 'Item atualizado com sucesso!')
          setModalEdit(false)
        },
        error => {
          console.log('Erro ao atualizar item:', error);
          Alert.alert('Erro', 'Erro ao atualizar item:' + error)
        }
      );
    });

    consultGlasswares(setData, setFilteredData);
  }
  const deleteItem = (iditem) =>{
    database.transaction(tx => {
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

    consultGlasswares(setData, setFilteredData);
  }
  const handleSearch = (text) => {
    const filteredItems = data.filter((item) => {
      return item.nome.toLowerCase().includes(text.toLowerCase());
    });
    setFilteredData(filteredItems);
    //setando o array secundário para a flatlist
  };
  
  useEffect(() => {
    const updateflatlist = navigation.addListener('focus', () => {
      console.log('Updated Flatlist');
      consultGlasswares(setData, setFilteredData);
    });
    updateflatlist;
  }, [navigation]);
  const renderVidrariaItem = ({ item }) => (
    <TouchableOpacity onLongPress={()=>{handleShowModal(item)}}>
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemQuantidade}>{item.capacidade}</Text>
        <Text style={styles.itemQuantidade}>{`Quantidade: ${item.quantidade}`} unidades</Text>
        {!item.descricao ? undefined : <Text style={styles.itemDescricao}>{item.descricao}</Text>}
      </View>

      <View style={{flexDirection: 'row', gap: 10}}>
        <TouchableOpacity onPress={()=>{handleShowModalEdit(item)}}>
          <Feather name='edit' size={37} color={'rgb(0, 0, 0)'}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{handleShowModal(item)}}>
          <AntDesign name='delete' size={37} color={'rgb(240, 10, 10)'}/>
        </TouchableOpacity>
      </View>
    </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={{height: "100%"}}>
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
        <TouchableOpacity
        style={{position: 'absolute', bottom: 0, right: 0, padding: 25}}
        onPress={()=>{navigation.navigate('RegisterGlassware')}}
          >
          <AntDesign name="pluscircle" size={65} color={'rgb(0, 200, 0)'}/>
        </TouchableOpacity>
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
          <View style={styles.modalEdit}>
            <Text>Editar Vidraria</Text>
            <Text style={styles.titleinput}>Capacidade:</Text>
            <TextInput
              style={styles.input}
              value={capacidadeVidraria}
              onChangeText={setCapacidadeVidraria}
              placeholder="Digite a capacidade da Vidraria"
            />
            <Text style={styles.titleinput}>Quantidade:</Text>
            <TextInput
              style={styles.input}
              value={quantidadeVidraria}
              onChangeText={setQuantidadeVidraria}
              placeholder="Digite a quantidade da vidraria"
            />
            <View style={{alignItems: 'center', padding: 10}}>
              <TouchableOpacity onPress={()=>{editItem()}}>
                <View style={styles.botaoSalvar}>
                  <Text style={{fontSize: 16, color: '#fff'}} >Salvar</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => {setModalEdit(false)}} style={{position: 'absolute', top: 0, right: 0, padding: 5}}>
                <Ionicons name='close' size={30} color={'rgb(0, 0, 0)'}/>
            </TouchableOpacity>
          </View>
          </View>
        </Modal>
        
    </View>
  );
};

export default SearchGlassware;

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
    backgroundColor: 'rgb(250, 250, 250)',
    padding: 20,
    height: '25%',
    width: '75%',
    borderRadius: 15,
    rowGap: 5,
    justifyContent: 'space-around'
  },
  modalEdit:{
    backgroundColor: 'rgb(250, 250, 250)',
    padding: 20,
    height: 300,
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
  input:{
    padding: 7,
    borderRadius: 5,
    backgroundColor: 'rgb(255, 255, 255)'
  },
  titleinput:{
    marginTop: 10,
  },
  botaoSalvar:{
    height:45,
    width: 230,
    backgroundColor: 'rgb(0, 140, 255)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  }
});

