import { React } from 'react';
import { Image, TouchableOpacity} from 'react-native';
import { forFade } from '../animations/Animations';
import SearchReagent from '../pages/reagents/SearchReagent';
import RegisterReagent from '../pages/reagents/RegisterReagent';
import EditReagent from '../pages/reagents/EditReagent';

import { createStackNavigator } from '@react-navigation/stack';
const StackReagents = createStackNavigator();

export default function RouteReagents({ navigation }){
    return(
        <StackReagents.Navigator
            initialRouteName="Home"
            screenOptions={{
                cardStyleInterpolator: forFade 
            }}
            >

            <StackReagents.Screen 
                name="SearchReagent" 
                component={SearchReagent}
                options={{
                title: 'Consultar Reagentes',
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
    )
}