import React ,{ useState, useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal, Button, ScrollView, Switch, TextInput, Alert} from 'react-native';
import moment from 'moment';
import { MaskedTextInput } from 'react-native-mask-text';
import { Ionicons } from 'react-native-vector-icons';
import { DatabaseConnection } from '../../../src/databases/DatabaseConnection';
const database = DatabaseConnection.getConnectionDatabase();

export default function EditReagent({route, navigation}){

  const [modalVisibleRename, setModalVisibleRename] = useState(false);
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [modalVisibleAdd, setModalVisibleAdd] = useState(false)

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
  const[quantidadeFrascosAdicionais, setQuantidadeFrascosAdicionais] = useState('');

  
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
    database.transaction((tx) => {
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

  function updateData_Add(){
    database.transaction((tx) => {
      tx.executeSql(
        'UPDATE lote SET quantidade_geral = ?, quantidade_frascos = ? WHERE id = ?;',
        [parseFloat(quantidade_geral_params) + (parseFloat(quantidadeFrascosAdicionais)*parseFloat(quantidade_unitario_params)), 
          parseInt(quantidade_frascos_params) + parseInt(quantidadeFrascosAdicionais), 
          id_params],
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
    <View>
      <ScrollView>
      <View style={{alignItems: 'center', gap: 20, flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 10,flexWrap: 'wrap', justifyContent: 'center'}}>
        <TouchableOpacity
          onPress={()=>{setModalVisibleRename(true); setAllDatas()}}
        >
          <View style={styles.button}>
            <Image
                source={require("../../../assets/iconedit2.png")}
                style={{height: 70, width: 70}}
            />
            <Text style={{fontSize: 16, color: '#fff', fontWeight: 'bold', textAlign: 'center'}}>Editar Dados</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={()=>{setModalVisibleUpdate(true); setUpdateQtdeGeral()}}
        >
          <View style={styles.button}>
          <Image
                source={require("../../../assets/update.png")}
                style={{height: 70, width: 70}}
            />
            <Text style={{fontSize: 16, color: '#fff', fontWeight: 'bold', textAlign: 'center'}}>Atualizar estoque</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={()=>{setModalVisibleAdd(true)}}
        >
          <View style={styles.button}>
          <Image
                source={require("../../../assets/addreagent.png")}
                style={{height: 70, width: 70}}
            />
            <Text style={{fontSize: 16, color: '#fff', fontWeight: 'bold', textAlign: 'center'}}>Adicionar Frascos</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={()=>{}}
        >
          <View style={styles.button}>
          <Image
                source={require("../../../assets/iconremove.png")}
                style={{height: 70, width: 70}}
            />
            <Text style={{fontSize: 16, color: '#fff', fontWeight: 'bold', textAlign: 'center'}}>Remover Quantidade</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{gap: 10, padding: 10, borderColor: '#000', borderWidth: 1, margin: 10}}>
        <Text style={{fontSize: 16, textAlign: 'center'}}>Informações do Reagente</Text>

        <View>
          <Text style={{fontSize: 16}}>Nome: </Text>
          <Text style={{fontSize: 16}}>{nome_params}</Text>
        </View>

        <View>
          <Text style={{fontSize: 16}}>Lote: </Text>
          <Text style={{fontSize: 16}}>{lote_params}</Text>
        </View>

        <View>
          <Text style={{fontSize: 16}}>Quantidade de Frascos: </Text>
          <Text style={{fontSize: 16}}>{quantidade_frascos_params}</Text>
        </View>

        <View>
          <Text style={{fontSize: 16}}>Quantidade Unitário: </Text>
          <Text style={{fontSize: 16}}>{quantidade_unitario_params}</Text>
        </View>

        <View>
          <Text style={{fontSize: 16}}>Quantidade Total: </Text>
          <Text style={{fontSize: 16}}>{quantidade_geral_params + unidade_medida_params}</Text>
        </View>

        <View>
          <Text style={{fontSize: 16}}>Validade: </Text>
          <Text style={{fontSize: 16}}>{moment(validade_params, "YYYY/MM/DD").format("DD-MM-YYYY")}</Text>
        </View>

        <View>
          <Text style={{fontSize: 16}}>Localização: </Text>
          <Text style={{fontSize: 16}}>{localizacao_params}</Text>
        </View>
      </View>
      </ScrollView>
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
                  Alert.alert('Sucesso','Dados editados com sucesso');
                  setModalVisibleRename(false)
                  navigation.goBack();
                }}
              >
                <View style={styles.buttonModal}>
                  <Text style={{fontSize: 16, color: '#fff'}}>Editar Dados</Text>
                </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <TouchableOpacity onPress={() => {setModalVisibleRename(false)}} style={{position: 'absolute', top: 0, right: 0, padding: 5}}>
              <Ionicons name='close' size={30} color={'rgb(0, 0, 0)'}/>
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
                if (parseFloat(quantidadeGeral) < 0){
                  Alert.alert('Atenção','Insira a quantidade geral corretamente');
                  return;
                }
                updateData_Update()
                setModalVisibleUpdate(false);
                navigation.goBack();
                
              }}
            >
              <View style={styles.buttonModal}>
                <Text style={{fontSize: 16, color: '#fff'}}>Atualizar estoque</Text>
              </View>
            </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => {setModalVisibleUpdate(false)}} style={{position: 'absolute', top: 0, right: 0, padding: 5}}>
              <Ionicons name='close' size={30} color={'rgb(0, 0, 0)'}/>
            </TouchableOpacity>
          </View>  
        </View>
      </Modal>
      <Modal
        visible={modalVisibleAdd}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.centermodal}>
          <View style={styles.modal}>
            <Text>Adicionar Frascos</Text>
            <Text style={styles.titleinput}>Quantos frascos serão adicionados? </Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <TextInput
                value={quantidadeFrascosAdicionais}
                onChangeText={setQuantidadeFrascosAdicionais}
                keyboardType="numeric"
                maxLength={3}
                style={[styles.txtInput, {width: '100%'}]}
                placeholder="Ex: 2"
                placeholderTextColor='rgb(200, 200, 200)'
              />
            </View>
            <View style={{alignItems: 'center', width: '100%'}}>
            <TouchableOpacity
              onPress={()=>{
                if(!quantidadeFrascosAdicionais){
                  Alert.alert('Atenção','Insira a quantidade de frascos adicionais');
                  return;
                }
                if(quantidadeFrascosAdicionais == 0){
                  Alert.alert('Atenção','Insira a quantidade de frascos adicionais');
                  return;
                }
                updateData_Add()
                setModalVisibleAdd(false);
                navigation.goBack();
              }}
            >
              <View style={styles.buttonModal}>
                <Text style={{fontSize: 16, color: '#fff'}}>Adicionar Frascos</Text>
              </View>
            </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => {setModalVisibleAdd(false)}} style={{position: 'absolute', top: 0, right: 0, padding: 5}}>
              <Ionicons name='close' size={30} color={'rgb(0, 0, 0)'}/>
            </TouchableOpacity>
          </View>  
        </View>
      </Modal>
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
    height:120,
    width: 120,
    backgroundColor: 'rgb(0, 140, 255)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
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
    height: 350,
    width: '75%',
    borderRadius: 15,
    rowGap: 5,
  },
  buttonModal:{
    height:45,
    width: 230,
    backgroundColor: 'rgb(0, 140, 255)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 20
  }
});

