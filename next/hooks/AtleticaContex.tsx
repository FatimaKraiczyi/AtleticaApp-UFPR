import React, { createContext, useContext, useState } from "react";
import { AtleticaResponse } from "@/interfaces/atleticas";

interface AtleticaContextProps {
  atleticaData: AtleticaResponse;
  setAtleticaData: React.Dispatch<React.SetStateAction<AtleticaResponse>>;
}

const AtleticaContext = createContext<AtleticaContextProps>([] as any);

interface AtleticaProviderProps {
  children: React.ReactNode;
}

export const AtleticaProvider: React.FC<AtleticaProviderProps> = ({
  children,
}) => {
  const [atleticaData, setAtleticaData] = useState<AtleticaResponse>([] as any);

  const setAtleticaWithLog: React.Dispatch<
    React.SetStateAction<AtleticaResponse>
  > = (value) => {
    setAtleticaData(value);
  };

  return (
    <AtleticaContext.Provider
      value={{ atleticaData, setAtleticaData: setAtleticaWithLog }}
    >
      {children}
    </AtleticaContext.Provider>
  );
};

export const useAtletica = () => {
  const context = useContext(AtleticaContext);
  if (!context) {
    throw new Error("useAtletica must be used within an AtleticaProvider");
  }
  return context;
};
