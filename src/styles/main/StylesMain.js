import styled from "styled-components/native"

export const Container = styled.View`
    background-color: ${props => props.theme.backgroundContainer};
    flex: 1;
`;

export const ContainerHeader = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 170px;
`;

export const ContainerTextHeader = styled.View`
    width: 50%
`;

export const TitleTop = styled.Text`
    color: ${props => props.theme.colorTitle};
`;

export const TitleNameApp = styled.Text`
    color: ${props => props.theme.colorTitle};
    font-size: 23px;
    font-weight: bold;
    padding-top: 6px;
    padding-bottom: 6px;
`;

export const Subtitle = styled.Text`
    color: ${props => props.theme.colorTitle};
    font-size: 11px;
`;

export const Text = styled.Text`
    color: ${props => props.theme.colorTitle};
`;