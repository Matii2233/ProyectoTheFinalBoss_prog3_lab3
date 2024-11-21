import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import { removeSucursalActive } from "../../../../../redux/store/slices/SucursalReducer";
import { Modal } from "react-bootstrap";
import styles from "./ModalVerSucursal.module.css"

interface IModalVerEmpresa {
    openModal: boolean;
    setOpenModal: (state: boolean) => void;
}
export const ModalVerSurcusal: FC<IModalVerEmpresa> = ({ openModal, setOpenModal }: IModalVerEmpresa) => {
    const dispatch = useAppDispatch();

    const sucursalActive = useAppSelector(
        (state) => state.sucursalReducer.sucursalActive
    );
    const handleClose = () => {
        setOpenModal(false);
        dispatch(removeSucursalActive());
    };
    return (
        <Modal
            id={"verSucursalModal"}
            show={openModal}
            onHide={handleClose}
            size={"sm"}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header className={styles.modalHeader}>
                <Modal.Title>Sucursal</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p>Nombre: {sucursalActive?.nombre}</p>
                    <p>Empresa: {sucursalActive?.empresa.nombre}</p>
                    <p>Domicilio: {sucursalActive?.domicilio.calle + " " + sucursalActive?.domicilio.numero}</p>
                    <p>Casa Matriz: {sucursalActive?.esCasaMatriz ? ("Si") : ("No")}</p>
                    <p>Apertura: {sucursalActive?.horarioApertura}</p>
                    <p>Cierre: {sucursalActive?.horarioCierre}</p>
                    <p>Logo: {sucursalActive?.logo ? (<img src={sucursalActive.logo} ></img>) : ("La sucursal no tiene un logo")}</p>
                </div>
            </Modal.Body>
            <Modal.Footer className={styles.modalFooter}>
                <button onClick={handleClose}>Cerrar</button>
            </Modal.Footer>
        </Modal>
    )
}
