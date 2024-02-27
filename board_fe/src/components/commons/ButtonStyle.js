import styled from 'styled-components';
import colorNames from '../../styles/colors';
import sizeNames from '../../styles/sizes';

const { big } = sizeNames;
const { primary, white } = colorNames;

export const BigButton = styled.button`
  background: ${({ color }) => (color ? colorNames[color] : primary)};
  font-size: ${({ size }) => (size ? sizeNames[size] : big)};
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '40px'};
  color: ${({ fcolor }) => (fcolor ? colorNames[fcolor] : white)};
  border: 1px solid ${({ bcolor }) => (bcolor ? colorNames[bcolor] : primary)};
  cursor: pointer;
  border-radius: 3px;

  & + & {
    margin-left: 5px;
  }
`;

export const ButtonGroup = styled.div`
  width: ${({ width }) => width || 350}px;
  display: flex;
  margin: 20px auto;
  button {
    flex-grow: 1;
    width: 0;
  }
`;
