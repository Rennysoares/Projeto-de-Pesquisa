import {React, useState, useEffect} from 'react';
import {
  Text, 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Button,
  Switch,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaskedTextInput } from 'react-native-mask-text';

import { DatabaseConnection } from '../../src/databases/DatabaseConnection'
const dbreagent = DatabaseConnection.getConnectionDBReagent();

export default function CadastroReagentes( { navigation }){

  const[nomeReagente, setNomeReagente] = useState('')
  const[lote, setLote ] = useState('')
  const[quantidadeUnitario, setQuantidadeUnitario] = useState('')
  const[validade, setValidade] = useState('')
  const[localizacao, setLocalizacao] = useState('')
  const[sufixo, setSufixo] = useState();
  const[quantidadeFrascos, setQuantidadeFrascos] = useState('')
  const[quantidadeCalculada, setQuantidadeCalculada] = useState('')

  useEffect(()=>{
    setQuantidadeCalculada(parseFloat(quantidadeFrascos)*parseFloat(quantidadeUnitario))
  })

  function insertDatas() {

    dbreagent.transaction(tx => {
      tx.executeSql(
        'INSERT INTO lote (numero, validade, quantidade_geral, unidade_medida, localizacao, quantidade_frascos, quantidade_unitario) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [lote, validade, parseFloat(quantidadeCalculada), sufixo, localizacao, quantidadeFrascos, quantidadeUnitario],
        (tx, result) => {
          const loteId = result.insertId; // Recupera o ID do lote inserido
          console.log('Lote inserido com sucesso', loteId);
  
          tx.executeSql(
            'INSERT INTO produto (nome, lote_id) VALUES (?, ?)',
            [nomeReagente, loteId], // Insere o ID do lote recuperado
            () => {
              console.log('Produto inserido com sucesso');
            },
            error => {
              console.log('Error inserting data2: ', error);
            }
          );
        },
        error => {
          console.log('Error inserting data1: ', error);
        }
      );
    });
  }

  return(
    <View>
      <ScrollView>
      <Text style={styles.titleinput}>Nome do reagente: </Text>
      <TextInput
        value={nomeReagente}
        onChangeText={setNomeReagente}

        style={styles.txtInput}
        placeholder="Ex: Ácido Clorídrico"
        placeholderTextColor='rgb(200, 200, 200)'
      />

      <Text style={styles.titleinput}>Lote: </Text>
      <TextInput
        value={lote}
        onChangeText={setLote}
        keyboardType="numeric"
        style={styles.txtInput}
        placeholder="Ex: 7234923"
        placeholderTextColor='rgb(200, 200, 200)'
      />

      <Text style={styles.titleinput}>Quantidade de cada frasco: </Text>
      
      <View style={{alignItems: 'center', flexDirection: 'row',}}>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <TextInput
          value={quantidadeUnitario}
          onChangeText={setQuantidadeUnitario}
          keyboardType="numeric"
          style={[styles.txtInput, {width: 100}]}
          placeholder="Ex: 120"
          placeholderTextColor='rgb(200, 200, 200)'
        />
        </View>
        <View style={{width: 100, alignItems: 'center'}}>
        <TextInput
          value={sufixo}
          onChangeText={setSufixo}
          style={[styles.txtInput, {width: 100}]}
          autoCapitalize="none"
          placeholder="Ex: ml"
          placeholderTextColor='rgb(200, 200, 200)'
        />
        </View>
      </View>
      <Text style={styles.titleinput}>Quantidade de frascos: </Text>
      <TextInput
        value={quantidadeFrascos}
        onChangeText={setQuantidadeFrascos}
        style={styles.txtInput}
        placeholder="Ex: 2"
        maxLength={3}
        keyboardType="numeric"
        placeholderTextColor='rgb(200, 200, 200)'
      />

      <Text style={styles.titleinput}>Validade: </Text>

      <MaskedTextInput
          mask="99-99-9999"
          placeholder="Ex: 01-01-2021"
          placeholderTextColor='rgb(200, 200, 200)'
          onChangeText={setValidade}
          value={validade}
          keyboardType="numeric"
          style={styles.txtInput}
        />

      <Text style={styles.titleinput}>Localização: </Text>
      <TextInput
        value={localizacao}
        onChangeText={setLocalizacao}

        placeholder="Ex: Armário de Reagentes"
        placeholderTextColor='rgb(200, 200, 200)'
        style={styles.txtInput}
      />
      <View style={{alignItems: 'center', width: '100%'}}>
        <TouchableOpacity
          //disabled={true}
          onPress={()=>{
            if (!nomeReagente) {
              Alert.alert('Atenção','Por favor preencha o nome do Reagente!');
              return;
            }
            if(!lote){
              Alert.alert('Atenção','Por favor preencha o número de lote');
              return;
            }
            if(!quantidadeUnitario){
              Alert.alert('Atenção','Por favor preencha a quantidade de cada frascos');
              return;
            }
            if(!sufixo){
              Alert.alert('Atenção','Por favor preencha a unidade de medida');
              return;
            }
            if(!quantidadeFrascos){
              Alert.alert('Atenção','Por favor preencha a quantidade de frascos');
              return;
            }
            if(!validade){
              Alert.alert('Atenção','Por favor preencha validade');
              return;
            }
            insertDatas();
            Alert.alert('Sucesso','Reagentes Cadastrados com sucesso');
            setNomeReagente('')
            setLote('')
            setQuantidadeUnitario('')
            setSufixo('')
            setQuantidadeFrascos('')
            setValidade('')
            setLocalizacao('')
          }}
        >
          <View style={styles.button}>
            <Text style={{fontSize: 16, color: '#fff'}}>Cadastrar Reagentes</Text>
          </View>
          </TouchableOpacity>
        </View>
        <View style={{height: 100}}>
        </View>
      </ScrollView>
    </View>
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