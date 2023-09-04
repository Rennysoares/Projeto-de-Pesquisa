import React from 'react'
import { useContext } from 'react';
import { ContainerColors } from '../../../styles/settings/SelectColor';
import { Text, View, TouchableOpacity } from 'react-native';
import { Container } from '../../../styles/CommonStyles';
import ThemeContext from '../../../context/ThemeContext';

export default function ModalPickerColor({navigation}) {

    const { color, settingColor } = useContext(ThemeContext);

    const Colors = ({ color }) => {
        return (
            <TouchableOpacity style={{margin: 10}} onPress={()=>{settingColor(color); navigation.goBack()}}>
                <View style={{ height: 60, width: 60, backgroundColor: color, borderRadius: 10 }} />
            </TouchableOpacity>
        )
    }

    return (
        <Container>
            <ContainerColors>
                <Colors color='#f23440' />
                <Colors color='#e2a71e' />
                <Colors color='#e88334' />
                <Colors color='#4595ec' />
                <Colors color='#9946c7' />
                <Colors color='#60b919' />
                <Colors color='#d9639e' />
                <Colors color='#8f36aa' />
            </ContainerColors>
        </Container>
    )
}

