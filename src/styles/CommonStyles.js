import styled from "styled-components/native"

export const RegularText = styled.Text`
    color: ${props => props.theme.colorTitle};
`;

export const Container = styled.View`
    background-color: ${props => props.theme.backgroundContainer};
    flex: 1;
`;

export const ContainerSearch = styled.View`
    background-color: ${props => props.theme.backgroundContainer};
    height: 100%
`;

export const TextInputContainer = styled.View`
    background-color: ${props => props.theme.backgroundItem};
    margin: 5px 16px;
    border-radius: 8px;
`;

export const FlatItem = styled.View`
    background-color: ${props => props.theme.backgroundItem};
    border-radius: 10px;
    padding: 15px;
    margin: 5px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    elevation: 5;
    shadow-opacity: 0.5; /* Opacidade da sombra para iOS */
    shadow-radius: 5px; /* Raio da sombra para iOS */
    shadow-color: #000000; /* Cor da sombra para iOS */
`;