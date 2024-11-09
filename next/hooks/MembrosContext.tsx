import { MembrosResponse } from "@/interfaces/membros";
import React, { createContext, useContext, useState, type ReactNode } from "react";


interface MembrosContextType {
    membros: MembrosResponse[];
    setMembros: React.Dispatch<React.SetStateAction<MembrosResponse[]>>;
}

const MembrosContext = createContext<MembrosContextType | undefined>(undefined);

interface MembrosProviderProps {
    children: ReactNode;
}

export const MembrosProvider: React.FC<MembrosProviderProps> = ({ children }) => {
    const [membros, setMembros] = useState<MembrosResponse[]>([]);

        const setMembrosWithLog: React.Dispatch<React.SetStateAction<MembrosResponse[]>> = (value) => {
            setMembros(value);
    };

    return (
        <MembrosContext.Provider value={{ membros, setMembros: setMembrosWithLog }}>
            {children}
        </MembrosContext.Provider>
    );
};

export const useMembros = (): MembrosContextType => {
    const context = useContext(MembrosContext);
    if (!context) {
        throw new Error("useMembros deve ser usado dentro de um MembrosProvider");
    }
    return context;
};