import { React } from 'react';
import { Image, TouchableOpacity} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Settings from '../pages/settings/Settings';
import Theme_custom from '../pages/settings/Theme_custom';
const StackSettings = createStackNavigator();

export default function RouteSettings({navigation}){
    return (
    <StackSettings.Navigator initialRouteName="Home">
      <StackSettings.Screen
        name="Settings"
        component={Settings}
        options={{
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
        }}
       />
    </StackSettings.Navigator>
    )
  }