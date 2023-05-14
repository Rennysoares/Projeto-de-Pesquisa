import { React, useState } from 'react'
import {Text,View,StyleSheet,Image, FlatList, BackHandler, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions } from '@react-navigation/native';

const DATA = [
  {
    batch: '1',
    title: 'Ácido Sulfúrico',
    validity: '02/05/2024',
    amount: '2',
  },
  {
    batch: '2',
    title: 'Ácido Clorídrico',
    validity: '02/05/2024',
    amount: '2',
  },
  {
    batch: '3',
    title: 'Monóxido de carbono',
    validity: '02/05/2024',
    amount: '2',
  },
  {
    batch: '4',
    title: 'Alaranjado de ....',
    validity: '02/05/2024',
    amount: '2',
  },
];

const Item = ({title, validity}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.title}>{validity}</Text>
  </View>
);



export default function TelaReagentes({ navigation }){
  const [searchText, setSearchText] = useState('');
  return(
    <SafeAreaView>
    <View style={styles.headerReagentes}>
    <TouchableOpacity
      onPress={()=>{navigation.openDrawer();}}
    >
    <Image
      source={require('../../assets/bardrawernavigation.png')}
      style={{
        height: 35,
        width: 35,
        marginHorizontal: 16,
      }}
    />
    </TouchableOpacity>
    <Text style={styles.titleHeader}>Gerenciamento de Reagentes</Text>
    <TouchableOpacity
          onPress={()=>{navigation.dispatch(StackActions.pop(1))}}>
          <Image
            source={require('../../assets/setanavigator.png')}
            style={styles.image}
          />
        </TouchableOpacity>
    </View>
    <FlatList
      data={DATA}
      renderItem={({item}) => <Item title={item.title} validity={item.validity}/>}
      keyExtractor={item => item.id}
    />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 15,
  },
  headerReagentes:{
    backgroundColor: 'rgb(255, 255, 255)',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleHeader:{
    fontWeight: '500',
    fontSize: 17,
  },
  image:{
    height: 25,
    width: 25,
    marginHorizontal: 16,
  }
});