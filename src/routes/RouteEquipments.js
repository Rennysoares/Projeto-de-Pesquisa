import { React, useContext } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import ThemeContext from '../context/ThemeContext';
import themes from '../themes/Themes';
import { ThemeProvider } from 'styled-components';
import { createStackNavigator } from '@react-navigation/stack';
import { forFade } from '../animations/Animations';
import { Ionicons } from 'react-native-vector-icons'
import SearchEquipment from '../pages/equipments/SearchEquipment';
import RegisterEquipment from '../pages/equipments/RegisterEquipment';

const StackEquipments = createStackNavigator();

export default function RouteEquipments({ navigation }) {

  const { theme, color } = useContext(ThemeContext);
  const themeLight = themes.light;
  const themeDark = themes.dark;

  const ControllerColor = (dark, light) => {
    return theme == "dark" ? dark : light
  }

  return (
    <ThemeProvider theme={theme === 'light' ? themeLight : themeDark}>
    <StackEquipments.Navigator 
      initialRouteName="Home"
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
      <StackEquipments.Screen
        name="SearchEquipment"
        component={SearchEquipment}
        options={{
          title: 'Consultar Equipamentos',
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
      <StackEquipments.Screen
        name="RegisterEquipment"
        component={RegisterEquipment}
        options={{
          title: 'Cadastrar Equipamentos',
        }}
      />
    </StackEquipments.Navigator>
    </ThemeProvider>
  )
}