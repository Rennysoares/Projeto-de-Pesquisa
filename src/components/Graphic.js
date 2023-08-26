import {React, useEffect, useState, useContext} from 'react';
import { View, Dimensions, Text} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { DatabaseConnection } from '../databases/DatabaseConnection'; 

import ThemeContext from '../context/ThemeContext';

const dbreagent = DatabaseConnection.getConnectionDBReagent()
const dbglassware = DatabaseConnection.getConnectionDBGlassware()
const dbequipment = DatabaseConnection.getConnectionDBEquipment()
const database = DatabaseConnection.getConnectionDatabase();

const screenWidth = Dimensions.get("window").width - 30;

const Graphic = ({navigation}) => {

  const {theme} = useContext(ThemeContext)

  const [reagent, setReagent] = useState(0)
  const [glassware, setGlassware] = useState(0)
  const [equipment, setEquipment] = useState(0)
  const data = {
    labels: ["Reagentes", "Vidrarias", "Equipamentos"],
    datasets: [
      {
        data: [reagent, glassware, equipment],
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Estoque"] // optional
  };
  
  const chartConfig = {
    backgroundGradientFrom: theme == "light" ? "#DDD" : "#222",
    backgroundGradientTo: theme == "light" ? "#DDD" : "#222",
    color: () => `${theme == "light" ? "#000" : "#FFF"}`,
    labelColor: () => `${theme == "light" ? "#000" : "#FFF"}`,
    barPercentage: 1,
    useShadowColorFromDataset: false, // optional
    decimalPlaces: 0
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const getDataLengthEquiment = () => {
        database.transaction((tx) => {
          tx.executeSql(
            'SELECT SUM(quantidade) AS total_quantidade FROM Equipamentos',
            [],
            (_, { rows }) => {
              const len = rows._array;
              setEquipment(len[0]?.total_quantidade);
            },
            (error) => {
              console.log('Error querying data', error);
            }
          );
        });
      };
      const getDataLengthGlassware = () => {
        database.transaction((tx) => {
          tx.executeSql(
            'SELECT SUM(quantidade) AS total_quantidade FROM Capacidades',
            [],
            (_, {rows}) => {
              const len = rows._array;
              setGlassware(len[0]?.total_quantidade);
            },
            (error) => {
              console.log('Error querying data', error);
            }
          );
        });
      };
      const getDataLengthReagent = () => {
        database.transaction((tx) => {
          tx.executeSql(
            'SELECT SUM(quantidade_frascos) AS total_quantidade FROM lote',
            [],
            (_, { rows }) => {
              const len = rows._array;
              setReagent(len[0]?.total_quantidade);
            },
            (error) => {
              console.log('Error querying data', error);
            }
          );
        });
      };
      getDataLengthEquiment()
      getDataLengthGlassware()
      getDataLengthReagent()
    });
    unsubscribe;
}, [navigation]);
  return (
    <View>
      <Text>Quantidade no Estoque</Text>
      <BarChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        fromZero={true}
        style={{
          marginVertical: 4,
          borderRadius: 16
        }}
      />
    </View>
  );
};

export default Graphic;
