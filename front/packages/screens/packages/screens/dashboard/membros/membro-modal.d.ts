import type { Membro } from "../../../../interfaces/membros";
export declare const ModalMembros: ({ showModal, setShowModal, addMembros, editMembro, membroData, }: {
    showModal: boolean;
    setShowModal: any;
    addMembros: (newMembro: Membro) => void;
    editMembro?: ((membro: any) => void) | undefined;
    membroData?: any;
}) => import("react/jsx-runtime").JSX.Element;
