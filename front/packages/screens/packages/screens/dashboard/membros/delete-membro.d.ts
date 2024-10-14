/// <reference types="react" />
import type { MembrosResponse } from "../../../../interfaces/membros";
interface DeleteMembroProps {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
    email: string;
    setMembros: React.Dispatch<React.SetStateAction<MembrosResponse[]>>;
}
export declare const DeleteMembro: ({ showModal, setShowModal, email, setMembros, }: DeleteMembroProps) => import("react/jsx-runtime").JSX.Element;
export {};
