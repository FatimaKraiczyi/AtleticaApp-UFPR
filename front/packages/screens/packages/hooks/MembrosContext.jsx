import React, { createContext, useContext, useState } from "react";
const MembrosContext = createContext(undefined);
export const MembrosProvider = ({ children }) => {
    const [membros, setMembros] = useState([]);
    const setMembrosWithLog = (value) => {
        setMembros(value);
    };
    return (<MembrosContext.Provider value={{ membros, setMembros: setMembrosWithLog }}>
            {children}
        </MembrosContext.Provider>);
};
export const useMembros = () => {
    const context = useContext(MembrosContext);
    if (!context) {
        throw new Error("useMembros deve ser usado dentro de um MembrosProvider");
    }
    return context;
};
