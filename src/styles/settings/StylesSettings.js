import styled from "styled-components/native"

export const Container = styled.View`
    background-color: ${props => props.theme.backgroundContainer};
    flex: 1;
`;

export const SectionConfig = styled.View`
    background-color: ${props => props.theme.backgroundItem};
    margin: 8px 8px;
    padding: 20px 16px;
    border-radius: 25px;
    gap: 5px;
`;

export const SectionItem = styled.View`
    gap: 5px;
`;

export const TitleConfig = styled.Text`
    font-size: 16px;
    color: ${props => props.theme.colorTitle};
`;

export const DescConfig = styled.Text`
    font-size: 13px;
    color: ${props => props.theme.colorSubtitle};
    text-align: justify;
`;

export const HorizontalRow = styled.View`
    border-bottom-width: 1px;
    border-color: #ccc;
    margin: 10px 0px;
`;
