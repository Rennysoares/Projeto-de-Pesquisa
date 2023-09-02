import React, { useContext } from "react";
import { View, Text, Linking, StyleSheet, ImageBackground } from "react-native";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { RegularText } from "../styles/CommonStyles";
import { ContainerListItems, Container } from "../styles/components/StylesDrawerTab";
import ThemeContext from "../context/ThemeContext";
import { ThemeProvider } from "styled-components";
import themes from "../themes/Themes";
export default function DrawerTab(props) {

    const { theme, color } = useContext(ThemeContext);
    const themeLight = themes.light;
    const themeDark = themes.dark;

    return (
        <ThemeProvider theme={theme === 'light' ? themeLight : themeDark}>
            <Container>
                <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: color }}>
                    <ImageBackground
                        source={require("../../assets/menu-bg.jpeg")}
                        padding={10}
                        opacity={0.3}
                    >
                        <View style={{ height: 200, color: color }}/>
                    </ImageBackground>
                    <ContainerListItems>
                        <DrawerItemList {...props} />
                        {/*<DrawerItem
                    label="Ajuda"
                    onPress={() => Linking.openURL('https://mywebsite.com/help')}
                />*/}
                    </ContainerListItems>
                </DrawerContentScrollView>
                <View style={{ padding: 20 }}>
                    {/*<Text>GitHub</Text>*/}
                    <RegularText>Desenvolvido para o IFAM Campus Parintins</RegularText>
                </View>
            </Container>
        </ThemeProvider>
    )
}

const styles = StyleSheet.create({
    containerTop: {
        height: 300,
        backgroundColor: "rgb(0, 200,0)"
    }
})