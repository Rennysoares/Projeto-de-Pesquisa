import React, {useContext} from 'react';
import {TouchableOpacity} from 'react-native';
import { Ionicons } from 'react-native-vector-icons'
import { forFade } from '../animations/Animations';

import SearchGlassware from '../pages/glasswares/SearchGlassware';
import RegisterGlassware from '../pages/glasswares/RegisterGlassware';

import ThemeContext from '../context/ThemeContext';
import themes from '../themes/Themes';
import { ThemeProvider } from 'styled-components';

import { createStackNavigator } from '@react-navigation/stack';

const StackGlasswares = createStackNavigator();

export default function RouteGlasswares({navigation}){

  const { theme, color } = useContext(ThemeContext);
  const themeLight = themes.light;
  const themeDark = themes.dark;

  const ControllerColor = (dark, light) => {
      return theme=="dark" ? dark : light
  }

    return(
      <ThemeProvider theme={theme === 'light' ? themeLight : themeDark}>
      <StackGlasswares.Navigator
        screenOptions={{
          cardStyleInterpolator: forFade,
          headerStyle: {
            backgroundColor: `${ControllerColor("#191919", color)}`,
            shadowRadius: 30,
            shadowColor: '#000',
          },
          headerTintColor: `${ControllerColor("#fff", "#000")}`,
        }}
      >
        <StackGlasswares.Screen
          name="SearchGlassware" 
          component={SearchGlassware}
          options={{
            title: 'Consultar Vidrarias',
            headerLeft:()=>(
              <TouchableOpacity
                  onPress={()=>{navigation.goBack();}}
                  style={{marginHorizontal: 15}}
              >
                  <Ionicons name='arrow-back' size={25} color={ControllerColor('#FFF', '#000')}/>
              </TouchableOpacity>
          ),
        }}
        />
        <StackGlasswares.Screen
          name="RegisterGlassware" 
          component={RegisterGlassware}
          options={{
            title: 'Cadastrar Vidrarias',
          }}
        />
      </StackGlasswares.Navigator>
      </ThemeProvider>
    )
  }