import React, { type ReactNode } from "react";
import type { MembrosResponse } from "../../interfaces/membros";
interface MembrosContextType {
    membros: MembrosResponse[];
    setMembros: React.Dispatch<React.SetStateAction<MembrosResponse[]>>;
}
interface MembrosProviderProps {
    children: ReactNode;
}
export declare const MembrosProvider: React.FC<MembrosProviderProps>;
export declare const useMembros: () => MembrosContextType;
export {};
