import { React, useState } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Button, BackHandler} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CadastroReagentes from './components/reagentes/CadastroReagentes';
import EditarReagentes from './components/reagentes/EditarReagentes';
import DeletarReagentes from './components/reagentes/DeletarReagentes';
import TelaReagentes from './components/reagentes/TelaReagentes';

import CardProduct from './components/CardProduct';

const Drawer = createDrawerNavigator();

function NavReagentes({ navigation }){
  return(
    <NavigationContainer independent={true}>
        <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen 
        name="Home" 
        component={TelaReagentes}
        options={{
          title: 'Consultar Reagentes',
          headerRight:()=>(
            <Button
              title='Voltar'
              onPress={()=>{navigation.goBack()}}
            />
          )
        }}
        />
        <Drawer.Screen 
        name="CadastroReagentes" 
        component={CadastroReagentes}
        options={{headerShown: false}}
        />
        <Drawer.Screen 
        name="EditarReagentes" 
        component={EditarReagentes}
        options={{title: 'Editar reagentes'}}
        />
        <Drawer.Screen 
        name="DeletarReagentes" 
        component={DeletarReagentes}
        options={{title: 'Deletar reagentes'}}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

const Pilha = createStackNavigator();

function TelaHome( { navigation }){
  return(
    <SafeAreaView>
      <View style={styles.conteinerHeader}>
        <LinearGradient
        colors={['rgb(255, 255, 255)', 'rgb(0, 255, 0)']}
        start={{x: 0, y: 0}}
        end={{x: 0.5, y: 0.5}}
        style={styles.linearGradient}
        />
        <View style={styles.conteinerTextHeader}>
          <Text style={styles.titleTop}>Bem vindo ao</Text>
          <Text style={styles.titleNameApp}>Nome do App!</Text>
          <Text style={styles.subtitle}>App para gerenciamento dos estoques do IFAM</Text>
        </View>
        <View style={styles.conteinerImage}>
          <Image
            style={{height: 100, width: 100}}
            source={require('./assets/iconhome.png')}
          />
        </View>
      </View>

      <View style={styles.conteinerProducts}>
        <Text>Selecione o tipo de produto a ser gerenciado:</Text>
        <View style={styles.conteinerCards}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <CardProduct
            tipoProduto="Reagentes"
            navigation={navigation}
            teladenav = 'NavReagentes'
            src={require('./assets/iconstypeitem/reagent.png')}
            />
            <CardProduct
            tipoProduto="Vidrarias"
            //navigation={navigation}
            //teladenav = 'TextNav'
            src={require('./assets/iconstypeitem/glassware.png')}
            />
            <CardProduct
            tipoProduto="Equipamentos"
            //navigation={navigation}
            //teladenav = 'TextNav'
            src={require('./assets/iconstypeitem/equipment.png')}
            />
          </ScrollView>
        </View>
      </View>

      <View style={styles.conteinerValidade}>
        <View style={styles.miniHeader}>
          <Text>Controle de Validade de estoque</Text>
          <Text>Exibir todos</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Pilha.Navigator>
        <Pilha.Screen
        name="TelaHome"
        component={TelaHome}
        options={{headerShown: false}}
       />
       <Pilha.Screen
        name="NavReagentes"
        component={NavReagentes}
        options={{headerShown: false}}
       />
      </Pilha.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  conteinerHeader:{
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 150,
  },
  linearGradient:{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  conteinerTextHeader:{
    width: 180
  },
  conteinerImage:{
    position: 'relative'
  },
  titleTop:{
    color: '#000',
    fontSize: 14
  },
  titleNameApp:{
    color: '#000',
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 6,
    paddingBottom: 6
  },
  subtitle:{
    color: '#000',
    fontSize: 11
  },
  conteinerProducts:{
    padding: 15
  },
  conteinerCards:{
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    paddingTop: 10,
    paddingBottom: 10
  },
  conteinerValidade:{
    padding: 15
  },
  miniHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
