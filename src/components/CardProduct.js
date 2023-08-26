import React,  {useContext} from 'react'
import {Text,View,StyleSheet,Image, TouchableOpacity} from 'react-native';
// Este e o componente que sera reaproveitada no arquivo do app principal

import ThemeContext from '../context/ThemeContext';

export default function CardProduct( { navigation, tipoProduto, src, teladenav }){

  const {theme} = useContext(ThemeContext);
  
  return(
    <View>
    <TouchableOpacity
      onPress={()=>{navigation.navigate(teladenav)}}
    >
    <View style={[styles.cardConteiner, {backgroundColor: `${theme=="light" ? "#DDD" : "#222"}`}]}>
      <Image
      source={src}
      style={styles.img}
      />
      <Text style={[styles.txtCard, {color: `${theme=="light" ? "#000" : "#FFF"}`}]}>{tipoProduto}</Text>
    </View>
    </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  cardConteiner:{
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#DDD',
    borderRadius: 7,
    width: 120,
    height: 150,
    marginRight: 10,
  },
  img:{
    marginTop: 15,
    height: 75,
    width: 75
  },
  txtCard:{
    fontSize: 16,
    fontWeight: '500'
  }
})