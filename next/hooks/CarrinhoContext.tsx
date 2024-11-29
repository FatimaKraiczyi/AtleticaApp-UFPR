import React, { createContext, useContext, useState } from "react";

interface CarrinhoContextType {
  items: number;
  addItem: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const CarrinhoProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [items, setItems] = useState(0);

  const addItem = () => {
    setItems((prevItems) => prevItems + 1);
  };

  return (
    <CarrinhoContext.Provider value={{ items, addItem }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = (): CarrinhoContextType => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho must be used within a CarrinhoProvider");
  }
  return context;
};
