import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { Container, RegularText, TextInputContainer, Label } from '../../styles/CommonStyles'
import { DatabaseConnection } from '../../databases/DatabaseConnection';
import ThemeContext from '../../context/ThemeContext';

const database = DatabaseConnection.getConnectionDatabase();


const RegisterGlassware = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [capacidades, setCapacidades] = useState([{ capacidade: '', quantidade: '' }]);

  const { theme } = useContext(ThemeContext)
  const basedColor = theme == 'dark' ? '#FFF' : '#000';

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
    if (!nome) {
      Alert.alert('Atenção', 'Por favor preencha o nome da Vidraria!');
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


    if (hasEmptyValue) {
      Alert.alert('Atenção', 'Por favor preencha as capacidades corretamente!');
      return;
    }
    database.transaction((tx) => {
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
              () => { console.log('sucess') },
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
        <TextInputContainer style={{ width: '33%' }}>
          <TextInput
            style={[styles.capacidadeInput, {color:basedColor}]}
            value={item.capacidade}
            onChangeText={(valor) => handleCapacidadeChange(index, 'capacidade', valor)}
            placeholder="Ex: 200ml"
            placeholderTextColor='rgb(200, 200, 200)'
          />
        </TextInputContainer>
        <TextInputContainer style={{ width: '33%' }}>
          <TextInput
            style={[styles.quantidadeInput, {color:basedColor}]}
            value={item.quantidade}
            onChangeText={(valor) => handleCapacidadeChange(index, 'quantidade', valor)}
            placeholder="Ex: 3"
            placeholderTextColor='rgb(200, 200, 200)'
            keyboardType="numeric"
          />
        </TextInputContainer>
        <TouchableOpacity onPress={() => removerCapacidade(index)}>
          <Text style={styles.removerCapacidade}>Remover</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Container style={{ padding: 16 }}>
      <ScrollView>
        <Label>Nome:</Label>
        <TextInputContainer>
          <TextInput
            style={[styles.input, { color: basedColor }]}
            value={nome}
            onChangeText={setNome}
            placeholderTextColor='rgb(200, 200, 200)'
            placeholder="Digite o nome da vidraria"
          />
        </TextInputContainer>
        <Label>Capacidades:</Label>
        <FlatList
          scrollEnabled={false}
          data={capacidades}
          renderItem={renderCapacidadeItem}
          keyExtractor={(_, item) => item.toString()}
        />
        <TouchableOpacity onPress={adicionarCapacidade}>
          <Text style={styles.adicionarCapacidade}>Adicionar Capacidade</Text>
        </TouchableOpacity>
        <Label>Localização:</Label>
        <TextInputContainer>
          <TextInput
            style={[styles.input, {color:basedColor}]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Digite a localização da vidraria"
            placeholderTextColor='rgb(200, 200, 200)'
            multiline
          />
        </TextInputContainer>
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <TouchableOpacity onPress={handleSubmit}>
            <View style={styles.botaoSalvar}>
              <Text style={{ fontSize: 16, color: '#fff' }} >Salvar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    padding: 7,
    borderRadius: 5,
  },
  titleinput: {
    marginTop: 10,
    marginHorizontal: 16,
  },
  capacidadeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5
  },
  capacidadeInput: {
    padding: 7,
  },
  quantidadeInput: {
    padding: 7,
  },
  removerCapacidade: {
    color: 'red',
    marginLeft: 10,
  },
  adicionarCapacidade: {
    color: 'blue',
    marginTop: 10,
  },
  botaoSalvar: {
    height: 45,
    width: 230,
    backgroundColor: 'rgb(0, 140, 255)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  }
});

export default RegisterGlassware;

