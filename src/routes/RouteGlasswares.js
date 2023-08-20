
import { createStackNavigator } from '@react-navigation/stack';

import SearchGlassware from '../pages/glasswares/SearchGlassware';
import RegisterGlassware from '../pages/glasswares/RegisterGlassware';

const StackGlasswares = createStackNavigator();

export default function RouteGlasswares({navigation}){
    return(
      <StackGlasswares.Navigator>
        <StackGlasswares.Screen
          name="SearchGlassware" 
          component={SearchGlassware}
          options={{
            title: 'Consultar Vidrarias',
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
          name="RegisterGlassware" 
          component={RegisterGlassware}
          options={{
            title: 'Cadastrar Vidrarias',
          }}
        />
      </StackGlasswares.Navigator>
    )
  }