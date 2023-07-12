import React ,{ useState, useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal, Button, ScrollView, Switch, TextInput, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaskedTextInput } from 'react-native-mask-text';

import { DatabaseConnection } from '../../src/databases/DatabaseConnection';
const dbreagent = DatabaseConnection.getConnectionDBReagent();

export default function EditarReagentes({route, navigation}){

  const dataparms = route.params
  const id = route.params.selectedItem?.id
  const [data, setData] = useState([]);
  const [modalVisibleRename, setModalVisibleRename] = useState(false);

  const[nomeReagente, setNomeReagente] = useState('')
  const[lote, setLote ] = useState('')
  const[quantidadeUnitario, setQuantidadeUnitario] = useState('')
  const[validade, setValidade] = useState('')
  const[localizacao, setLocalizacao] = useState('')
  const[boolunidadeMedida, setBoolUnidadeMedida] = useState(false);
  const[sufixo, setSufixo] = useState('ml');
  const[quantidadeFrascos, setQuantidadeFrascos] = useState('')
  const[quantidadeCalculada, setQuantidadeCalculada] = useState('')

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
      <Text style={{textAlign: 'center'}}>Reagente: {dataparms.selectedItem?.nome}</Text>
      
      <TouchableOpacity
        onPress={()=>{setModalVisibleRename(true)}}
      >
        <Text>{id}</Text>
        <Text>Editar nome, lote, validade, localização ou unidade de medida</Text>
      </TouchableOpacity>

      <Text>Modificar a quantidade do reagente no estoque</Text>
      <Text>Adicionar frascos no lote</Text>

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

            <Text style={styles.titleinput}>Unidade de medida do lote: </Text>
            
            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',}}>
              <Text>{sufixo}</Text>
              <View style={{width: 100, alignItems: 'center'}}>
              <Switch
                value={boolunidadeMedida}
                onValueChange={setBoolUnidadeMedida}
              />
              </View>
            </View>
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
                  if(!quantidadeFrascos){
                    Alert.alert('Atenção','Por favor preencha a quantidade de frascos');
                    return;
                  }
                  if(!validade){
                    Alert.alert('Atenção','Por favor preencha validade');
                    return;
                  }
                  Alert.alert('Sucesso','Dados com sucesso');

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

            <TouchableOpacity onPress={() => {setModalVisibleRename(false)}} style={{position: 'absolute', top: -9, right: 7, padding: 5}}>
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

