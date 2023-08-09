import {React, useState, useEffect} from 'react';
import { View, FlatList, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DatabaseConnection } from '../src/databases/DatabaseConnection';
import moment from 'moment';

const dbreagent = DatabaseConnection.getConnectionDBReagent();
const dbequipment = DatabaseConnection.getConnectionDBEquipment()

const Validity = ({navigation}) => {

  const [itemsOutOfExpirationCountEquipment, setItemsOutOfExpirationCountEquipment] = useState(0);
  const [itemsOutOfExpirationCountReagent, setItemsOutOfExpirationCountReagent] = useState(0);
  const [itemsNearExpirationCountEquipment, setItemsNearExpirationCountEquipment] = useState(0);
  const [itemsNearExpirationCountReagent, setItemsNearExpirationCountReagent] = useState(0);

  const countItemsOutOfExpirationEquipment = async () => {
    const currentDate = moment().format('YYYY-MM-DD');
  
    return new Promise((resolve, reject) => {
      dbequipment.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM Equipamentos WHERE date(validade) < date(?)',
          [currentDate],
          (_, results) => {
            const count = results.rows.item(0).count;
            resolve(count);
          },
          error => {
            reject(error);
          }
        );
      });
    });
  };

  const countItemsOutOfExpirationReagent = async () => {
    const currentDate = moment().format('YYYY-MM-DD');
  
    return new Promise((resolve, reject) => {
      dbreagent.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM lote WHERE date(validade) < date(?)',
          [currentDate],
          (_, results) => {
            const count = results.rows.item(0).count;
            resolve(count);
          },
          error => {
            reject(error);
          }
        );
      });
    });
  };

  const countItemsNearExpirationEquipment = async (daysThreshold) => {
    const currentDate = moment().format('YYYY-MM-DD');
    const expirationThreshold = moment()
      .add(daysThreshold, 'days')
      .format('YYYY-MM-DD');
  
    return new Promise((resolve, reject) => {
      dbequipment.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM Equipamentos WHERE strftime("%s", validade) BETWEEN strftime("%s", ?) AND strftime("%s", ?)',
          [currentDate, expirationThreshold],
          (_, results) => {
            const count = results.rows.item(0).count;
            resolve(count);
          },
          error => {
            reject(error);
          }
        );
      });
    });
  };

  const countItemsNearExpirationReagent= async (daysThreshold) => {
    const currentDate = moment().format('YYYY-MM-DD');
    const expirationThreshold = moment()
      .add(daysThreshold, 'days')
      .format('YYYY-MM-DD');
  
    return new Promise((resolve, reject) => {
      dbreagent.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM lote WHERE strftime("%s", validade) BETWEEN strftime("%s", ?) AND strftime("%s", ?)',
          [currentDate, expirationThreshold],
          (_, results) => {
            const count = results.rows.item(0).count;
            resolve(count);
          },
          error => {
            reject(error);
          }
        );
      });
    });
  };
  
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      countItemsOutOfExpirationEquipment().then(count => {
        setItemsOutOfExpirationCountEquipment(count);
      });
      countItemsOutOfExpirationReagent().then(count => {
        setItemsOutOfExpirationCountReagent(count);
      });
      countItemsNearExpirationEquipment(7).then(count => {
        setItemsNearExpirationCountEquipment(count);
      });
      countItemsNearExpirationReagent(7).then(count => {
        setItemsNearExpirationCountReagent(count);
      });
    });
    unsubscribe;
}, [navigation]);

  return (
    <View style={styles.card}>
        <View style={styles.miniHeader}>
          <Text>Controle de Validade de estoque</Text>
          <TouchableOpacity
            onPress={()=>{navigation.navigate('NavValidade')}}
          >
          <Text>Exibir itens</Text>
          </TouchableOpacity>
        </View>
      <View style={{backgroundColor: '#DDD', borderRadius: 10, padding: 7, justifyContent: 'space-around', height: 130}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Itens fora da validade</Text>
          <Text>{itemsOutOfExpirationCountEquipment+itemsOutOfExpirationCountReagent}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Itens perto da validade</Text>
          <Text>{itemsNearExpirationCountEquipment+itemsNearExpirationCountReagent}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card:{
  },
  miniHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  }, 
});

export default Validity;
