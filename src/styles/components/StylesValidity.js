import styled from "styled-components/native";

export const Text = styled.Text`
    color: ${props => props.theme.colorTitle};
`;

export const Container = styled.View`
    background-color: ${props => props.theme.backgroundComponents};
    border-radius: 10px;
    padding: 7px;
    justify-content: space-around;
    height: 130px;
`;