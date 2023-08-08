import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Button, ScrollView, Alert, TextInput } from 'react-native';
import moment from 'moment';
import { DatabaseConnection } from '../src/databases/DatabaseConnection';

const dbequipment = DatabaseConnection.getConnectionDBEquipment()

const TelaValidade = ({navigation}) =>{

    const [items, setItems] = useState([]);


    const getItemsNearExpiration = (daysThreshold, callback) => {
        const currentDate = moment().format('YYYY-MM-DD');
        const expirationThreshold = moment()
          .add(daysThreshold, 'days')
          .format('YYYY-MM-DD');
      
        dbequipment.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM Equipamentos WHERE strftime("%s", validade) BETWEEN strftime("%s", ?) AND strftime("%s", ?)',
            
            [currentDate, expirationThreshold],
            (tx, results) => {
              const items = [];
              for (let i = 0; i < results.rows.length; i++) {
                items.push(results.rows.item(i));
              }
              callback(items);
            },
            error => {
              console.error('Erro ao buscar itens próximos da data de validade:', error);
            }
          );
        });
      }
      const getItemsOutOfExpiration = (callback) => {
        const currentDate = moment().format('YYYY-MM-DD');
      
        dbequipment.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM Equipamentos WHERE date(validade) < date(?)',
            [currentDate],
            (tx, results) => {
              const items = [];
              for (let i = 0; i < results.rows.length; i++) {
                items.push(results.rows.item(i));
              }
              callback(items);
            },
            error => {
              console.error('Erro ao buscar itens fora da data de validade:', error);
            }
          );
        });
      };

      useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getItemsNearExpiration(7, items => {
                console.log('Itens próximos da validade:', items);
                setItems(items);
            });
            getItemsOutOfExpiration(items => {
                console.log('Itens fora da validade:',items)
            })
        });
        unsubscribe;
    }, [navigation]);

    return(
        <View>
            <Text>Tela Validade</Text>
            <View>
            <Text>Itens:</Text>
            {items.map(item => (
                <Text key={item.id}>{item.nome} - {item.validade}</Text>
            ))}
            </View>
        </View>
    )
}

export default TelaValidade;