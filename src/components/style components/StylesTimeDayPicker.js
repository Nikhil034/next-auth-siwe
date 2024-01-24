import styled from 'styled-components';

export const StyledTimeDayPicker = styled.div`
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
    display: flex
`;

export const StyledSection = styled.div`
    margin-bottom: 20px;
    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    select,
    input[type="time"] {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }

    input[type="checkbox"] {
        margin-right: 5px;
    }

    div {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        &:last-child {
            margin-bottom: 0;
        }
    }
`;

export const StyledButton = styled.button`
    background-color: #3498db;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #2980b9;
    }
`;