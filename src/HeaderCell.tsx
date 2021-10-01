import styled from "styled-components";

export const HeaderCell = styled.div<{
  borderBottomColor?: string;
  borderRightColor?: string;
}>`
  border-bottom: 1px solid
    ${({ borderBottomColor, theme }) =>
      borderBottomColor ?? theme.headers.borderColor};
  border-right: 1px solid
    ${({ borderRightColor, theme }) =>
      borderRightColor ?? theme.headers.borderColor};
  position: sticky;
  background: ${({ theme }) => theme.headers.backgroundColor};
  display: flex;
  align-items: center;
`;
