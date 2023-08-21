import { React, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {createTableReagents, createTableGlasswares, createTableEquipments} from '../../databases/DatabaseCreateTables'
//Card personalizado
import CardProduct from '../../components/CardProduct'
import Validity from '../../components/Validity';
import Graphic from '../../components/Graphic';

export default function Home( { navigation }){

  useEffect(() => {
    createTableReagents();
    createTableGlasswares();
    createTableEquipments();
  }, []);

    return(
      <View>
        <ScrollView>
        <View style={styles.conteinerHeader}>
          <LinearGradient
          colors={['rgb(255, 255, 255)', "#54f000"]}
          start={{x: 0, y: 0}}
          end={{x: 0.5, y: 0.5}}
          style={styles.linearGradient}
          />
          <View style={styles.conteinerTextHeader}>
            <Text style={styles.titleTop}>Bem vindo ao</Text>
            <Text style={styles.titleNameApp}>SisLab Química</Text>
            <Text style={styles.subtitle}>App para gerenciamento dos estoques do IFAM</Text>
          </View>
          <View style={styles.conteinerImage}>
            <Image
              style={{height: 100, width: 100}}
              source={require('../../../assets/iconhome.png')}
            />
          </View>
        </View>
        
        <View style={styles.conteinerProducts}>
          <Text>Selecione o tipo de produto a ser gerenciado:</Text>
          <View style={styles.conteinerCards}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <CardProduct
              tipoProduto="Reagentes"
              navigation={navigation}
              teladenav = 'RouteReagents'
              src={require('../../../assets/iconstypeitem/reagent.png')}
              />
              <CardProduct
              tipoProduto="Vidrarias"
              navigation={navigation}
              teladenav = 'RouteGlasswares'
              src={require('../../../assets/iconstypeitem/glassware.png')}
              />
              <CardProduct
              tipoProduto="Equipamentos"
              navigation={navigation}
              teladenav = 'RouteEquipments'
              src={require('../../../assets/iconstypeitem/equipment.png')}
              />
            </ScrollView>
          </View>
        </View>
  
        <View style={styles.conteinerValidade}>
          <Validity navigation={navigation}/>
        </View>
        <View style={styles.conteinerGraficos}>
          <Graphic navigation={navigation}/>
        </View>
        </ScrollView>
      </View>
    )
}

const styles = StyleSheet.create({
    conteinerHeader:{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 170,
    },
    linearGradient:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    conteinerTextHeader:{
        width: 180
    },
    conteinerImage:{
        position: 'relative'
    },
    titleTop:{
        color: '#000',
        fontSize: 14
    },
    titleNameApp:{
        color: '#000',
        fontSize: 23,
        fontWeight: 'bold',
        paddingTop: 6,
        paddingBottom: 6
    },
    subtitle:{
        color: '#000',
        fontSize: 11
    },
    conteinerProducts:{
        padding: 15
    },
    conteinerCards:{
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        paddingTop: 10,
    },
    conteinerValidade:{
        padding: 15,
    },
    seta:{
        height: 20,
        width: 20,
        marginHorizontal: 16,
    },
    conteinerGraficos:{
        alignItems: 'center'
    }
});
  