import { 
  React, 
  useState, 
  useEffect, 
  useContext 
} from 'react';

import { 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import {
  createTableReagents,
  createTableGlasswares, 
  createTableEquipments
} from '../../databases/DatabaseCreateTables';

//Card personalizado
import CardProduct from '../../components/CardProduct'
import Validity from '../../components/Validity';
import Graphic from '../../components/Graphic';

import { 
  Container, 
  ContainerHeader, 
  ContainerTextHeader, 
  TitleTop, 
  TitleNameApp, 
  Subtitle, 
  Text as RegularText
} from '../../styles/main/StylesMain';

import ThemeContext from '../../context/ThemeContext';
import { ThemeProvider } from 'styled-components';
import themes from '../../themes/Themes';

export default function Home( { navigation }){

  const {theme} = useContext(ThemeContext);
  const themeLight = themes.light;
  const themeDark = themes.dark;

  useEffect(() => {
    createTableReagents();
    createTableGlasswares();
    createTableEquipments();
  }, []);
    return(
      <ThemeProvider theme={theme === 'light' ? themeLight : themeDark}>
      <Container>
        <ScrollView>
        <ContainerHeader>
          <LinearGradient
            colors={[`${theme == "dark" ? "#000" : '#FFF'}`, "#54f000"]}
            start={{x: 0, y: 1}}
            end={{x: 1, y: 1}}
            style={styles.linearGradient}
          />
          <ContainerTextHeader>
            <TitleTop>Bem vindo ao</TitleTop>
            <TitleNameApp>SisLab Química</TitleNameApp>
            <Subtitle>App para gerenciamento dos estoques do IFAM</Subtitle>
          </ContainerTextHeader>
          <View style={styles.conteinerImage}>
            <Image
              style={{height: 100, width: 100}}
              source={require('../../../assets/iconhome.png')}
            />
          </View>
        </ContainerHeader>
        
        <View style={styles.conteinerProducts}>
          <RegularText>Selecione o tipo de produto a ser gerenciado:</RegularText>
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
      </Container>
      </ThemeProvider>
    )
}

const styles = StyleSheet.create({
    linearGradient:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    conteinerImage:{
        position: 'relative'
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
    conteinerGraficos:{
        alignItems: 'center'
    }
});
  