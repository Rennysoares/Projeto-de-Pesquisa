import { React, useState, useEffect } from 'react'
import {Text,View,StyleSheet,Image, FlatList, BackHandler, TouchableOpacity, Button, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DatabaseConnection } from '../../src/databases/DatabaseConnection'

const dbreagent = DatabaseConnection.getConnectionDBReagent();

export default function TelaReagentes( { navigation } ){

  const [data, setData] = useState([]);
  const [isDatabaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    const createTables = () => {
      let firstTableCreated = false;
      let secondTableCreated = false;
  
      dbreagent.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS lote (id INTEGER PRIMARY KEY AUTOINCREMENT, numero TEXT, validade TEXT, quantidade_geral REAL, unidade_medida TEXT, localizacao TEXT)',
          [],
          () => {
            console.log('tabela lote criada com sucesso ou verificada se existe')
            firstTableCreated = true;
            if (firstTableCreated && secondTableCreated) {
              setDatabaseReady(true);
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
            console.log('tabela produto criada com sucesso ou verificada se existe')
            secondTableCreated = true;
            if (firstTableCreated && secondTableCreated) {
              setDatabaseReady(true);
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

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>Nome: {item.nome}</Text>
      <Text>Número: {item.numero}</Text>
      <Text>Quantidade Geral: {item.quantidade_geral + item.unidade_medida}</Text>
    </View>
  );

  useEffect(() => {
    if (isDatabaseReady) {
      const fetchDados = () => {
        dbreagent.transaction(tx => {
          tx.executeSql(
            'SELECT produto.nome, lote.numero, lote.quantidade_geral, lote.unidade_medida FROM produto JOIN lote ON produto.lote_id = lote.id',
            [],
            (_, { rows }) => {
              setData(rows._array);
            },
            error => {
              console.log('Erro ao buscar dados:', error);
            }
          );
        });
      };

      fetchDados();
    }
  }, [isDatabaseReady]);

  /*
  function consultaDados(){
    dbreagent.transaction(tx => {
      tx.executeSql('SELECT produto.nome, lote.numero, lote.quantidade_geral, lote.unidade_medida FROM produto, lote ON produto.lote_id = lote.id ', [], (_, { rows }) => {
        console.log(rows._array);
      },
      error => {
        console.log('Erro ao consultar dados:', error);
      }
      );
    });
    dbreagent.transaction(tx => {
      tx.executeSql('SELECT * FROM produto ', [], (_, { rows }) => {
        console.log(rows._array);
      },
      error => {
        console.log('Erro ao consultar dados:', error);
      }
      );
      
    });
    dbreagent.transaction(tx => {
      tx.executeSql('SELECT * FROM lote ', [], (_, { rows }) => {
        console.log(rows._array);
      },
      error => {
        console.log('Erro ao consultar dados:', error);
      }
      );
      
    });
  }
*/

  return(
    <SafeAreaView>
      <View style={{height: '90%'}}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 16,
    flexDirection: 'row',
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
  }
});