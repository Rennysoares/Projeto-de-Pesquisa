//Importações dos Core Components do React e do React Native
import { React, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import { Entypo, Ionicons, Feather, AntDesign } from 'react-native-vector-icons';

//Importações para a navegação - React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//Import Main Screens
import Home from '../pages/main/Home';
import Settings from '../pages/main/Settings';
import DrawerTab from '../components/DrawerTab';
//Children routes
import RouteReagents from './RouteReagents';
import RouteGlasswares from './RouteGlasswares';
import RouteEquipments from './RouteEquipments';
import RouteValidity from './RouteValidity';

const StackMain = createDrawerNavigator();

export default function RouteMain(){
    return(
        <StackMain.Navigator 
        drawerContent={(props) => <DrawerTab {...props}
        screenOptions={{

        }}
      />}>
        <StackMain.Screen
        name="Home"
        component={Home}
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
        name="RouteReagents"
        component={RouteReagents}
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
        name="RouteGlasswares"
        component={RouteGlasswares}
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
        name="RouteEquipments"
        component={RouteEquipments}
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
        name="RouteValidity"
        component={RouteValidity}
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
    )
}