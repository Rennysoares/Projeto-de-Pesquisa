import React from 'react';
import { View, Dimensions, Text} from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width - 30;

const data = {
  labels: ["Reagentes", "Vidrarias", "Equipamentos"],
  datasets: [
    {
      data: [2, 0, 0],
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
  barPercentage: 1,
  useShadowColorFromDataset: false, // optional
  decimalPlaces: 0
};

const Graficos = () => {
  return (
    <View>
      <Text>Quantidade no Estoque</Text>
      <BarChart
        data={data}
        width={screenWidth}
        height={200}
        chartConfig={chartConfig}
        fromZero={true}
        style={{borderRadius: 10}}
      />

    </View>
  );
};

export default Graficos;
