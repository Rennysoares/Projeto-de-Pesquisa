import {React, useEffect, useState} from 'react';
import { View, Dimensions, Text} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { DatabaseConnection } from '../src/databases/DatabaseConnection';

const dbreagent = DatabaseConnection.getConnectionDBReagent()
const dbglassware = DatabaseConnection.getConnectionDBGlassware()
const dbequipment = DatabaseConnection.getConnectionDBEquipment()

const screenWidth = Dimensions.get("window").width - 30;

const Graficos = ({navigation}) => {
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
    backgroundGradientFrom: "rgb(200, 200, 200)",
    backgroundGradientTo: "rgb(200, 200, 200)",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 1,
    useShadowColorFromDataset: false, // optional
    decimalPlaces: 0
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const getDataLengthEquiment = () => {
        dbequipment.transaction((tx) => {
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
        dbglassware.transaction((tx) => {
          tx.executeSql(
            'SELECT COUNT(*) as count FROM Capacidades',
            [],
            (tx, results) => {
              const len = results.rows.item(0).count;
              setGlassware(len);
            },
            (error) => {
              console.log('Error querying data', error);
            }
          );
        });
      };
      const getDataLengthReagent = () => {
        dbreagent.transaction((tx) => {
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

export default Graficos;
