import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import { EmpresaService } from "../../../../../services/EmpresaService";
import { ICreateEmpresaDto } from "../../../../../types/dtos/empresa/ICreateEmpresaDto";
import { removeEmpresaActive } from "../../../../../redux/store/slices/EmpresaReducer"
import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import styles from "./ModalCrearEmpresa.module.css"
import TextFieldValue from "../../../fields/textField/TextField";
import { useState } from "react";
import { UploadImage } from "../../../UploadImage";
import { IEmpresa } from "../../../../../types/dtos/empresa/IEmpresa";

interface IModalEmpresa {
    getEmpresas: Function; // Función para obtener las empresas
    openModal: boolean;
    setOpenModal: (state: boolean) => void;
}

export const ModalCrearEmpresa = ({
    getEmpresas,
    openModal,
    setOpenModal,
}: IModalEmpresa) => {
    // Valores iniciales para el formulario
    const initialValues: ICreateEmpresaDto = {
        nombre: "",
        razonSocial: "",
        cuit: 0,
        logo: null,
    };
    const [image, setImage] = useState<string|null>()
    const API_URL = import.meta.env.VITE_API_URL;


    const empresaActive = useAppSelector(
        (state) => state.empresaReducer.empresaActive
    );
    const dispatch = useAppDispatch();

    const handleClose = () => {
        setOpenModal(false);
        dispatch(removeEmpresaActive());
    };
    return (
        <div>
            <Modal
                id={"empresaModal"}
                show={openModal}
                onHide={handleClose}
                size={"lg"}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className={styles.modalHeader}>
                    {/* Título del modal dependiendo de si se está editando o añadiendo una empresa */}
                    {empresaActive ? (
                        <Modal.Title>Editar empresa</Modal.Title>
                    ) : (
                        <Modal.Title>Crear una empresa</Modal.Title>
                    )}
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <Formik
                        validationSchema={Yup.object({
                            nombre: Yup.string().required("campo requerido"),
                            razonSocial: Yup.string().required("campo requerido"),
                            cuit: Yup.number().required('campo requerido'),
                        })
                        }
                        initialValues={empresaActive ? empresaActive : initialValues}
                        enableReinitialize={true}
                        onSubmit={async (values: ICreateEmpresaDto) => {
                            (image ? (values.logo = image) : (values.logo = null))
                            // Enviar los datos al servidor al enviar el formulario
                            if (empresaActive) {
                                const empresaService = new EmpresaService(API_URL + "/empresas");
                                await empresaService.put(empresaActive.id, values);
                            } else {
                                const empresaService = new EmpresaService(API_URL + "/empresas");
                                await empresaService.post(values);
                            }
                            // Obtener las personas actualizadas y cerrar el modal
                            getEmpresas();
                            handleClose();
                        }}
                    >
                        {() => (
                            <>
                                <Form autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: "5vh" }}>
                                    <div className={styles.containerFormModal}>
                                        <TextFieldValue
                                            name="nombre"
                                            type="text"
                                            placeholder="Ingrese el nombre de la empresa"
                                            customWidth="45vw"
                                        />
                                        <TextFieldValue
                                            name="razonSocial"
                                            type="text"
                                            placeholder="Ingrese la razón social de la empresa"
                                            customWidth="45vw"
                                        />
                                        <TextFieldValue
                                            name="cuit"
                                            type="number"
                                            placeholder="Ingrese el cuit de la empresa"
                                            customWidth="45vw"
                                        />
                                        <div className={styles.containerAgregarimagen}>
                                            <UploadImage image={image} setImage={setImage} elementActive={empresaActive as IEmpresa}/>
                                        </div>
                                    </div>
                                    <div className={styles.containerBotonesFormModal}>
                                        <Button className={styles.buttonModalCancelar} onClick={handleClose}>Cancelar</Button>
                                        <Button className={styles.buttonModalConfirmar} type="submit">Confirmar</Button>
                                    </div>
                                </Form>
                            </>
                        )}
                    </Formik>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: "#08192D", borderTop: "none" }}></Modal.Footer>
            </Modal>
        </div>
    )
}
