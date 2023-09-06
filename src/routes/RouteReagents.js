import { React, useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from 'react-native-vector-icons'
import { forFade } from '../animations/Animations';

import SearchReagent from '../pages/reagents/SearchReagent';
import RegisterReagent from '../pages/reagents/RegisterReagent';
import EditReagent from '../pages/reagents/EditReagent';

import ThemeContext from '../context/ThemeContext';
import themes from '../themes/Themes';
import { ThemeProvider } from 'styled-components';

import { createStackNavigator } from '@react-navigation/stack';
const StackReagents = createStackNavigator();

export default function RouteReagents({ navigation }){

    const { theme, color } = useContext(ThemeContext);
    const themeLight = themes.light;
    const themeDark = themes.dark;

    const ControllerColor = (dark, light) => {
        return theme=="dark" ? dark : light
    }

    return(
        <ThemeProvider theme={theme === 'light' ? themeLight : themeDark}>
        <StackReagents.Navigator
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

            <StackReagents.Screen 
                name="SearchReagent" 
                component={SearchReagent}
                options={{
                title: 'Consultar Reagentes',
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
            <StackReagents.Screen 
                name="RegisterReagent" 
                component={RegisterReagent}
                options={{
                title: 'Cadastrar reagentes', 
            }}
            
            />
            <StackReagents.Screen 
                name="EditReagent" 
                component={EditReagent}
                options={{title: 'Editar Reagentes'}}
            />
      </StackReagents.Navigator>
      </ThemeProvider>
    )
}