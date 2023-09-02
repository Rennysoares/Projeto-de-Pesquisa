import styled from "styled-components/native"

export const RegularText = styled.Text`
    color: ${props => props.theme.colorTitle};
`;

export const Container = styled.View`
    background-color: ${props => props.theme.backgroundContainer};
    flex: 1;
`;