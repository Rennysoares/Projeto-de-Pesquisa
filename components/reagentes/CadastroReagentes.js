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
  ScrollView
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
  const[boolunidadeMedida, setBoolUnidadeMedida] = useState(false);
  const[sufixo, setSufixo] = useState('ml');
  const[quantidadeFrascos, setQuantidadeFrascos] = useState('')
  const[quantidadeCalculada, setQuantidadeCalculada] = useState('')

  useEffect(()=>{
    setQuantidadeCalculada(parseFloat(quantidadeFrascos)*parseFloat(quantidadeUnitario))
  })

  useEffect(() => {
    // Atualiza o sufixo quando o valor do switch é alterado
    if (boolunidadeMedida) {
      setSufixo('ml');
    } else {
      setSufixo('g');
    }

  }, [boolunidadeMedida]);

  function insertDatas() {

    dbreagent.transaction(tx => {
      tx.executeSql(
        'INSERT INTO lote (numero, validade, quantidade_geral, unidade_medida, localizacao) VALUES (?, ?, ?, ?, ?)',
        [lote, validade, parseFloat(quantidadeCalculada), sufixo, localizacao],
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
    <SafeAreaView>

      <View style={styles.headerReagentes}>
        <TouchableOpacity
          onPress={()=>{navigation.goBack();}}>
          <Image
            source={require('../../assets/setanavigator.png')}
            style={styles.image}
          />
        </TouchableOpacity>
        <Text style={styles.titleHeader}>Cadastrar reagente</Text>
      </View>
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

        style={styles.txtInput}
        placeholder="Ex: 7234923"
        placeholderTextColor='rgb(200, 200, 200)'
      />

      <Text style={styles.titleinput}>Quantidade de cada frasco: </Text>
      
      <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
      <TextInput
        value={quantidadeUnitario}
        onChangeText={setQuantidadeUnitario}

        style={styles.txtInput}
        placeholder="Ex: 120"
        placeholderTextColor='rgb(200, 200, 200)'
      />
      
        <Text>{sufixo}</Text>
        <Switch
          value={boolunidadeMedida}
          onValueChange={setBoolUnidadeMedida}
        />
      </View>
      <Text style={styles.titleinput}>Quantidade de frascos: </Text>
      <TextInput
        value={quantidadeFrascos}
        onChangeText={setQuantidadeFrascos}

        style={styles.txtInput}
        placeholder="Ex: 7234923"
        placeholderTextColor='rgb(200, 200, 200)'
      />

      <Text style={styles.titleinput}>Validade: </Text>

      <MaskedTextInput
          mask="99-99-9999"
          placeholder="Ex: 01-01-2021"
          placeholderTextColor='rgb(200, 200, 200)'
          onChangeText={setValidade}
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

        <Button
          title='Cadastrar reagentes'
          //disabled={true}
          onPress={()=>{
            if (!nomeReagente) {
              alert('Por favor preencha o nome do Reagente!');
              return;
            }
            if(!lote){
              alert('Por favor preencha o número de lote');
              return;
            }
            if(!quantidadeUnitario){
              alert('Por favor preencha a quantidade de cada frascos');
              return;
            }
            if(!quantidadeFrascos){
              alert('Por favor preencha a quantidade de frascos');
              return;
            }
            if(!validade){
              alert('Por favor preencha validade');
              return;
            }
            insertDatas();
            navigation.goBack();
            alert('Reagentes Cadastrados com sucesso');
          }}
        />
      </ScrollView>
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
}
});