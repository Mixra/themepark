import React from "react";
import { Button, ButtonProps } from '@mui/material';


interface CustomButtonProps extends ButtonProps {
  onClickCreate: () => void; 
}

const ButtonComponent: React.FC<CustomButtonProps> = ({ children, onClickCreate, ...rest }) => {
  const handleClick = () => {
    onClickCreate(); 
  };

  return (
    <Button {...rest} onClick={handleClick}>
      {children}
    </Button>
  );
};

export default ButtonComponent;