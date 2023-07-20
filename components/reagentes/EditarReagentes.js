import React ,{ useState, useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal, Button, ScrollView, Switch, TextInput, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaskedTextInput } from 'react-native-mask-text';

import { DatabaseConnection } from '../../src/databases/DatabaseConnection';
const dbreagent = DatabaseConnection.getConnectionDBReagent();

export default function EditarReagentes({route, navigation}){

  const [modalVisibleRename, setModalVisibleRename] = useState(false);
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);

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
  const[nomeReagente, setNomeReagente] = useState('')
  const[lote, setLote ] = useState('')
  const[validade, setValidade] = useState('')
  const[localizacao, setLocalizacao] = useState('')

  //Variáveis para modificações com cálculos e sufixos
  const[quantidadeUnitario, setQuantidadeUnitario] = useState('')
  const[quantidadeFrascos, setQuantidadeFrascos] = useState('')
  const[quantidadeGeral, setQuantidadeGeral] = useState('')

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
    });
    unsubscribe;
  }, [navigation]);

  function setAllDatas(){
    setNomeReagente(nome_params);
    setLote(lote_params);
    //setValidade(validade_params);
    setLocalizacao(localizacao_params);
  }

  function setUpdateQtdeGeral(){
    setQuantidadeGeral(''+quantidade_geral_params)
  }
  function updateData_Rename(){
    console.log('Nome: ' + nomeReagente + ' Lote: ' +  lote + ' Validade: ' + validade + ' Localização: ' + localizacao)
    dbreagent.transaction((tx) => {
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
        [lote, validade, localizacao, id_params],
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
      // A transação foi concluída com sucesso
      console.log('Transação concluída com sucesso');
    });
    
  }

  function updateData_Update(){
    dbreagent.transaction((tx) => {
      tx.executeSql(
        'UPDATE lote SET quantidade_geral = ? WHERE id = ?;',
        [parseFloat(quantidadeGeral), id_params],
        (_, result) => {
          console.log('Estoque atualizado com sucesso!')
          Alert.alert('Sucesso','Estoque atualizado com com sucesso');
        },
        (_, error) => {
          console.error('Erro na atualização da Tabela lote:', error);
          Alert.alert('Erro','Erro na atualização da Tabela lote (consulte o desenvolvedor): '+ error);
          return false;
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
        <Text style={styles.titleHeader}>Editar reagente</Text>
      </View>

      <Text style={{textAlign: 'center'}}>Reagente: {nome_params}</Text>
      <Text>Id: {id_params}</Text>
      <Text>Lote: {lote_params}</Text>
      <Text>Validade: {validade_params}</Text>
      <Text>Localização: {localizacao_params}</Text>

      <View style={{alignItems: 'center', gap: 20}}>
        <TouchableOpacity
          onPress={()=>{setModalVisibleRename(true); setAllDatas()}}
        >
          <View style={styles.button}>
            <Text style={{fontSize: 16, color: '#fff'}}>Editar Dados</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={()=>{setModalVisibleUpdate(true); setUpdateQtdeGeral()}}
        >
          <View style={styles.button}>
            <Text style={{fontSize: 16, color: '#fff'}}>Atualizar estoque</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.button}>
            <Text style={{fontSize: 16, color: '#fff'}}>Adicionar Frascos</Text>
          </View>
        </TouchableOpacity>

        <Button title='Consultar Dados' onPress={()=>{console.log(route.params.selectedItem)}}/>
        <Button title='Consultar Dados' onPress={()=>{console.log(quantidade_geral_params)}}/>
      </View>

      <Modal
          visible={modalVisibleRename}
          transparent={true}
          animationType="fade"
        >
        <View style={styles.centermodal}>
          <View style={styles.modal}>
            <Text>Atualizar dados</Text>
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
                      
            <Text style={styles.titleinput}>Validade: </Text>

            <MaskedTextInput
                mask="99-99-9999"
                placeholder="Ex: 01-01-2021"
                placeholderTextColor='rgb(200, 200, 200)'
                onChangeText={setValidade}
                value={validade_params}
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
                  if(!validade){
                    Alert.alert('Atenção','Por favor preencha validade');
                    return;
                  }
                  updateData_Rename()
                  Alert.alert('Sucesso','Dados com sucesso');
                  setModalVisibleRename(false)
                  navigation.goBack();
                }}
              >
                <View style={styles.button}>
                  <Text style={{fontSize: 16, color: '#fff'}}>Editar Dados</Text>
                </View>
                </TouchableOpacity>
              </View>
              <View style={{height: 100}}>
              </View>
            </ScrollView>
            <TouchableOpacity onPress={() => {setModalVisibleRename(false)}} style={{position: 'absolute', top: -9, right: 7, padding: 5}}>
                <Text style={{fontSize: 30}}>x</Text>
            </TouchableOpacity>
          </View>  
        </View>
      </Modal>
      <Modal
        visible={modalVisibleUpdate}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.centermodal}>
          <View style={styles.modal}>
            <Text>Atualizar estoque</Text>
            <Text style={styles.titleinput}>Qual a quantidade no estoque? </Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap:10}}>
              <TextInput
                value={quantidadeGeral}
                onChangeText={setQuantidadeGeral}
                keyboardType="numeric"
                style={[styles.txtInput, {width: 100}]}
                placeholder="Ex: 120"
                placeholderTextColor='rgb(200, 200, 200)'
              />
              <Text>{unidade_medida_params}</Text>
            </View>
            <View style={{alignItems: 'center', width: '100%'}}>
            <TouchableOpacity
              onPress={()=>{
                if (parseFloat(quantidadeGeral) > parseFloat(quantidade_unitario_params) * parseFloat(quantidade_frascos_params)) {
                  Alert.alert('Atenção','A quantidade é muito superior do que o estipulado');
                  return;
                }
                updateData_Update()
                setModalVisibleUpdate(false);
                  navigation.goBack();
              }}
            >
              <View style={styles.button}>
                <Text style={{fontSize: 16, color: '#fff'}}>Atualizar estoque</Text>
              </View>
            </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => {setModalVisibleUpdate(false)}} style={{position: 'absolute', top: -9, right: 7, padding: 5}}>
                <Text style={{fontSize: 30}}>x</Text>
            </TouchableOpacity>
          </View>  
        </View>
      </Modal>
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
    padding: 7,
    borderRadius: 5,
    backgroundColor: 'rgb(255, 255, 255)'
  },
  titleinput:{
    marginTop: 10,
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
  },
  centermodal:{
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  modal:{
    backgroundColor: 'rgb(245, 245, 245)',
    padding: 20,
    height: '50%',
    width: '75%',
    borderRadius: 15,
    rowGap: 5,
  },
});

