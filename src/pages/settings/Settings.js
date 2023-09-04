import React, {useState, useContext} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button, Modal } from 'react-native';
import { Container, SectionConfig, SectionItem, TitleConfig, DescConfig, HorizontalRow, CenterModal, ModalContainer, ContainerButton} from '../../styles/settings/StylesSettings';
import { Ionicons } from 'react-native-vector-icons';
import Slider from '@react-native-community/slider';
import { RegularText } from '../../styles/CommonStyles';

import StockConfigContext from '../../context/StockConfigContext';

export default function Settings({ navigation }) {

    const [modalLowStock, setModalLowStock] = useState(false);
    const [rangeSliderLowStock, setRangeSliderLowStock] = useState(50);

    const { lowStock, settingRange } = useContext(StockConfigContext);
    
    return (
        <>
        <Container>
            <ScrollView>
                <SectionConfig>
                    <TouchableOpacity onPress={()=>{setModalLowStock(true)}}>
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
        <Modal
            visible={modalLowStock}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalLowStock(false)}
        >
            <CenterModal>
                <ModalContainer>
                <RegularText>
                    Configure o nível de estoque
                </RegularText>
                <RegularText>
                    {rangeSliderLowStock}%
                </RegularText>
                <Slider
                    style={{width: '100%', height: 40}}
                    minimumValue={10}
                    maximumValue={90}
                    value={rangeSliderLowStock}
                    onValueChange={(value)=>{setRangeSliderLowStock(value)}}
                    step={5}
                />
                    <TouchableOpacity 
                        onPress={() => {
                            setModalLowStock(false)
                            }
                        }
                        style={{
                            position: 'absolute', 
                            top: 0, 
                            right: 0, 
                            padding: 5
                        }}>
                        <Ionicons name='close' size={30} color={'rgb(0, 0, 0)'}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{
                            settingRange(''+rangeSliderLowStock)
                            setModalLowStock(false)
                        }}
                    >
                        <View style={{alignItems: 'center'}}>
                            <ContainerButton>
                                <Text style={{fontSize: 16, color: '#fff'}}>Aplicar</Text>
                            </ContainerButton>
                        </View>
                    </TouchableOpacity>
                    
                </ModalContainer>  
            </CenterModal>
        </Modal>
        </>
    )
}