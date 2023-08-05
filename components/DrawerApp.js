import React from "react";
import {View, Text, Linking, StyleSheet, ImageBackground} from "react-native";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";


export default function DrawerApp(props){
    return(
        <View style={{flex: 1}}>
            <ImageBackground
                source={require("../assets/menu-bg.jpeg")}
                padding={20}
            >
                <View style={{height: 200}}>
                    <Text>ola</Text>
                    <Text>ola</Text>
                    <Text>ola</Text>
                    <Text>ola</Text>
                </View>
            </ImageBackground>
        <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor:"rgb(0, 200, 0)"}}>
            <DrawerItemList {...props} />
            {/*<DrawerItem
                label="Help"
                onPress={() => Linking.openURL('https://mywebsite.com/help')}
            />*/}
        </DrawerContentScrollView>
        <View>
            <Text>Git</Text>
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