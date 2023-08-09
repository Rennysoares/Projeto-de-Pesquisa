import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, Alert } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { DatabaseConnection } from '../../src/databases/DatabaseConnection';


const dbglassware = DatabaseConnection.getConnectionDBGlassware();


const CadastroVidrarias = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [capacidades, setCapacidades] = useState([{ capacidade: '', quantidade: '' }]);

  const adicionarCapacidade = () => {
    setCapacidades([...capacidades, { capacidade: '', quantidade: '' }]);
  };

  const removerCapacidade = (index) => {
    const newCapacidades = [...capacidades];
    newCapacidades.splice(index, 1);
    setCapacidades(newCapacidades);
  };

  const handleCapacidadeChange = (index, campo, valor) => {
    const newCapacidades = [...capacidades];
    newCapacidades[index][campo] = valor;
    setCapacidades(newCapacidades);
  };

  const handleSubmit = () => {
    if(!nome){
      Alert.alert('Atenção','Por favor preencha o nome da Vidraria!');
      return;
    }
    const hasEmptyField = (obj) => {
      for (const key in obj) {
        if (!obj[key]) {
          return true;
        }
      }
      return false;
    };

    const hasEmptyValue = capacidades.some((value) => hasEmptyField(value));
    

    if(hasEmptyValue){
      Alert.alert('Atenção','Por favor preencha as capacidades corretamente!');
      return;
    }
    dbglassware.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO Vidrarias (nome, descricao, quantidade) VALUES (?, ?, ?)',
        [nome, descricao, capacidades.length],
        (tx, results) => {
          const vidrariaId = results.insertId;
          capacidades.forEach((capacidade) => {
            const { capacidade: cap, quantidade } = capacidade;
            tx.executeSql(
              'INSERT INTO Capacidades (vidraria_id, capacidade, quantidade) VALUES (?, ?, ?)',
              [vidrariaId, cap, quantidade],
              () => {console.log('sucess')},
              (tx, error) => {
                console.error('Erro ao inserir capacidade no banco de dados', error);
              }
            );
          });
        },
        (tx, error) => {
          console.error('Erro ao inserir vidraria no banco de dados', error);
        }
      );
    });

    Alert.alert('Sucesso', 'Cadastrado com sucesso');
    setNome('')
    setDescricao('')
    setCapacidades([{ capacidade: '', quantidade: '' }])
  };

  const renderCapacidadeItem = ({ item, index }) => {
    return (
      <View style={styles.capacidadeItem}>
        <TextInput
          style={styles.capacidadeInput}
          value={item.capacidade}
          onChangeText={(valor) => handleCapacidadeChange(index, 'capacidade', valor)}
          placeholder="Digite a capacidade da vidraria"
        />
        <TextInput
          style={styles.quantidadeInput}
          value={item.quantidade}
          onChangeText={(valor) => handleCapacidadeChange(index, 'quantidade', valor)}
          placeholder="Digite a quantidade"
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={() => removerCapacidade(index)}>
          <Text style={styles.removerCapacidade}>Remover</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <Text style={styles.titleinput}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome da vidraria"
      />

      <Text style={styles.titleinput}>Capacidades:</Text>
      <View style={{margin: 10}}>
        <FlatList
          style={{height: 200}}
          data={capacidades}
          renderItem={renderCapacidadeItem}
          keyExtractor={(_, item) => item.toString()}
        />
        <TouchableOpacity onPress={adicionarCapacidade}>
          <Text style={styles.adicionarCapacidade}>Adicionar Capacidade</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.titleinput}>Localização:</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Digite a localização da vidraria"
        multiline
      />
      <View style={{alignItems: 'center', width: '100%'}}>
      <TouchableOpacity onPress={handleSubmit}>
        <View style={styles.botaoSalvar}>
          <Text style={{fontSize: 16, color: '#fff'}} >Salvar</Text>
        </View>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
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
  capacidadeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacidadeInput: {
    flex: 2,
    padding: 7,
    borderRadius: 5,
    backgroundColor: 'rgb(255, 255, 255)'
  },
  quantidadeInput: {
    flex: 1,
    margin: 10,
    padding: 7,
    borderRadius: 5,
    backgroundColor: 'rgb(255, 255, 255)'
  },
  removerCapacidade: {
    color: 'red',
    marginLeft: 10,
  },
  adicionarCapacidade: {
    color: 'blue',
    marginTop: 10,
  },
  botaoSalvar:{
    height:45,
    width: 230,
    backgroundColor: 'rgb(0, 140, 255)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  }
});

export default CadastroVidrarias;

