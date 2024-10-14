import type { Atletica } from "../../../../interfaces/atleticas";
export declare const ModalAtletica: ({ showModal, setShowModal, addAtletica, editAtletica, atleticaData, }: {
    showModal: boolean;
    setShowModal: any;
    addAtletica: (newAtletica: Atletica) => void;
    editAtletica?: ((atletica: Atletica) => void) | undefined;
    atleticaData?: Atletica | undefined;
}) => import("react/jsx-runtime").JSX.Element;
