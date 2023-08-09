import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Button, ScrollView, Alert, TextInput } from 'react-native';
import moment from 'moment';
import { DatabaseConnection } from '../src/databases/DatabaseConnection';
import { AntDesign } from 'react-native-vector-icons';
import {Picker} from '@react-native-picker/picker';

const dbreagent = DatabaseConnection.getConnectionDBReagent()

const TelaValidadeReagentes = ({navigation}) =>{

    const [itemsNearExpiration, setItemsNearExpiration] = useState([]);
    const [itemsOutOfExpiration, setItemsOutOfExpiration] = useState([]);
    const [option, setOption] = useState("fora");

    const getItemsNearExpiration = (daysThreshold, callback) => {
        const currentDate = moment().format('YYYY-MM-DD');
        const expirationThreshold = moment()
          .add(daysThreshold, 'days')
          .format('YYYY-MM-DD');
      
        dbreagent.transaction(tx => {
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
      
        dbreagent.transaction(tx => {
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
          <TouchableOpacity onPress={()=>{handleShowModal(item)}}>
            <AntDesign name='delete' size={37} color={'rgb(240, 10, 10)'}/>
          </TouchableOpacity>
        </View>

      </View>
    );

    return(
        <View>
            <Picker
              selectedValue={option}
              onValueChange={(itemValue, itemIndex) =>
                setOption(itemValue)
              }>
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
        </View>
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

})


export default TelaValidadeReagentes;

