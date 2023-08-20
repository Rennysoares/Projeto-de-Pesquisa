import { createStackNavigator } from '@react-navigation/stack';

import SearchEquipments from '../pages/equipments/SearchEquipments';
import RegisterEquipments from '../pages/equipments/RegisterEquipments';

const StackEquipments = createStackNavigator();

export default function RouteEquipments({navigation}){
    return (
    <StackEquipments.Navigator initialRouteName="Home">
      <StackEquipments.Screen
        name="SearchEquipments"
        component={SearchEquipments}
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
      <StackGlasswares.Screen
          name="RegisterEquipments" 
          component={RegisterEquipments}
          options={{
            title: 'Cadastrar Equipamentos',
          }}
        />
    </StackEquipments.Navigator>
    )
  }