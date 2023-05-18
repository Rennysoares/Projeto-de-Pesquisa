import React from 'react';
import {
  Text, 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Button
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function CadastroReagentes( { navigation }){
  return(
    <SafeAreaView>

      <Text style={styles.titleinput}>Nome do reagente: </Text>
      <TextInput
        style={styles.txtInput}
        placeholder="Ex: Ácido Clorídrico"
        placeholderTextColor='rgb(200, 200, 200)'
      />

      <Text style={styles.titleinput}>Lote: </Text>
      <TextInput
        style={styles.txtInput}
        placeholder="Ex: 7234923"
        placeholderTextColor='rgb(200, 200, 200)'
      />

      <Text style={styles.titleinput}>Quantidade: </Text>
      <TextInput
        placeholder="Ex: 2"
        placeholderTextColor='rgb(200, 200, 200)'
        style={styles.txtInput}
      />

      <Text style={styles.titleinput}>Validade: </Text>
      <TextInput
        style={styles.txtInput}
        placeholder="Ex: 12/07/2025"
        placeholderTextColor='rgb(200, 200, 200)'
      />

      <Text style={styles.titleinput}>Localização: </Text>
      <TextInput
        placeholder="Ex: Armário de Reagentes"
        placeholderTextColor='rgb(200, 200, 200)'
        style={styles.txtInput}
      />

      <Button
        title='Cadastrar reagentes'
        //disabled={true}
        onPress={()=>{navigation.goBack(); alert('Reagentes Cadastrados com sucesso')}}
      />
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
}
});