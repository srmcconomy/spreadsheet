import styled from "styled-components";
import React from "react";

export const TextEditor = ({
  value,
  onChange,
  onBlur,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus
      onBlur={onBlur}
    />
  );
};

const Input = styled.input`
  border: 0;
  &:focus-visible {
    outline: none;
  }
  font-size: 16px;
  padding: 4px 8px;
  height: 100%;
  width: 100%;
`;
