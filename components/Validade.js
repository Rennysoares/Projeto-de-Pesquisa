import React from 'react';
import { View, FlatList, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';


const Validity = ({navigation}) => {
  const data = [
    { id: 1, name: 'Reagente 1', expired: false },
    { id: 2, name: 'Reagente 2', expired: true },
    { id: 3, name: 'Reagente 3', expired: false },
  ];

  const renderItem = ({ item }) => {


    x = require('../assets/atencao.png')
    y = require('../assets/botao-x.png')
    
    return (
      <View style={styles.item}>
        <Text>{item.name}</Text>
        <Image
            style={{height: 30, width:30}}
            source={item.expired ? x : y}
        />
      </View>
    );
  };

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
          <Text>0</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Itens perto da validade</Text>
          <Text>0</Text>
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
