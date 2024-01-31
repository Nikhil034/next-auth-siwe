import styled from 'styled-components';

export const StyledTimePickerContainer = styled.div`
    margin: 0 auto;
    background-color: #f0fff;
    border-radius: 8px;
    box-shadow: 0 2px 24px rgba(0, 0, 0, 0.1);
    height: fit-content;
    li{
        border-radius: 0px
    }
`;


export const AddButton = styled.button`
    background-color: #4caf50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

export const RemoveButton = styled.button`
    background-color: #f44336;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    margin-left: 5px;
`;