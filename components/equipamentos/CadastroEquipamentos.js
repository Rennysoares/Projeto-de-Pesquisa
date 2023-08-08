import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatabaseConnection } from '../../src/databases/DatabaseConnection';
const dbequipment = DatabaseConnection.getConnectionDBEquipment();
import { MaskedTextInput } from 'react-native-mask-text';

//FAZER O BOTÂO NA TELA PRINCIPAL DE EQUIPAMENTOS E DECLARAR A TELA NA ROTA

const CadastroEquipamentos =() =>{
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [validade, setValidade] = useState('');

    const handleSubmit = () => {
      if (!nome){
        Alert.alert('Atenção','Por favor preencha o nome do Equipamento!');
        return;
      }
      if (!quantidade){
        Alert.alert('Atenção','Por favor preencha a quantidade do Equipamento!');
        return;
      }
      if(quantidade<1){
        Alert.alert('Atenção','Por favor preencha a quantidade do Equipamento corretamente!');
        return
      }
      dbequipment.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO Equipamentos (nome, quantidade, validade, localizacao) VALUES (?, ?, ?, ?)',
          [nome, parseInt(quantidade), validade[6]+validade[7]+validade[8]+validade[9]+validade[5]+validade[3]+validade[4]+validade[2]+validade[0]+validade[1], localizacao],
          () => {
            Alert.alert('Sucesso', 'Cadastrado com sucesso');
            setNome('')
            setQuantidade('')
            setLocalizacao('')
            setValidade('')
          },
          (tx, error) => {
            console.error('Erro ao inserir vidraria no banco de dados', error);
            Alert.alert('Erro', error);
          }
        );
      });
    };

    const dropTable = () => {
      dbequipment.transaction((tx) => {
        tx.executeSql(
          'DROP TABLE Equipamentos',
          [],
          () => {
            Alert.alert('Sucesso', 'Apagado com sucesso');
            
          },
          (tx, error) => {
            console.error('Erro ao apagar BD', error);
            Alert.alert('Erro', error);
          }
        );
      });
    };

    return(
        <View>
            <Text style={styles.titleinput}>Nome:</Text>
            <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Digite o nome do equipamento"
            />

            <Text style={styles.titleinput}>Quantidade:</Text>
            <TextInput
                style={styles.input}
                value={quantidade}
                keyboardType='numeric'
                onChangeText={setQuantidade}
                placeholder="Digite a quantidade do equipamento"
            />

            <Text style={styles.titleinput}>Validade:</Text>
            <MaskedTextInput
              mask="99-99-9999"
              placeholder="Ex: 01-01-2021"
              placeholderTextColor='rgb(120, 120, 120)'
              onChangeText={setValidade}
              value={validade}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.titleinput}>Localização:</Text>
            <TextInput
                style={styles.input}
                value={localizacao}
                onChangeText={setLocalizacao}
                placeholder="Digite a localização do equipamento"
            />
            <View style={{alignItems: 'center', width: '100%'}}>
              <TouchableOpacity
                onPress={()=>{handleSubmit()}}
              >
                <View style={styles.botaoSalvar}>
                  <Text style={{fontSize: 16, color: '#fff'}}>Cadastrar Equipamentos</Text>
                </View>
              </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    input:{
      margin: 10,
      padding: 7,
      borderRadius: 5,
      backgroundColor: 'rgb(255, 255, 255)'
    },
    titleinput:{
      marginTop: 10,
      marginHorizontal: 16,
    },
    botaoSalvar:{
      height:45,
      width: 230,
      backgroundColor: 'rgb(0, 140, 255)',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10
    },
  });

export default CadastroEquipamentos;