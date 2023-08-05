import React from "react";
import {View, Text, Linking, StyleSheet, ImageBackground} from "react-native";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";


export default function DrawerApp(props){
    return(
        <View style={{flex: 1}}>
        <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor:"#54D700"}}>
        <ImageBackground
                source={require("../assets/menu-bg.jpeg")}
                padding={10}
            >
                <View style={{height: 200}}>
                    
                </View>
            </ImageBackground>
            <View style={{flex: 1, backgroundColor: "#FFF", paddingTop: 10}}>
                <DrawerItemList {...props} />
                {/*<DrawerItem
                    label="Ajuda"
                    onPress={() => Linking.openURL('https://mywebsite.com/help')}
                />*/}
            </View>
        </DrawerContentScrollView>
        <View style={{padding: 20}}>
            <Text>GitHub</Text>
            <Text>Desenvolvido para o IFAM </Text>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containerTop:{
        height: 300,
        backgroundColor:"rgb(0, 200,0)"
    }
})