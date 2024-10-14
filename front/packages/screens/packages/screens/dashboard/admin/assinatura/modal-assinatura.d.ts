import type { Assinatura } from "../../../interfaces/assinatura";
export declare const ModalAssinatura: ({ showModal, setShowModal, addAssinatura, editAssinatura, assinaturaData, }: {
    showModal: boolean;
    setShowModal: any;
    addAssinatura: (newAssinatura: Assinatura) => void;
    editAssinatura?: ((assinatura: Assinatura) => void) | undefined;
    assinaturaData?: Assinatura | undefined;
}) => import("react/jsx-runtime").JSX.Element;
