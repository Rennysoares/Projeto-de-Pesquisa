import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Button, ScrollView, TextInput } from 'react-native';
import { DatabaseConnection } from '../../databases/DatabaseConnection';
import moment from 'moment';
import { consultReagents } from '../../databases/DatabaseQueries';
import { AntDesign, Ionicons, Feather } from 'react-native-vector-icons';
import ThemeContext from '../../context/ThemeContext';
import {
  RegularText,
  ContainerSearch,
  FlatItem,
  TextInputContainer
} from '../../styles/CommonStyles';
import StockConfigContext from '../../context/StockConfigContext';

const database = DatabaseConnection.getConnectionDatabase();

const SearchReagent = ({ navigation }) => {

  const {theme, color} = useContext(ThemeContext);
  const { lowStock } = useContext(StockConfigContext);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible2, setModalVisible2] = useState(false);
  const basedColor = theme == 'dark' ? '#FFF': '#000';

  const handleSearch = (text) => {
    const filteredItems = data.filter((item) => {
      return item.nome.toLowerCase().includes(text.toLowerCase());
    });
    setFilteredData(filteredItems);
  };
  
  const handleShowModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };
  
  const deleteItem = (itemId) => {
    database.transaction(tx => {
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

    database.transaction(tx => {
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
    consultReagents(setData, setFilteredData);    
  };

  useEffect(() => {
    const updateflatlist = navigation.addListener('focus', () => {
      console.log('Updated Flatlist');
      consultReagents(setData, setFilteredData);
    });
    updateflatlist;
  }, [navigation]);

  const renderItem = ({ item }) => {
    let status = basedColor;
    if (parseFloat(item.quantidade_geral) < (parseFloat(item.quantidade_unitario) * parseFloat(item.quantidade_frascos))*(5/100) ){
      status = 'rgb(255, 0, 0)'
    }
    else if (parseFloat(item.quantidade_geral) <= (parseFloat(item.quantidade_unitario) * parseFloat(item.quantidade_frascos))*(lowStock/100)){
      status = 'rgb(210, 210, 0)'
    }
    return(
      <TouchableOpacity 
            onPress={() => handleShowModal(item)}
            >
      <FlatItem>
        
        <View>
          <View style={{width: 250, overflow: 'hidden'}}>
            <RegularText>Reagente: {item.nome}</RegularText>
          </View>
          <Text>
            <RegularText>Quantidade Geral: </RegularText>
            <RegularText style={{color: status}}>{item.quantidade_geral + item.unidade_medida}</RegularText>
          </Text>
          <RegularText>Validade: {moment(item.validade, "YYYY/MM/DD").format("DD-MM-YYYY")}</RegularText>
        </View>
        <View>
          <TouchableOpacity 
            onPress={() => handleShowModal(item)}
            >
            <Feather name="more-horizontal" size={50} color={basedColor}/>
          </TouchableOpacity>
        </View>
      </FlatItem>
      </TouchableOpacity>
    )
  };

  return (
    <View>
      <ContainerSearch>
        <TextInputContainer>
          <TextInput
            placeholder="Pesquise aqui"
            placeholderTextColor='rgb(200, 200, 200)'
            onChangeText={handleSearch}
            style={{
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
        style={{position: 'absolute', bottom: 50, right: 50, padding: 0}}
        onPress={()=>{navigation.navigate('RegisterReagent')}}
      >
          <AntDesign name="pluscircle" size={65} color={color}/>
      </TouchableOpacity>
      </ContainerSearch>
      
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
                <Image source={require("../../../assets/reagenticon.png")} style={{height: 55, width: 55}}/>
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
                <Text style={{fontSize: 16}}>{moment(selectedItem?.validade, "YYYY/MM/DD").format("DD-MM-YYYY") }</Text>
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
              onPress={()=>{setModalVisible(false);navigation.navigate('EditReagent', {selectedItem})}}
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

export default SearchReagent;


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