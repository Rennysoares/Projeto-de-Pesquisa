import { useContext, useState } from 'react';
import ThemeContext from '../../context/ThemeContext';

import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Button} from 'react-native';

import { Container, SectionConfig, SectionItem, TitleConfig, DescConfig, HorizontalRow } from '../../styles/settings/StylesSettings';

import { ThemeProvider } from 'styled-components';
import themes from '../../themes/Themes';

export default function Theme_custom({navigation}){

    const {theme, toggleTheme} = useContext(ThemeContext);

    const themeLight = themes.light;
    const themeDark = themes.dark;

    return(
        <ThemeProvider theme={theme === 'light' ? themeLight : themeDark}>
        <Container>
            <ScrollView>
                    <SectionConfig>
                        <TouchableOpacity
                            onPress={()=>{toggleTheme()}}
                        >
                            <SectionItem>
                                <TitleConfig>Modo Claro e Escuro</TitleConfig>
                                <DescConfig>Clique para mudar para o modo {theme === 'light' ? 'escuro' : 'claro'}</DescConfig>
                            </SectionItem>
                        </TouchableOpacity>
                        <HorizontalRow/>
                        <SectionItem>
                            <TitleConfig>Personalizar cores</TitleConfig>
                            <DescConfig>Configurar uma faixa de data para que o sistema possa detectar itens vencidos</DescConfig>
                        </SectionItem>
                    </SectionConfig>
                </ScrollView>
            </Container>
        </ThemeProvider>
    )
}