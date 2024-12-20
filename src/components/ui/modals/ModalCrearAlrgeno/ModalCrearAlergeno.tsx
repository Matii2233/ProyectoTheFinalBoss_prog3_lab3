import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ICreateAlergeno } from "../../../../types/dtos/alergenos/ICreateAlergeno";
import { AlergenosService } from "../../../../services/AlergenosService";
import TextFieldValue from "../../fields/textField/TextField";
import styles from "./ModalCrearAlergeno.module.css"
import { UploadImage } from "../../UploadImage";
import { removeAlergenoActive } from "../../../../redux/store/slices/AlergenoReducer";
import { IUpdateAlergeno } from "../../../../types/dtos/alergenos/IUpdateAlergeno";
import { useEffect, useState } from "react";
import { IImagen } from "../../../../types/IImagen";

interface IProprModalCrearAlergeno {
  getAlergenos: Function
  isOpenModal: boolean
  setIsOpenModal: (state: boolean) => void;
}

export const ModalCrearAlergeno = ({ getAlergenos, isOpenModal, setIsOpenModal }: IProprModalCrearAlergeno) => {

  const initialValues: ICreateAlergeno = {
    denominacion: "",
    imagen: null
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const dispatch = useAppDispatch()

  const alergenoActive = useAppSelector(
    (state) => state.alergenoReducer.alergenoActive
  );

  const [imageAlergeno, setImageAlergeno] = useState<IImagen | null>(null);

  // Usamos useEffect para actualizar imageAlergeno cuando alergenoActive cambie
  useEffect(() => {
    if (alergenoActive && alergenoActive.imagen) {
      setImageAlergeno(alergenoActive.imagen); // Actualizamos el estado local con la imagen del alergeno
    } else {
      setImageAlergeno(null); // Si no hay imagen en alergenoActive, reseteamos el estado local
    }
  }, [alergenoActive]); // Solo se ejecuta cuando `alergenoActive` cambia

  const handleClose = () => {
    setIsOpenModal(false)
    dispatch(removeAlergenoActive())
  }

  return (
    <>
      <div>
        <Modal
          id={"empresaModal"}
          show={isOpenModal}
          onHide={handleClose}
          size={"lg"}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header className={styles.header}>

            {/* Título del modal dependiendo de si se está editando o añadiendo una empresa */}
            {alergenoActive ? (
              <Modal.Title>Editar alergeno</Modal.Title>
            ) : (
              <Modal.Title>Crear Alergeno</Modal.Title>
            )}
          </Modal.Header>
          <Modal.Body className={styles.body}>
            <Formik
              validationSchema={Yup.object({
                denominacion: Yup.string().required("campo requerido"),
              })
              }
              initialValues={alergenoActive ? alergenoActive : initialValues}
              enableReinitialize={true}
              onSubmit={async (values: ICreateAlergeno | IUpdateAlergeno) => {
                (imageAlergeno ? (values.imagen = imageAlergeno) : (values.imagen = null))
                values.imagen = imageAlergeno

                const alergenoService = new AlergenosService(API_URL + "/alergenos");
                if (alergenoActive) {
                  await alergenoService.put(alergenoActive.id, values as IUpdateAlergeno);
                } else {
                  await alergenoService.post(values as ICreateAlergeno);
                }
                // Obtener las personas actualizadas y cerrar el modal
                getAlergenos();
                handleClose();
              }}
            >
              {() => (
                <>
                  <Form autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: "5vh" }}>
                    <div className={styles.formContainer}>
                      <TextFieldValue
                        name="denominacion"
                        type="text"
                        placeholder="Ingrese su nombre"
                        customWidth="45vw"
                      />

                      <div className={styles.containerAgregarimagen}>
                        <UploadImage
                        imageObjeto={imageAlergeno}
                        setImageObjeto={setImageAlergeno}
                        typeElement='alergenos'
                        />
                        
                      </div>
                    </div>
                    <div className={styles.containerBotonesFormModal}>
                      <Button className={styles.buttonModalCancelar} onClick={handleClose}>Cancelar</Button>
                      <Button className={styles.buttonModalConfirmar} type="submit" >Confirmar</Button>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#08192D", borderTop: "none" }}></Modal.Footer>
        </Modal>
      </div>
    </>
  )
}
