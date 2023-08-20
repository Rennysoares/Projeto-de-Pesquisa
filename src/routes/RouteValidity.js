import ValidityEquipments from '../pages/main/ValidityEquipments';
import ValidityReagents from '../pages/main/ValidityReagents';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const StackValidity = createMaterialTopTabNavigator();

export default function RouteValidity({navigation}){
    return(
      <StackValidity.Navigator>
        <StackValidity.Screen
          name="ValidityReagents" 
          component={ValidityReagents}
          options={{
            title: 'Reagentes', 
          }}
        />
        <StackValidity.Screen
          name="ValidityEquipments" 
          component={ValidityEquipments}
          options={{
            title: 'Equipamentos', 
          }}
        />
      </StackValidity.Navigator>
    )
  }