import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Button, ScrollView, Alert, TextInput } from 'react-native';
import { fetchDados } from './FetchDados';
import { DatabaseConnection } from '../../src/databases/DatabaseConnection';
import { AntDesign, Feather } from 'react-native-vector-icons';

const dbequipment = DatabaseConnection.getConnectionDBEquipment();

const TelaEquipamentos = ({navigation}) =>{

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [modalDelete, setModalDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState();
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [validade, setValidade] = useState('');

    const handleShowModal = (iditem) =>{
      setModalDelete(true)
      setSelectedItem(iditem)
    }

    useEffect(() => {
        const createTables = () => {
          dbequipment.transaction(tx => {
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS Equipamentos ( id INTEGER PRIMARY KEY AUTOINCREMENT,nome TEXT NOT NULL, quantidade INTEGER NOT NULL, validade TEXT, localizacao TEXT)',
              [],
              () => {
                console.log('tabela Equipamentos criada com sucesso ou verificada se existe');
                fetchDados(setData, dbequipment, setFilteredData);
              },
              error => {
                console.log('Erro ao criar tabela produto:', error);
              }
            );
          });
        };
    
        createTables();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          console.log('A tela principal foi ativada');
          fetchDados(setData, dbequipment, setFilteredData);
        });
        unsubscribe;
    }, [navigation]);

    const handleSearch = (text) => {
      const filteredItems = data.filter((item) => {
        return item.nome.toLowerCase().includes(text.toLowerCase());
      });
      setFilteredData(filteredItems);
      //setando o array secundário para a flatlist
    };

    const deleteItem = (iditem) =>{
      dbequipment.transaction(tx => {
        tx.executeSql(
          'DELETE FROM Equipamentos WHERE id = ?',
          [iditem],
          () => {
            console.log('Item deletado com sucesso!');
          },
          error => {
            console.log('Erro ao deletar item:', error);
          }
        );
      });
  
      fetchDados(setData, dbequipment, setFilteredData);
    }

    const renderItem = ({ item }) => (
        <View style={styles.item}>

          <View>
            <View style={{width: 200}}>
            <Text>Equipamento: {item.nome}</Text>
            </View>
            <Text>Quantidade: {item.quantidade}</Text>
            <Text>Validade: {item.validade}</Text>
            <Text>Localização: {item.localizacao}</Text>
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity onPress={()=>{}}>
              <Feather name='edit' size={37} color={'rgb(0, 0, 0)'}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{handleShowModal(item)}}>
              <AntDesign name='delete' size={37} color={'rgb(240, 10, 10)'}/>
            </TouchableOpacity>
          </View>

        </View>
      );


    return(
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
            <TouchableOpacity
              style={{position: 'absolute', bottom: 0, right: 0, padding: 25}}
              onPress={()=>{navigation.navigate('CadastroEquipamentos')}}
            >
                <AntDesign name="pluscircle" size={65} color={'rgb(0, 200, 0)'}/>
            </TouchableOpacity>
            <Modal
              visible={modalDelete}
              transparent={true}
              animationType="fade"
            >
              <View style={styles.centermodal}>
                <View style={styles.modal2}>
                  <Text style={{textAlign: 'center'}}>Tem certeza?</Text>
                  <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <TouchableOpacity
                      onPress={()=>{deleteItem(selectedItem.id); setModalDelete(false)}}
                    >
                      <View style={[styles.buttonmodal, {backgroundColor: 'rgb(0, 255, 0 )'}]}>
                        <Text>Sim</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>{setModalDelete(false);}}
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
    )
}

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
      buttonmodal:{
        borderRadius: 10,
        height: 40,
        width: 90,
        alignItems: 'center',
        justifyContent: 'center'
      },
})

export default TelaEquipamentos;