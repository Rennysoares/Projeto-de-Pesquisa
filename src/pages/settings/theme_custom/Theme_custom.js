import { useContext } from 'react';
import ThemeContext from '../../../context/ThemeContext';


import {ScrollView, TouchableOpacity} from 'react-native';

import { Container, SectionConfig, SectionItem, TitleConfig, DescConfig, HorizontalRow } from '../../../styles/settings/StylesSettings';


export default function Theme_custom({ navigation }) {

    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
            <Container>
                <ScrollView>
                    <SectionConfig>
                        <TouchableOpacity onPress={() => { toggleTheme() }}>
                            <SectionItem>
                                <TitleConfig>Modo Claro e Escuro</TitleConfig>
                                <DescConfig>Clique para mudar para o modo {theme === 'light' ? 'escuro' : 'claro'}</DescConfig>
                            </SectionItem>
                        </TouchableOpacity>
                        <HorizontalRow />
                        <TouchableOpacity onPress={()=>{navigation.navigate("SelectColor")}}>
                            <SectionItem>
                                <TitleConfig>Personalizar cores</TitleConfig>
                                <DescConfig>Configure uma cor padrão para o aplicativo e elementos</DescConfig>
                            </SectionItem>
                        </TouchableOpacity>
                    </SectionConfig>
                </ScrollView>
            </Container>
    )
}