import styled from "styled-components/native"

export const CenterModal = styled.View`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3)
`;

export const ContainerModalData = styled.View`
    background-color: ${props => props.theme.backgroundContainer};
    padding: 20px;
    height: 450px;
    width: 80%;
    border-radius: 10px;
    row-gap: 5px
`;

export const ContainerModalEdit = styled.View`
    background-color: ${props => props.theme.backgroundContainer};
    padding: 20px;
    height: 350px;
    width: 75%;
    border-radius: 15px;
    row-gap: 5px
`;

export const NameReagent = styled.Text`
    color: ${props => props.theme.colorTitle};
    font-size: 18px;
    width: 190px;
    font-weight: bold
`;

export const InformationText = styled.Text`
    color: ${props => props.theme.colorTitle};
    font-size: 16px;
`;

