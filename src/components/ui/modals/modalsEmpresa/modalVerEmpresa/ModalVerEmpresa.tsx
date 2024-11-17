import { FC } from 'react';
import { Modal } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import styles from "./ModalVerEmpresa.module.css"

interface IModalVerEmpresa {
    openModal: boolean;
    setOpenModal: (state: boolean) => void;
}

export const ModalVerEmpresa: FC<IModalVerEmpresa> = ({ openModal, setOpenModal }) => {
    const empresaActive = useAppSelector(
        (state) => state.empresaReducer.empresaActive
    );
    const handleClose = () => {
        setOpenModal(false);
    };
    return (
        <Modal
            id={"verEmpresaModal"}
            show={openModal}
            onHide={handleClose}
            size={"sm"}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header className={styles.modalHeader}>
                <Modal.Title>Empresa</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                <div style={{display:"flex", flexDirection:"column"}}>
                    <p>Nombre: {empresaActive?.nombre}</p>
                    <p>Razón Social: {empresaActive?.razonSocial}</p>
                    <p>CUIT: {empresaActive?.cuit}</p>
                    <p>Logo: {empresaActive?.logo ? (<img src={empresaActive.logo} ></img>) : ("La empresa no tiene un logo") }</p>
                </div>
            </Modal.Body>
            <Modal.Footer className={styles.modalFooter}>
                <button onClick={handleClose}>Cerrar</button>
            </Modal.Footer>
        </Modal>
    );
};