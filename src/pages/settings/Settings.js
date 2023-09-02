
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button } from 'react-native';
import { Container, SectionConfig, SectionItem, TitleConfig, DescConfig, HorizontalRow } from '../../styles/settings/StylesSettings';

export default function Settings({ navigation }) {
    return (
        <Container>
            <ScrollView>
                <SectionConfig>
                    <TouchableOpacity>
                        <SectionItem>
                            <TitleConfig>Configurar estoque baixo</TitleConfig>
                            <DescConfig>Configurar um nível de estoque mínimo para receber alertas</DescConfig>
                        </SectionItem>
                    </TouchableOpacity>
                    <HorizontalRow />
                    <SectionItem>
                        <TitleConfig>Configurar data de invalidez</TitleConfig>
                        <DescConfig>Configurar uma faixa de data para que o sistema possa detectar itens vencidos</DescConfig>
                    </SectionItem>
                </SectionConfig>

                <SectionConfig>
                    <TouchableOpacity onPress={() => { navigation.navigate("Theme_custom") }}>
                        <SectionItem>
                            <TitleConfig>Temas e Personalização</TitleConfig>
                        </SectionItem>
                    </TouchableOpacity>
                </SectionConfig>

                <SectionConfig>
                    <SectionItem>
                        <TitleConfig>Sobre</TitleConfig>
                    </SectionItem>
                </SectionConfig>
            </ScrollView>
        </Container>
    )
}