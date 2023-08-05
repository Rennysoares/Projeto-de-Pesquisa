//Importações dos Core Components do React e do React Native
import { React, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

//Importações para a navegação - React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

//Reagentes - Importações de telas
import TelaReagentes from './components/reagentes/TelaReagentes';
import CadastroReagentes from './components/reagentes/CadastroReagentes';
import EditarReagentes from './components/reagentes/EditarReagentes';

//Vidrarias - Importação de telas
import TelaVidrarias from './components/vidrarias/TelaVidrarias';
import CadastroVidrarias from './components/vidrarias/CadastroVidrarias';

//Equipamentos - Importação de telas
import TelaEquipamentos from './components/equipamentos/TelaEquipamentos';

//Card personalizado
import CardProduct from './components/CardProduct';
import Validity from './components/Validade';
import Graficos from './components/Graficos';
import DrawerApp from './components/DrawerApp';

const StackMain = createDrawerNavigator();

const StackReagents = createStackNavigator();
const StackGlasswares = createStackNavigator();
const StackEquipments = createStackNavigator();

function NavReagentes({ navigation }){
  return(
      <StackReagents.Navigator initialRouteName="Home">
      <StackReagents.Screen 
      name="Home" 
      component={TelaReagentes}
      options={{
        title: 'Consultar Reagentes',
        headerLeft:()=>(
          <TouchableOpacity
            onPress={()=>{navigation.goBack();}}>
            <Image
              source={require('./assets/setanavigator.png')}
              style={styles.seta}
            />
          </TouchableOpacity>
        ),
      }}
      />
      <StackReagents.Screen 
      name="CadastroReagentes" 
      component={CadastroReagentes}
      options={{
        title: 'Cadastrar reagentes', 
      }}
      
      />
      <StackReagents.Screen 
      name="EditarReagentes" 
      component={EditarReagentes}
      />
    </StackReagents.Navigator>
  )
}

function NavVidrarias({navigation}){
  return(
    <StackGlasswares.Navigator>
      <StackGlasswares.Screen
        name="Home" 
        component={TelaVidrarias}
        options={{
          title: 'Consultar Vidrarias',
          headerLeft:()=>(
            <TouchableOpacity
              onPress={()=>{navigation.goBack();}}>
              <Image
                source={require('./assets/setanavigator.png')}
                style={styles.seta}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <StackGlasswares.Screen
        name="CadastroVidrarias" 
        component={CadastroVidrarias}
        options={{
          title: 'Cadastrar reagentes',
        }}
      />
    </StackGlasswares.Navigator>
  )
}

function NavEquipamentos({navigation}){
  return (
  <StackEquipments.Navigator initialRouteName="Home">
    <StackEquipments.Screen
      name="Home"
      component={TelaEquipamentos}
      options={{
        title: 'Consultar Equipamentos',
        headerLeft:()=>(
          <TouchableOpacity
            onPress={()=>{navigation.goBack();}}>
            <Image
              source={require('./assets/setanavigator.png')}
              style={styles.seta}
            />
          </TouchableOpacity>
        ),
      }}
    />
  </StackEquipments.Navigator>
  )
}
function TelaHome( { navigation }){

  return(
    <View>
      <ScrollView>
      <View style={styles.conteinerHeader}>
        <LinearGradient
        colors={['rgb(255, 255, 255)', 'rgb(0, 210, 0)']}
        start={{x: 0, y: 0}}
        end={{x: 0.5, y: 0.5}}
        style={styles.linearGradient}
        />
        <View style={styles.conteinerTextHeader}>
          <Text style={styles.titleTop}>Bem vindo ao</Text>
          <Text style={styles.titleNameApp}>SisLab Química</Text>
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
            navigation={navigation}
            teladenav = 'NavVidrarias'
            src={require('./assets/iconstypeitem/glassware.png')}
            />
            <CardProduct
            tipoProduto="Equipamentos"
            navigation={navigation}
            teladenav = 'NavEquipamentos'
            src={require('./assets/iconstypeitem/equipment.png')}
            />
          </ScrollView>
        </View>
      </View>

      <View style={styles.conteinerValidade}>
        <Validity/>
      </View>
      <View style={styles.conteinerGraficos}>
        <Graficos/>
      </View>
      </ScrollView>
    </View>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <StackMain.Navigator drawerContent={(props) => <DrawerApp {...props} />}>
        <StackMain.Screen
        name="TelaHome"
        component={TelaHome}
        options={{
          title: "Tela inicial",
          headerStyle: {
            backgroundColor: 'rgb(0, 210, 0)',
            shadowRadius: 30,
            shadowColor: '#000',
            shadowOpacity: 0.8,
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold'
          },
        }}
       />
       <StackMain.Screen
        name="NavReagentes"
        component={NavReagentes}
        options={{headerShown: false}}
       />
       <StackMain.Screen
        name="NavVidrarias"
        component={NavVidrarias}
        options={{headerShown: false}}
       />
       <StackMain.Screen
        name="NavEquipamentos"
        component={NavEquipamentos}
        options={{headerShown: false}}
       />
      </StackMain.Navigator>
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
    fontSize: 23,
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
    padding: 15,
  },
  seta:{
    height: 20,
    width: 20,
    marginHorizontal: 16,
  },
  conteinerGraficos:{
    alignItems: 'center'
  }
});
