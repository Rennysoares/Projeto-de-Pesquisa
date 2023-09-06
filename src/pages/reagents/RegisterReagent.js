import { React, useState, useEffect, useContext } from 'react';
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
import {
  Container,
  Label,
  TextInputContainer
} from '../../styles/CommonStyles';
import ThemeContext from '../../context/ThemeContext';
import { MaskedTextInput } from 'react-native-mask-text';
import moment from 'moment';
import { DatabaseConnection } from '../../../src/databases/DatabaseConnection';
const database = DatabaseConnection.getConnectionDatabase();

export default function RegisterReagent({ navigation }) {

  const [nomeReagente, setNomeReagente] = useState('')
  const [lote, setLote] = useState('')
  const [quantidadeUnitario, setQuantidadeUnitario] = useState('')
  const [validade, setValidade] = useState('')
  const [localizacao, setLocalizacao] = useState('')
  const [sufixo, setSufixo] = useState();
  const [quantidadeFrascos, setQuantidadeFrascos] = useState('')
  const [quantidadeCalculada, setQuantidadeCalculada] = useState('')

  const { theme } = useContext(ThemeContext)
  const basedColor = theme == 'dark' ? '#FFF' : '#000';



  function formatData() {
    const data = moment(validade, "DD/MM/YYYY");
    return data.format("YYYY-MM-DD");
  }

  useEffect(() => {
    setQuantidadeCalculada(parseFloat(quantidadeFrascos) * parseFloat(quantidadeUnitario))
  })

  function insertDatas() {

    database.transaction(tx => {
      tx.executeSql(
        'INSERT INTO lote (numero, validade, quantidade_geral, unidade_medida, localizacao, quantidade_frascos, quantidade_unitario) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [lote, formatData(), parseFloat(quantidadeCalculada), sufixo, localizacao, quantidadeFrascos, quantidadeUnitario],
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

  return (
    <Container style={{ paddingHorizontal: 16 }}>
      <ScrollView>
        <Label>Nome do reagente: </Label>
        <TextInputContainer>
          <TextInput
            value={nomeReagente}
            onChangeText={setNomeReagente}
            style={[styles.txtInput, { color: basedColor }]}
            placeholder="Ex: Ácido Clorídrico"
            placeholderTextColor='rgb(200, 200, 200)'
          />
        </TextInputContainer>

        <Label>Lote: </Label>
        <TextInputContainer>
          <TextInput
            value={lote}
            onChangeText={setLote}
            keyboardType="numeric"
            style={[styles.txtInput, { color: basedColor }]}
            placeholder="Ex: 7234923"
            placeholderTextColor='rgb(200, 200, 200)'
          />
        </TextInputContainer>

        <Label>Quantidade de cada frasco: </Label>

        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10}}>

            <TextInputContainer>
              <TextInput
                value={quantidadeUnitario}
                onChangeText={setQuantidadeUnitario}
                keyboardType="numeric"
                maxLength={4}
                style={[styles.txtInput, { width: 100, color: basedColor }]}
                placeholder="Ex: 120"
                placeholderTextColor='rgb(200, 200, 200)'
              />
            </TextInputContainer>
        
          <View style={{ width: 100, alignItems: 'center' }}>
            <TextInputContainer>
              <TextInput
                value={sufixo}
                onChangeText={setSufixo}
                style={[styles.txtInput, { width: 100, color: basedColor }]}
                autoCapitalize="none"
                placeholder="Ex: ml"
                maxLength={8}
                placeholderTextColor='rgb(200, 200, 200)'
              />
            </TextInputContainer>
          </View>
        </View>
        <Label>Quantidade de frascos: </Label>
        <TextInputContainer>
          <TextInput
            value={quantidadeFrascos}
            onChangeText={setQuantidadeFrascos}
            style={[styles.txtInput, { color: basedColor }]}
            placeholder="Ex: 2"
            maxLength={3}
            keyboardType="numeric"
            placeholderTextColor='rgb(200, 200, 200)'
          />
        </TextInputContainer>

        <Label>Validade: </Label>
        <TextInputContainer>
          <MaskedTextInput
            mask="99-99-9999"
            placeholder="Ex: 01-01-2021"
            placeholderTextColor='rgb(200, 200, 200)'
            onChangeText={setValidade}
            value={validade}
            keyboardType="numeric"
            style={[styles.txtInput, { color: basedColor }]}
          />
        </TextInputContainer>

        <Label>Localização: </Label>
        <TextInputContainer>
          <TextInput
            value={localizacao}
            onChangeText={setLocalizacao}

            placeholder="Ex: Armário de Reagentes"
            placeholderTextColor='rgb(200, 200, 200)'
            style={[styles.txtInput, { color: basedColor }]}
          />
        </TextInputContainer>

        <View style={{ alignItems: 'center', width: '100%', marginVertical: 15 }}>
          <TouchableOpacity
            //disabled={true}
            onPress={() => {
              if (!nomeReagente) {
                Alert.alert('Atenção', 'Por favor preencha o nome do Reagente!');
                return;
              }
              if (!lote) {
                Alert.alert('Atenção', 'Por favor preencha o número de lote');
                return;
              }
              if (!quantidadeUnitario) {
                Alert.alert('Atenção', 'Por favor preencha a quantidade de cada frascos');
                return;
              }
              if (quantidadeUnitario == 0 || quantidadeUnitario < 0) {
                Alert.alert('Atenção', 'Por favor preencha a quantidade de cada frasco corretamente');
                return;
              }
              if (!sufixo) {
                Alert.alert('Atenção', 'Por favor preencha a unidade de medida');
                return;
              }
              if (!quantidadeFrascos) {
                Alert.alert('Atenção', 'Por favor preencha a quantidade de frascos');
                return;
              }
              if (quantidadeFrascos == 0 || quantidadeFrascos < 0) {
                Alert.alert('Atenção', 'Por favor preencha a quantidade de frascos corretamente');
                return;
              }
              if (!validade) {
                Alert.alert('Atenção', 'Por favor preencha validade');
                return;
              }
              insertDatas();
              Alert.alert('Sucesso', 'Reagentes Cadastrados com sucesso');
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
              <Text style={{ fontSize: 16, color: '#fff' }}>Cadastrar Reagentes</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ height: 100 }}>
        </View>
      </ScrollView>
    </Container>
  );

}

const styles = StyleSheet.create({
  headerReagentes: {
    backgroundColor: 'rgb(255, 255, 255)',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleHeader: {
    fontWeight: '500',
    fontSize: 17,
  },
  txtInput: {
    padding: 7,
  },
  titleinput: {
    marginTop: 10,
    marginHorizontal: 16,
  },
  image: {
    height: 20,
    width: 20,
    marginHorizontal: 16,
  },
  button: {
    height: 45,
    width: 230,
    backgroundColor: 'rgb(0, 140, 255)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  }
});
