import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Button, ScrollView, Alert, TextInput } from 'react-native';
import { consultEquipments } from '../../databases/DatabaseQueries';
import { DatabaseConnection } from '../../databases/DatabaseConnection';
import { AntDesign, Feather, Ionicons } from 'react-native-vector-icons';
import { MaskedTextInput } from 'react-native-mask-text';
import moment from 'moment';
const database = DatabaseConnection.getConnectionDatabase();

import {
  RegularText,
  ContainerSearch,
  FlatItem,
  TextInputContainer
} from '../../styles/CommonStyles';

import ThemeContext from '../../context/ThemeContext';
import { useContext } from 'react';

const SearchEquipment = ({navigation}) =>{
    const { theme, color } = useContext(ThemeContext);
    const basedColor = theme == 'dark' ? '#FFF': '#000';
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [modalDelete, setModalDelete] = useState(false);
    const [modalEdit, setModalEdit] = useState(false)
    const [selectedItem, setSelectedItem] = useState();
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [validade, setValidade] = useState('');

    const handleShowModal = (iditem) =>{
      setModalDelete(true)
      setSelectedItem(iditem)
    }
    
    const handleShowModalEdit = (item) =>{
      setModalEdit(true)
      setId(item.id)
      setNome(item.nome)
      setQuantidade(''+item.quantidade)
      setLocalizacao(item.localizacao)
      setValidade(item.validade[8]+item.validade[9]+item.validade[7]+item.validade[5]+item.validade[6]+item.validade[4]+item.validade[0]+item.validade[1]+item.validade[2]+item.validade[3])
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          console.log('A tela principal foi ativada');
          consultEquipments(setData, setFilteredData);
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

    const editItem = () => {
      if (!nome){
        Alert.alert('Atenção','Por favor preencha o nome do Equipamento!');
        return;
      }
      if (!quantidade){
        Alert.alert('Atenção','Por favor preencha a quantidade do Equipamento!');
        return;
      }
      if(quantidade<1){
        Alert.alert('Atenção','Por favor preencha a quantidade do Equipamento corretamente!');
        return
      }
      database.transaction(tx => {
        tx.executeSql(
          'UPDATE Equipamentos SET nome = ?, quantidade = ?, validade = ?, localizacao = ? WHERE id = ?;',
          [nome,quantidade,
            moment(validade, "DD-MM-YYYY").format("YYYY-MM-DD"),localizacao,id],
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
  
      consultEquipments(setData, setFilteredData);
    }

    const deleteItem = (iditem) =>{
      database.transaction(tx => {
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
  
      consultEquipments(setData, setFilteredData);
    }

    const renderItem = ({ item }) => (
        <FlatItem>
          <View>
            <View style={{width: 200}}>
            <RegularText>{item.nome}</RegularText>
            </View>
            <RegularText>Quantidade: {item.quantidade}</RegularText>
            {item.validade == "Invalid date" ? undefined : <RegularText>Validade: {moment(item.validade, "YYYY/MM/DD").format("DD-MM-YYYY")}</RegularText>}
            {!item.localizacao ? undefined : <RegularText>Localização: {item.localizacao}</RegularText>}
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity onPress={()=>{handleShowModalEdit(item)}}>
              <Feather name='edit' size={37} color={basedColor}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{handleShowModal(item)}}>
              <AntDesign name='delete' size={37} color={'rgb(240, 10, 10)'}/>
            </TouchableOpacity>
          </View>

        </FlatItem>
      );


    return(
        <View>
          <ContainerSearch>
            <TextInputContainer style={{marginVertical: 5, marginHorizontal: 16}}>
              <TextInput
                  placeholder="Pesquise aqui"
                  placeholderTextColor='rgb(200, 200, 200)'
                  onChangeText={handleSearch}
                  style={{
                      color: basedColor,
                      padding:10
                  }}
              />
            </TextInputContainer>
            <FlatList
                data={filteredData}
                extraData={data}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
            />
            <TouchableOpacity
              style={{position: 'absolute', bottom: 0, right: 0, padding: 25}}
              onPress={()=>{navigation.navigate('RegisterEquipment')}}
            >
                <AntDesign name="pluscircle" size={65} color={color}/>
            </TouchableOpacity>
            </ContainerSearch>
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
            <Modal
              visible={modalEdit}
              transparent={true}
              animationType="fade"
            >
              <View style={styles.centermodal}>
              <View style={styles.modalEdit}>
                <Text>Editar Vidraria</Text>
                  <Text style={styles.titleinput}>Nome:</Text>
                  <TextInput
                      style={styles.input}
                      value={nome}
                      onChangeText={setNome}
                      placeholder="Digite o nome do equipamento"
                  />

                  <Text style={styles.titleinput}>Quantidade:</Text>
                  <TextInput
                      style={styles.input}
                      value={quantidade}
                      keyboardType='numeric'
                      onChangeText={setQuantidade}
                      placeholder="Digite a quantidade do equipamento"
                  />

                  <Text style={styles.titleinput}>Validade:</Text>
                  <TextInput
                    mask="99-99-9999"
                    placeholder="Ex: 01-01-2021"
                    placeholderTextColor='rgb(120, 120, 120)'
                    onChangeText={setValidade}
                    value={validade}
                    keyboardType="numeric"
                    style={styles.input}
                  />

                  <Text style={styles.titleinput}>Localização:</Text>
                  <TextInput
                      style={styles.input}
                      value={localizacao}
                      onChangeText={setLocalizacao}
                      placeholder="Digite a localização do equipamento"
                  />
                  <View style={{alignItems: 'center', width: '100%'}}>
                    <TouchableOpacity
                      onPress={()=>{editItem()}}
                    >
                      <View style={styles.botaoSalvar}>
                        <Text style={{fontSize: 16, color: '#fff'}}>Cadastrar Equipamentos</Text>
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
      modalEdit:{
        backgroundColor: 'rgb(250, 250, 250)',
        padding: 20,
        height: 400,
        width: '75%',
        borderRadius: 15,
        rowGap: 5,
      },
      botaoSalvar:{
        height:45,
        width: 230,
        backgroundColor: 'rgb(0, 140, 255)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
      },
      input:{
        padding: 7,
        borderRadius: 5,
        backgroundColor: 'rgb(255, 255, 255)'
      },
})

export default SearchEquipment;