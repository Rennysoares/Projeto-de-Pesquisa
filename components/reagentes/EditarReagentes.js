import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditarReagentes({route, navigation}){
  const teste = route.params
  return(
    <SafeAreaView>
      <View style={styles.headerReagentes}>
        <TouchableOpacity
          onPress={()=>{navigation.goBack();}}>
          <Image
            source={require('../../assets/setanavigator.png')}
            style={styles.image}
          />
        </TouchableOpacity>
        <Text style={styles.titleHeader}>Editar reagente</Text>
      </View>
      <Text>EditarReagente</Text>
      <Text>Reagente: {teste.selectedItem?.nome}</Text>
              <Text>Lote: {teste.selectedItem?.numero}</Text>
              <Text>Quantidade de Frascos: {teste.selectedItem?.quantidade_frascos}</Text>
              <Text>Quantidade de cada Frasco: {teste.selectedItem?.quantidade_unitario}</Text>
              <Text>Quantidade Total: {teste.selectedItem?.quantidade_geral + teste.selectedItem?.unidade_medida}</Text>
              <Text>Validade: {teste.selectedItem?.validade}</Text>
              <Text>Localização: {teste.selectedItem?.localizacao}</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headerReagentes:{
    backgroundColor: 'rgb(255, 255, 255)',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleHeader:{
    fontWeight: '500',
    fontSize: 17,
  },
  txtInput:{
    margin: 10,
    padding: 7,
    borderRadius: 5,
    backgroundColor: 'rgb(255, 255, 255)'
  },
  titleinput:{
    marginTop: 10,
    marginHorizontal: 16,
  },
  image:{
    height: 20,
    width: 20,
    marginHorizontal: 16,
  },
  button:{
    height:45,
    width: 230,
    backgroundColor: 'rgb(0, 140, 255)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  }
});