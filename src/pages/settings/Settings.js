import { useContext, useState } from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Button} from 'react-native';
import { Container, SectionConfig, SectionItem, TitleConfig, DescConfig, HorizontalRow } from '../../styles/settings/StylesSettings';

import ThemeContext from '../../context/ThemeContext';
import { ThemeProvider } from 'styled-components';
import themes from '../../themes/Themes';

export default function Settings({navigation}){

    const {theme} = useContext(ThemeContext);

    const themeLight = themes.light;
    const themeDark = themes.dark;

    return(
        <ThemeProvider theme={theme === 'light' ? themeLight : themeDark}>
        <Container>
            <ScrollView>
                    <SectionConfig>
                        <TouchableOpacity>
                            <SectionItem>
                                <TitleConfig>Configurar estoque baixo</TitleConfig>
                                <DescConfig>Configurar um nível de estoque mínimo para receber alertas</DescConfig>
                            </SectionItem>
                        </TouchableOpacity>
                        <HorizontalRow/>
                        <SectionItem>
                            <TitleConfig>Configurar data de invalidez</TitleConfig>
                            <DescConfig>Configurar uma faixa de data para que o sistema possa detectar itens vencidos</DescConfig>
                        </SectionItem>
                    </SectionConfig>

                    <SectionConfig>
                        <SectionItem>
                            <TitleConfig>Notificações e alertas</TitleConfig>
                            <DescConfig>Escolha quais as notificações e alertas que deseja receber ou não</DescConfig>
                        </SectionItem>
                    </SectionConfig>

                    <SectionConfig>
                        <TouchableOpacity onPress={()=>{navigation.navigate("Theme_custom")}}>
                        <SectionItem>
                            <TitleConfig>Temas e Personalização</TitleConfig>
                        </SectionItem>
                        </TouchableOpacity>
                    </SectionConfig>

                    <SectionConfig>
                        <SectionItem>
                            <TitleConfig>Backup e restauração</TitleConfig>
                        </SectionItem>
                        <HorizontalRow/>
                        <SectionItem>
                            <TitleConfig>Área vermelha</TitleConfig>
                            <DescConfig>Modifique bruscamente os dados do estoque</DescConfig>
                        </SectionItem>
                    </SectionConfig>

                    <SectionConfig>
                        <SectionItem>
                            <TitleConfig>Sobre</TitleConfig>
                        </SectionItem>
                    </SectionConfig>
                </ScrollView>
            </Container>
        </ThemeProvider>
    )
}