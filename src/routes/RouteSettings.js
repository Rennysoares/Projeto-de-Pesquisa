import { React, useContext } from 'react';
import { Image, TouchableOpacity} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { forFade, forHorizontalSlide, forVerticalSlide, } from '../animations/Animations';

import Settings from '../pages/settings/Settings';
import Theme_custom from '../pages/settings/theme_custom/Theme_custom';
import SelectColor from '../pages/settings/theme_custom/SelectColor';
import {Ionicons} from 'react-native-vector-icons';
import themes from '../themes/Themes';
const StackSettings = createStackNavigator();
import ThemeContext from '../context/ThemeContext';
import { ThemeProvider } from 'styled-components';

export default function RouteSettings({ navigation }) {

  const { theme, color} = useContext(ThemeContext);
  const themeLight = themes.light;
  const themeDark = themes.dark;


  return (
    <ThemeProvider theme={theme === 'light' ? themeLight : themeDark}>
      <StackSettings.Navigator initialRouteName="Home"
        screenOptions={{
          cardStyleInterpolator: forFade,
          headerStyle: {
            backgroundColor: `${theme === 'light' ? color : '#222'}`,
          },
          headerTintColor: `${theme === 'light' ? '#222' : '#FFF'}`,
        }}

      >
        <StackSettings.Screen
          name="Settings"
          component={Settings}
          options={{
            title: 'Configurações',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => { navigation.goBack(); }}
                style={{marginHorizontal: 15}}
              >
                <Ionicons name='arrow-back' size={25} color={`${theme === 'light' ? '#000' : '#FFF'}`}/>
              </TouchableOpacity>
            ),
          }}
        />
        <StackSettings.Screen
          name="Theme_custom"
          component={Theme_custom}
          options={{
            title: 'Temas e customização',
          }}
        />
        <StackSettings.Screen
          name="SelectColor"
          component={SelectColor}
          options={{
            title: 'Selecione a cor',
          }}
        />
      </StackSettings.Navigator>
    </ThemeProvider>
  )
}