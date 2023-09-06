import React, { useState, useEffect, useContext } from 'react';
import ThemeContext from '../../context/ThemeContext';
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, TextInput, Alert } from 'react-native';
import moment from 'moment';

import {
  Container,
  RegularText,
  TextInputContainer
} from '../../styles/CommonStyles';

import {
  CenterModal,
  ContainerModalEdit
} from '../../styles/reagents/StylesReagents';
import { MaskedTextInput } from 'react-native-mask-text';
import { Ionicons } from 'react-native-vector-icons';
import { DatabaseConnection } from '../../../src/databases/DatabaseConnection';
const database = DatabaseConnection.getConnectionDatabase();

export default function EditReagent({ route, navigation }) {

  const { theme, color } = useContext(ThemeContext);
  const basedColor = theme == 'dark' ? '#FFF' : '#000';

  const [modalVisibleRename, setModalVisibleRename] = useState(false);
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [modalVisibleAdd, setModalVisibleAdd] = useState(false);
  const [modalVisibleRemove, setModalVisibleRemove] = useState(false);

  //Dados passados por parâmetros (dados qualitativos)
  const id_params = route.params.selectedItem?.id
  const nome_params = route.params.selectedItem?.nome
  const lote_params = route.params.selectedItem?.numero
  const validade_params = route.params.selectedItem?.validade
  const localizacao_params = route.params.selectedItem?.localizacao

  ////Dados passados por parâmetros (dados quantitativos)
  const quantidade_unitario_params = route.params.selectedItem?.quantidade_unitario
  const quantidade_frascos_params = route.params.selectedItem?.quantidade_frascos
  const quantidade_geral_params = route.params.selectedItem?.quantidade_geral
  const unidade_medida_params = route.params.selectedItem?.unidade_medida

  //Variáveis para modificações simples
  const [nomeReagente, setNomeReagente] = useState('')
  const [lote, setLote] = useState('')
  const [validade, setValidade] = useState('')
  const [localizacao, setLocalizacao] = useState('')

  //Variáveis para modificações com cálculos e sufixos
  const [quantidadeUnitario, setQuantidadeUnitario] = useState('')
  const [quantidadeFrascos, setQuantidadeFrascos] = useState('')
  const [quantidadeGeral, setQuantidadeGeral] = useState('')
  const [quantidadeFrascosAdicionais, setQuantidadeFrascosAdicionais] = useState('');
  const [quantidadeGeralRemocao, setQuantidadeGeralRemocao] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
    });
    unsubscribe;
  }, [navigation]);

  function setAllDatas() {
    setNomeReagente(nome_params);
    setLote(lote_params);
    //setValidade(validade_params);
    setLocalizacao(localizacao_params);
  }

  function updateData_Remove() {
    database.transaction((tx) => {
      tx.executeSql(
        'UPDATE lote SET quantidade_geral = ? WHERE id = ?;',
        [parseFloat(quantidade_geral_params) - parseFloat(quantidadeGeralRemocao), id_params],
        (_, result) => {
          Alert.alert('Sucesso', 'Parte do estoque removido com sucesso');
        },
        (_, error) => {
          console.error('Erro na atualização da Tabela produto:', error);
          return false;
        }
      );
    });
  }
  function setUpdateQtdeGeral() {
    setQuantidadeGeral('' + quantidade_geral_params)
  }

  function updateData_Rename() {
    console.log('Nome: ' + nomeReagente + ' Lote: ' + lote + ' Validade: ' + validade + ' Localização: ' + localizacao)
    database.transaction((tx) => {
      tx.executeSql(
        'UPDATE produto SET nome = ? WHERE id = ?;',
        [nomeReagente, id_params],
        (_, result) => {
        },
        (_, error) => {
          console.error('Erro na atualização da Tabela produto:', error);
          return false;
        }
      );

      tx.executeSql(
        'UPDATE lote SET numero = ?, validade = ?, localizacao = ? WHERE id = ?;',
        [lote, moment(validade, "DD-MM-YYYY").format("YYYY-MM-DD"), localizacao, id_params],
        (_, result) => {
        },
        (_, error) => {
          console.error('Erro na atualização da Tabela lote:', error);
          return false;
        }
      );
    }, (error) => {
      // Trate o erro da transação
      console.error('Erro na transação:', error);
    }, () => {
      Alert.alert('Sucesso', 'Dados editados com com sucesso');
      console.log('Transação concluída com sucesso');
    });

  }

  function updateData_Update() {
    database.transaction((tx) => {
      tx.executeSql(
        'UPDATE lote SET quantidade_geral = ? WHERE id = ?;',
        [parseFloat(quantidadeGeral), id_params],
        (_, result) => {
          console.log('Estoque atualizado com sucesso!')
          Alert.alert('Sucesso', 'Estoque atualizado com com sucesso');
        },
        (_, error) => {
          console.error('Erro na atualização da Tabela lote:', error);
          Alert.alert('Erro', 'Erro na atualização da Tabela lote (consulte o desenvolvedor): ' + error);
          return false;
        }
      );
    });

  }

  function updateData_Add() {
    database.transaction((tx) => {
      tx.executeSql(
        'UPDATE lote SET quantidade_geral = ?, quantidade_frascos = ? WHERE id = ?;',
        [parseFloat(quantidade_geral_params) + (parseFloat(quantidadeFrascosAdicionais) * parseFloat(quantidade_unitario_params)),
        parseInt(quantidade_frascos_params) + parseInt(quantidadeFrascosAdicionais),
          id_params],
        (_, result) => {
          console.log('Estoque atualizado com sucesso!')
          Alert.alert('Sucesso', 'Estoque atualizado com com sucesso');
        },
        (_, error) => {
          console.error('Erro na atualização da Tabela lote:', error);
          Alert.alert('Erro', 'Erro na atualização da Tabela lote (consulte o desenvolvedor): ' + error);
          return false;
        }
      );
    });
  }
  return (
    <Container>
      <ScrollView>
        <RegularText style={{ textAlign: 'center', padding: 10 }}>
          Selecione a opção desejada:
        </RegularText>
        <View style={{ alignItems: 'center', gap: 20, paddingVertical: 10, paddingHorizontal: 10, justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => { setModalVisibleRename(true); setAllDatas() }}
          >
            <View style={styles.button}>
              <Image
                source={require("../../../assets/iconedit2.png")}
                style={{ height: 70, width: 70, margin: 4 }}
              />
              <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Editar Dados</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { setModalVisibleUpdate(true); setUpdateQtdeGeral() }}
          >
            <View style={styles.button}>
              <Image
                source={require("../../../assets/update.png")}
                style={{ height: 70, width: 70 }}
              />
              <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Atualizar estoque</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { setModalVisibleAdd(true) }}
          >
            <View style={styles.button}>
              <Image
                source={require("../../../assets/addreagent.png")}
                style={{ height: 70, width: 70 }}
              />
              <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Adicionar Frascos</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { setModalVisibleRemove(true) }}
          >
            <View style={styles.button}>
              <Image
                source={require("../../../assets/iconremove.png")}
                style={{ height: 70, width: 70 }}
              />
              <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Remover Quantidade</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ gap: 10, padding: 10, borderColor: `${theme == 'dark' ? '#FFF' : '#000'}`, borderWidth: 1, margin: 10, borderRadius: 5 }}>
          <RegularText style={{ textAlign: 'center' }}>Informações do Reagente</RegularText>

          <View>
            <RegularText>Nome: </RegularText>
            <RegularText>{nome_params}</RegularText>
          </View>

          <View>
            <RegularText>Lote: </RegularText>
            <RegularText>{lote_params}</RegularText>
          </View>

          <View>
            <RegularText>Quantidade de Frascos: </RegularText>
            <RegularText>{quantidade_frascos_params}</RegularText>
          </View>

          <View>
            <RegularText>Quantidade Unitário: </RegularText>
            <RegularText>{quantidade_unitario_params}</RegularText>
          </View>

          <View>
            <RegularText>Quantidade Total: </RegularText>
            <RegularText>{quantidade_geral_params + unidade_medida_params}</RegularText>
          </View>

          <View>
            <RegularText>Validade: </RegularText>
            <RegularText>{moment(validade_params, "YYYY/MM/DD").format("DD-MM-YYYY")}</RegularText>
          </View>

          <View>
            <RegularText>Localização: </RegularText>
            <RegularText>{localizacao_params}</RegularText>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={modalVisibleRename}
        transparent={true}
        animationType="fade"
      >
        <CenterModal>
          <ContainerModalEdit>
            <RegularText>Atualizar dados</RegularText>
            <ScrollView>
              <RegularText>Nome do reagente: </RegularText>
              <TextInputContainer>
                <TextInput
                  value={nomeReagente}
                  onChangeText={setNomeReagente}
                  style={[styles.txtInput, { color: basedColor }]}
                  placeholder="Ex: Ácido Clorídrico"
                  placeholderTextColor='rgb(200, 200, 200)'
                />
              </TextInputContainer>
              <RegularText>Lote: </RegularText>
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
              <RegularText>Validade: </RegularText>
              <TextInputContainer>
                <MaskedTextInput
                  mask="99-99-9999"
                  placeholder="Ex: 01-01-2021"
                  placeholderTextColor='rgb(200, 200, 200)'
                  onChangeText={setValidade}
                  value={moment(validade_params, "YYYY/MM/DD").format("DD-MM-YYYY")}
                  keyboardType="numeric"
                  style={[styles.txtInput, { color: basedColor }]}
                />
              </TextInputContainer>
              <RegularText>Localização: </RegularText>
              <TextInputContainer>
                <TextInput
                  value={localizacao}
                  onChangeText={setLocalizacao}
                  placeholder="Ex: Armário de Reagentes"
                  placeholderTextColor='rgb(200, 200, 200)'
                  style={[styles.txtInput, { color: basedColor }]}
                />
              </TextInputContainer>
              <View style={{ alignItems: 'center', width: '100%' }}>
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
                    if (!validade) {
                      Alert.alert('Atenção', 'Por favor preencha validade');
                      return;
                    }
                    updateData_Rename()
                    setModalVisibleRename(false)
                    navigation.goBack();
                  }}
                >
                  <View style={styles.buttonModal}>
                    <Text style={{ fontSize: 16, color: '#fff' }}>Editar Dados</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <TouchableOpacity onPress={() => { setModalVisibleRename(false) }} style={{ position: 'absolute', top: 0, right: 0, padding: 5 }}>
              <Ionicons name='close' size={30} color={basedColor} />
            </TouchableOpacity>
          </ContainerModalEdit>
        </CenterModal>
      </Modal>
      <Modal
        visible={modalVisibleUpdate}
        transparent={true}
        animationType="fade"
      >
        <CenterModal>
          <ContainerModalEdit>
            <RegularText>Atualizar estoque</RegularText>
            <RegularText style={{ marginTop: 10 }}>Qual a quantidade no estoque? </RegularText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TextInputContainer>
                <TextInput
                  value={quantidadeGeral}
                  onChangeText={setQuantidadeGeral}
                  keyboardType="numeric"
                  style={[styles.txtInput, { width: 100, color: basedColor }]}
                  placeholder="Ex: 120"
                  placeholderTextColor='rgb(200, 200, 200)'
                />
              </TextInputContainer>
              <RegularText>{unidade_medida_params}</RegularText>
            </View>
            <RegularText style={{ marginTop: 15 }}>Quantidade Atual: {quantidade_geral_params + unidade_medida_params}</RegularText>
            <View style={{ alignItems: 'center', width: '100%' }}>
              <TouchableOpacity
                onPress={() => {
                  if (parseFloat(quantidadeGeral) > parseFloat(quantidade_unitario_params) * parseFloat(quantidade_frascos_params)) {
                    Alert.alert('Atenção', 'A quantidade é muito superior do que o estipulado');
                    return;
                  }
                  if (parseFloat(quantidadeGeral) < 0) {
                    Alert.alert('Atenção', 'Insira a quantidade geral corretamente');
                    return;
                  }
                  updateData_Update()
                  setModalVisibleUpdate(false);
                  navigation.goBack();

                }}
              >
                <View style={styles.buttonModal}>
                  <Text style={{ fontSize: 16, color: '#fff' }}>Atualizar estoque</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => { setModalVisibleUpdate(false) }} style={{ position: 'absolute', top: 0, right: 0, padding: 5 }}>
              <Ionicons name='close' size={30} color={basedColor} />
            </TouchableOpacity>
          </ContainerModalEdit>
        </CenterModal>
      </Modal>
      <Modal
        visible={modalVisibleAdd}
        transparent={true}
        animationType="fade"
      >
        <CenterModal>
          <ContainerModalEdit>
            <RegularText>Adicionar Frascos</RegularText>
            <RegularText style={{ marginTop: 10 }}>Quantos frascos serão adicionados? </RegularText>
            <TextInputContainer>
              <TextInput
                value={quantidadeFrascosAdicionais}
                onChangeText={setQuantidadeFrascosAdicionais}
                keyboardType="numeric"
                maxLength={3}
                style={[styles.txtInput, { color: basedColor }]}
                placeholder="Ex: 2"
                placeholderTextColor='rgb(200, 200, 200)'
              />
            </TextInputContainer>
            <RegularText>Obs: Será adicionado {quantidade_unitario_params+unidade_medida_params} por frasco</RegularText>
            <View style={{ alignItems: 'center', width: '100%' }}>
              <TouchableOpacity
                onPress={() => {
                  if (!quantidadeFrascosAdicionais) {
                    Alert.alert('Atenção', 'Insira a quantidade de frascos adicionais');
                    return;
                  }
                  if (quantidadeFrascosAdicionais == 0) {
                    Alert.alert('Atenção', 'Insira a quantidade de frascos adicionais');
                    return;
                  }
                  updateData_Add()
                  setModalVisibleAdd(false);
                  navigation.goBack();
                }}
              >
                <View style={styles.buttonModal}>
                  <Text style={{ fontSize: 16, color: '#fff' }}>Adicionar Frascos</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => { setModalVisibleAdd(false) }} style={{ position: 'absolute', top: 0, right: 0, padding: 5 }}>
              <Ionicons name='close' size={30} color={basedColor} />
            </TouchableOpacity>
          </ContainerModalEdit>
        </CenterModal>
        
      </Modal>
      <Modal
        visible={modalVisibleRemove}
        transparent={true}
        animationType="fade"
      >
        <CenterModal>
          <ContainerModalEdit>
            <RegularText>Remover quantidade</RegularText>
            <RegularText style={{ marginTop: 10 }}>Qual a quantidade para a remoção? </RegularText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <RegularText>-</RegularText>
              <TextInputContainer>
                <TextInput
                  value={quantidadeGeralRemocao}
                  onChangeText={setQuantidadeGeralRemocao}
                  keyboardType="numeric"
                  style={[styles.txtInput, { width: 100, color: basedColor }]}
                  placeholder="Ex: 120"
                  placeholderTextColor='rgb(200, 200, 200)'
                />
              </TextInputContainer>
              <RegularText>{unidade_medida_params}</RegularText>
            </View>
            <RegularText style={{marginTop: 15}}>Quantidade Atual: {quantidade_geral_params + unidade_medida_params}</RegularText>
            <View style={{ alignItems: 'center', width: '100%' }}>
              <TouchableOpacity
                onPress={() => {
                  if (parseFloat(quantidadeGeralRemocao) > parseFloat(quantidade_geral_params)) {
                    Alert.alert('Atenção', 'A quantidade é muito superior, insira um valor menor que' + quantidade_geral_params + ' ' + unidade_medida_params);
                    return;
                  } else if (parseFloat(quantidadeGeralRemocao < 0)) {
                    Alert.alert('Atenção', 'A quantidade não pode ser negativa, insira-o corretamente');
                    return
                  }
                  updateData_Remove()
                  setModalVisibleRemove(false);
                  navigation.goBack();

                }}
              >
                <View style={styles.buttonModal}>
                  <Text style={{ fontSize: 16, color: '#fff' }}>Remover quantidade</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => { setModalVisibleRemove(false) }} style={{ position: 'absolute', top: 0, right: 0, padding: 5 }}>
              <Ionicons name='close' size={30} color={basedColor} />
            </TouchableOpacity>
          </ContainerModalEdit>
        </CenterModal>
      </Modal>
    </Container>
  )
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
  },
  image: {
    height: 20,
    width: 20,
    marginHorizontal: 16,
  },
  button: {
    height: 100,
    width: 300,
    backgroundColor: 'rgb(0, 140, 255)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flexDirection: 'row'
  },
  buttonModal: {
    height: 45,
    width: 230,
    backgroundColor: 'rgb(0, 140, 255)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 20
  }
});

