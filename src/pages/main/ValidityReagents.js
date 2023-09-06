import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Button, ScrollView, Alert, TextInput } from 'react-native';
import moment from 'moment';
import { DatabaseConnection } from '../../databases/DatabaseConnection';
import { AntDesign } from 'react-native-vector-icons';
import {Picker} from '@react-native-picker/picker';
import {Container} from '../../styles/CommonStyles'
const database = DatabaseConnection.getConnectionDatabase()
import ThemeContext from '../../context/ThemeContext';

const ValidityReagents = ({navigation}) =>{

    const {theme, color} = useContext(ThemeContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const ControllerColor = (dark, light) => {
      return theme=="dark" ? dark : light
    }

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
      setModalVisible(false)    
    };

    const [itemsNearExpiration, setItemsNearExpiration] = useState([]);
    const [itemsOutOfExpiration, setItemsOutOfExpiration] = useState([]);
    const [option, setOption] = useState("fora");

    const getItemsNearExpiration = (daysThreshold, callback) => {
        const currentDate = moment().format('YYYY-MM-DD');
        const expirationThreshold = moment()
          .add(daysThreshold, 'days')
          .format('YYYY-MM-DD');
      
          database.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM produto JOIN lote ON produto.lote_id = lote.id WHERE (strftime("%s", validade) BETWEEN strftime("%s", ?) AND strftime("%s", ?))',
            
            [currentDate, expirationThreshold],
            (tx, results) => {
              const items = [];
              for (let i = 0; i < results.rows.length; i++) {
                items.push(results.rows.item(i));
              }
              callback(items);
            },
            error => {
              console.log('Erro ao buscar itens próximos da data de validade:', error);
            }
          );
        });
      }
    const getItemsOutOfExpiration = (callback) => {
        const currentDate = moment().format('YYYY-MM-DD');
      
        database.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM produto JOIN lote ON produto.lote_id = lote.id WHERE date(validade) < date(?)',
            [currentDate],
            (tx, results) => {
              const items = [];
              for (let i = 0; i < results.rows.length; i++) {
                items.push(results.rows.item(i));
              }
              callback(items);
            },
            error => {
              console.log('Erro ao buscar itens fora da data de validade:', error);
            }
          );
        });
      };

      useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getItemsNearExpiration(7, items => {
                console.log('Itens próximos da validade:', items);
                setItemsNearExpiration(items);
            });
            getItemsOutOfExpiration(items => {
                console.log('Itens fora da validade:',items)
                setItemsOutOfExpiration(items)
            })
        });
        unsubscribe;
    }, [navigation]);

    
    const renderitemOutOfExpiration = ({ item }) => (
      <View style={styles.itemOutOfExpiration}>
        <View>
          <View style={{width: 200}}>
          <Text>Equipamento: {item.nome}</Text>
          </View>
          <Text>Quantidade: {item.quantidade_frascos}</Text>
          <Text>Validade: {item.validade[8]+item.validade[9]+item.validade[7]+item.validade[5]+item.validade[6]+item.validade[4]+item.validade[0]+item.validade[1]+item.validade[2]+item.validade[3]}</Text>
          <Text>Localização: {item.localizacao}</Text>
        </View>

        <View style={{flexDirection: 'row', gap: 10}}>
          <TouchableOpacity onPress={()=>{handleShowModal(item)}}>
            <AntDesign name='delete' size={37} color={'rgb(255, 255, 255)'}/>
          </TouchableOpacity>
        </View>

      </View>
    );
    const renderItemNearExpiration = ({ item }) => (
      <View style={styles.itemNearExpiration}>
        <View>
          <View style={{width: 200}}>
          <Text>Equipamento: {item.nome}</Text>
          </View>
          <Text>Quantidade: {item.quantidade_frascos}</Text>
          <Text>Validade: {item.validade[8]+item.validade[9]+item.validade[7]+item.validade[5]+item.validade[6]+item.validade[4]+item.validade[0]+item.validade[1]+item.validade[2]+item.validade[3]}</Text>
          <Text>Localização: {item.localizacao}</Text>
        </View>

        <View style={{flexDirection: 'row', gap: 10}}>

        </View>

      </View>
    );

    return(
        <Container>
            <Picker
              selectedValue={option}
              onValueChange={(itemValue, itemIndex) =>
                setOption(itemValue)
              }
              style={{color: ControllerColor("#FFF", "#000")}}
              dropdownIconColor={ControllerColor("#FFF", "#000")}
              mode="dropdown"
              >
              <Picker.Item label="Fora da validade" value="fora" />
              <Picker.Item label="Próximos da validade (7 dias)" value="prox" />
            </Picker>
            {option === "fora" && (
        <View>
          <View style={{ height: "90%" }}>
            <FlatList
              data={itemsOutOfExpiration}
              renderItem={renderitemOutOfExpiration}
              keyExtractor={(_, index) => index.toString()}
            />
          </View>
        </View>
      )}
      {option === "prox" && (
        <View>
          <View style={{ height: "90%" }}>
            <FlatList
              data={itemsNearExpiration}
              renderItem={renderItemNearExpiration}
              keyExtractor={(_, index) => index.toString()}
            />
          </View>
        </View>
      )}
      <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
        >
        <View style={styles.centermodal}>
          <View style={styles.modal2}>
            <Text style={{textAlign: 'center'}}>Tem certeza?</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity
                onPress={()=>{
                  deleteItem(selectedItem.id);
                  getItemsNearExpiration(7, items => {
                    console.log('Itens próximos da validade:', items);
                    setItemsNearExpiration(items);
                  });
                  getItemsOutOfExpiration(items => {
                      console.log('Itens fora da validade:',items)
                      setItemsOutOfExpiration(items)
                  })
                
                }}
              >
                <View style={[styles.buttonmodal, {backgroundColor: 'rgb(0, 255, 0 )'}]}>
                <Text>Sim</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={()=>{setModalVisible(false)}}
              >
                <View style={[styles.buttonmodal, {backgroundColor: 'rgb(255, 0, 0 )'}]}>
                <Text>Não</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>  
        </View>
        </Modal>
        </Container>
    )
}

const styles = StyleSheet.create({
  itemNearExpiration: {
      borderRadius: 10,
      backgroundColor: '#FF0',
      padding: 15,
      marginVertical: 5,
      marginHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemOutOfExpiration: {
      borderRadius: 10,
      backgroundColor: '#F00',
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
})


export default ValidityReagents;

