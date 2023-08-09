//Importações dos Core Components do React e do React Native
import { React, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, Ionicons, Feather, AntDesign } from 'react-native-vector-icons';

//Importações para a navegação - React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//Reagentes - Importações de telas
import TelaReagentes from './components/reagentes/TelaReagentes';
import CadastroReagentes from './components/reagentes/CadastroReagentes';
import EditarReagentes from './components/reagentes/EditarReagentes';

//Vidrarias - Importação de telas
import TelaVidrarias from './components/vidrarias/TelaVidrarias';
import CadastroVidrarias from './components/vidrarias/CadastroVidrarias';

//Equipamentos - Importação de telas
import TelaEquipamentos from './components/equipamentos/TelaEquipamentos';
import CadastroEquipamentos from './components/equipamentos/CadastroEquipamentos';

//Card personalizado
import CardProduct from './components/CardProduct';
import Validity from './components/Validade';
import Graficos from './components/Graficos';
import DrawerApp from './components/DrawerApp';

//Outras Telas
import TelaValidadeEquipamentos from './components/TelaValidadeEquipamentos';
import TelaValidadeReagentes from './components/TelaValidadeReagentes';

//Criação de pilhas
const StackMain = createDrawerNavigator();
const StackReagents = createStackNavigator();
const StackGlasswares = createStackNavigator();
const StackEquipments = createStackNavigator();
const StackValidity = createMaterialTopTabNavigator();

function NavValidade({navigation}){
  return(
    <StackValidity.Navigator>
      <StackValidity.Screen
        name="ValidadeEquipamentos" 
        component={TelaValidadeEquipamentos}
        options={{
          title: 'Equipamentos', 
        }}
      />
      <StackValidity.Screen
        name="ValidadeReagentes" 
        component={TelaValidadeReagentes}
        options={{
          title: 'Reagentes', 
        }}
      />
    </StackValidity.Navigator>
  )
}

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
          title: 'Cadastrar Vidrarias',
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
    <StackGlasswares.Screen
        name="CadastroEquipamentos" 
        component={CadastroEquipamentos}
        options={{
          title: 'Cadastrar Equipamentos',
        }}
      />
  </StackEquipments.Navigator>
  )
}

function TelaHome( { navigation }){

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
    });
    unsubscribe;
}, [navigation]);

  return(
    <View>
      <ScrollView>
      <View style={styles.conteinerHeader}>
        <LinearGradient
        colors={['rgb(255, 255, 255)', "#54f000"]}
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
        <Validity navigation={navigation}/>
      </View>
      <View style={styles.conteinerGraficos}>
        <Graficos navigation={navigation}/>
      </View>
      </ScrollView>
    </View>
  )
}


function Settings(){
  return <><Text>Settings</Text></>
}

export default function App() {
  return (
    <NavigationContainer>
      <StackMain.Navigator 
        drawerContent={(props) => <DrawerApp {...props}
        screenOptions={{

        }}
      />}>
        <StackMain.Screen
        name="TelaHome"
        component={TelaHome}
        options={{
          title: "Tela inicial",
          headerStyle: {
            backgroundColor: "#54F000",
            shadowRadius: 30,
            shadowColor: '#000',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold'
          },
          headerRight: ()=>(
            <View style={{padding: 10}}>
              <Feather name='help-circle' size={22} color='#000'/>
            </View>
          ),
          drawerIcon: ({color})=>(
            <Entypo name='home' size={22} color={color}/>
          ),
          drawerLabelStyle:{
            marginLeft: -20,
            fontWeight: 'bold',
            fontSize: 15
          },
          drawerActiveTintColor: "#FFF",
          drawerActiveBackgroundColor: "#54B000",
          drawerInactiveTintColor: "#333"
        }}
       />
       <StackMain.Screen
        name="NavReagentes"
        component={NavReagentes}
        options={{
          headerShown: false,
          title: 'Reagentes', 
          drawerIcon: ({color})=>(<Entypo name='list' size={22} color={color}/>),
          drawerLabelStyle:{marginLeft: -20},
          drawerActiveTintColor: "#FFF",
          drawerActiveBackgroundColor: "#54B000"
        }}
       />
       <StackMain.Screen
        name="NavVidrarias"
        component={NavVidrarias}
        options={{
          headerShown: false,
          title: 'Vidrarias', 
          drawerIcon: ({color})=>(<Entypo name='list' size={22} color={color}/>),
          drawerLabelStyle:{marginLeft: -20},
          drawerActiveTintColor: "#FFF",
          drawerActiveBackgroundColor: "#54B000"
        }}
       />
       <StackMain.Screen
        name="NavEquipamentos"
        component={NavEquipamentos}
        options={{
          headerShown: false,
          title: 'Equipamentos',
          drawerIcon: ({color})=>(<Entypo name='list' size={22} color={color}/>),
          drawerLabelStyle:{marginLeft: -20},
          drawerActiveTintColor: "#FFF",
          drawerActiveBackgroundColor: "#54B000"
        }}
       />
       <StackMain.Screen
        name="NavValidade"
        component={NavValidade}
        options={{
          title: 'Controle de validade',
          drawerIcon: ({color})=>(<AntDesign name='clockcircleo' size={22} color={color}/>),
          drawerLabelStyle:{marginLeft: -20},
          drawerActiveTintColor: "#FFF",
          drawerActiveBackgroundColor: "#54B000"
        }}
       />
       <StackMain.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Configurações',
          drawerIcon: ({color})=>(<Ionicons name='settings-sharp' size={22} color={color}/>),
          drawerLabelStyle:{marginLeft: -20},
          drawerActiveTintColor: "#FFF",
          drawerActiveBackgroundColor: "#54B000"
        }}
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
    height: 170,
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
