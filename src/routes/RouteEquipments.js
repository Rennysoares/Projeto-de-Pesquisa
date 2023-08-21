import { React } from 'react';
import { Image, TouchableOpacity} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import SearchEquipment from '../pages/equipments/SearchEquipment';
import RegisterEquipment from '../pages/equipments/RegisterEquipment';

const StackEquipments = createStackNavigator();

export default function RouteEquipments({navigation}){
    return (
    <StackEquipments.Navigator initialRouteName="Home">
      <StackEquipments.Screen
        name="SearchEquipment"
        component={SearchEquipment}
        options={{
          title: 'Consultar Equipamentos',
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
      <StackEquipments.Screen
          name="RegisterEquipment" 
          component={RegisterEquipment}
          options={{
            title: 'Cadastrar Equipamentos',
          }}
        />
    </StackEquipments.Navigator>
    )
  }