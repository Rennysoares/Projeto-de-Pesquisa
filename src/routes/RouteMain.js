//Importações dos Core Components do React e do React Native
import { React, useState, useEffect } from 'react';
import { View } from 'react-native';
import { Entypo, Ionicons, Feather, AntDesign } from 'react-native-vector-icons';
import { forFade, forSlide } from '../animations/Animations';

import * as SecureStorage from 'expo-secure-store';

const SECURE_STORAGE_KEY = 'selectedTheme';

import { createDrawerNavigator } from '@react-navigation/drawer';

import ThemeContext from '../context/ThemeContext';

//Import Main Screens
import Home from '../pages/main/Home';
import DrawerTab from '../components/DrawerTab';
//Children routes
import RouteReagents from './RouteReagents';
import RouteGlasswares from './RouteGlasswares';
import RouteEquipments from './RouteEquipments';
import RouteValidity from './RouteValidity';
import RouteSettings from './RouteSettings';

const StackMain = createDrawerNavigator();

export default function RouteMain(){
  const [theme, setTheme] = useState('light'); // Estado para controlar o tema

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    async function loadStoredTheme() {
      try {
        const storedTheme = await SecureStorage.getItemAsync(SECURE_STORAGE_KEY);
        if (storedTheme) {
          setTheme(storedTheme);
        }
      } catch (error) {
        console.error('Error loading stored theme', error);
      }
    }

    loadStoredTheme();
  }, []);

  useEffect(() => {
    SecureStorage.setItemAsync(SECURE_STORAGE_KEY, theme)
      .catch(error => {
        console.error('Error saving theme', error);
      });
  }, [theme]);

    return(
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        <StackMain.Navigator 
          drawerContent={(props) => <DrawerTab {...props}
          screenOptions={{
            cardStyleInterpolator: forFade,
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
        name="RouteSettings"
        component={RouteSettings}
        options={{
          title: 'Configurações',
          headerShown: false,
          drawerIcon: ({color})=>(<Ionicons name='settings-sharp' size={22} color={color}/>),
          drawerLabelStyle:{marginLeft: -20},
          drawerActiveTintColor: "#FFF",
          drawerActiveBackgroundColor: "#54B000",
        }}
       />
      </StackMain.Navigator>
      </ThemeContext.Provider>
    )
}