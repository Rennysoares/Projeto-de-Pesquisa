import { React, useContext } from 'react';
import { View, Image, TouchableOpacity, } from 'react-native';
import { createStackNavigator} from '@react-navigation/stack';
import { forFade, forHorizontalSlide, forVerticalSlide, } from '../animations/Animations';
import Settings from '../pages/settings/Settings';
import Theme_custom from '../pages/settings/Theme_custom';
const StackSettings = createStackNavigator();
import ThemeContext from '../context/ThemeContext';
import { TransitionPresets } from '@react-navigation/stack';

export default function RouteSettings({navigation}){

  const {theme} = useContext(ThemeContext);

    return (
    <StackSettings.Navigator initialRouteName="Home" 
      screenOptions={{
        headerStyle: {
          backgroundColor: `${theme === 'light' ? '#FFF' : '#222' }`,
        },
        headerTintColor: `${theme === 'light' ? '#222' : '#FFF' }`,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      
    >
      <StackSettings.Screen
        name="Settings"
        component={Settings}
        options={{
          cardStyleInterpolator: forFade,
          title: 'Configurações',
          headerLeft:()=>(
            <TouchableOpacity
              onPress={()=>{navigation.goBack();}}>
              <Image
                source={require('../../assets/setanavigator.png')}
                style={{
                    height: 20,
                    width: 20,
                    marginHorizontal: 16,
                  }}
              />
            </TouchableOpacity>
          ),
          
        }}
       />
       <StackSettings.Screen
        name="Theme_custom"
        component={Theme_custom}
        options={{
          title: 'Temas e customização',
          cardStyleInterpolator: forFade,
        }}
       />
    </StackSettings.Navigator>
    )
  }