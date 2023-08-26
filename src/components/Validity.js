import {React, useState, useEffect, useContext} from 'react';
import { View, FlatList, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DatabaseConnection } from '../databases/DatabaseConnection'; 
import moment from 'moment';

import ThemeContext from '../context/ThemeContext';
import themes from '../themes/Themes';
import { ThemeProvider } from 'styled-components';

import { Text as RegularText, Container } from '../styles/components/StylesValidity';

const database = DatabaseConnection.getConnectionDatabase();

const Validity = ({navigation}) => {

  const {theme} = useContext(ThemeContext);
  const themeLight = themes.light;
  const themeDark = themes.dark;

  const [itemsOutOfExpirationCountEquipment, setItemsOutOfExpirationCountEquipment] = useState(0);
  const [itemsOutOfExpirationCountReagent, setItemsOutOfExpirationCountReagent] = useState(0);
  const [itemsNearExpirationCountEquipment, setItemsNearExpirationCountEquipment] = useState(0);
  const [itemsNearExpirationCountReagent, setItemsNearExpirationCountReagent] = useState(0);

  const countItemsOutOfExpirationEquipment = async () => {
    const currentDate = moment().format('YYYY-MM-DD');
  
    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM Equipamentos WHERE date(validade) < date(?)',
          [currentDate],
          (_, results) => {
            const count = results.rows.item(0).count;
            resolve(count);
          },
          error => {
            
          }
        );
      });
    });
  };

  const countItemsOutOfExpirationReagent = async () => {
    const currentDate = moment().format('YYYY-MM-DD');
  
    return new Promise((resolve, reject) => {
      database.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM lote WHERE date(validade) < date(?)',
          [currentDate],
          (_, results) => {
            const count = results.rows.item(0).count;
            resolve(count);
          },
          error => {
            
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
      database.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM Equipamentos WHERE strftime("%s", validade) BETWEEN strftime("%s", ?) AND strftime("%s", ?)',
          [currentDate, expirationThreshold],
          (_, results) => {
            const count = results.rows.item(0).count;
            resolve(count);
          },
          error => {
            
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
      database.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM lote WHERE strftime("%s", validade) BETWEEN strftime("%s", ?) AND strftime("%s", ?)',
          [currentDate, expirationThreshold],
          (_, results) => {
            const count = results.rows.item(0).count;
            resolve(count);
          },
          error => {
            
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
    <ThemeProvider theme={theme === 'light' ? themeLight : themeDark}>
        <View style={styles.miniHeader}>
          <RegularText>Controle de Validade de estoque</RegularText>
          <TouchableOpacity
            onPress={()=>{navigation.navigate('RouteValidity')}}
          >
          <RegularText>Exibir itens</RegularText>
          </TouchableOpacity>
        </View>
      <Container>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <RegularText>Itens fora da validade</RegularText>
          <RegularText>{itemsOutOfExpirationCountEquipment+itemsOutOfExpirationCountReagent}</RegularText>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <RegularText>Itens perto da validade</RegularText>
          <RegularText>{itemsNearExpirationCountEquipment+itemsNearExpirationCountReagent}</RegularText>
        </View>
      </Container>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  miniHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  }, 
});

export default Validity;
