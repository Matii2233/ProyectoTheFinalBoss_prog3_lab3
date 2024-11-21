import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextFieldValue from "../../fields/textField/TextField";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { CategoriasServices } from "../../../../services/CategoriasServices";
import { ICreateCategoria } from "../../../../types/dtos/categorias/ICreateCategoria";
import { ICategorias } from "../../../../types/dtos/categorias/ICategorias";
import { removeCategoriaActive } from "../../../../redux/store/slices/CategoriasReducer";

interface IPropsModalCrearCategoria {
  getCategorias: () => void;
  isOpenModal: boolean;
  setIsOpenModal: (state: boolean) => void;
  categoriaActive: ICategorias | null;
}

export const ModalCrearCategoria = ({
  getCategorias,
  isOpenModal,
  setIsOpenModal,
  categoriaActive,
}: IPropsModalCrearCategoria) => {
  const empresaActive = useAppSelector(
    (state) => state.empresaReducer.empresaActive
  );
  const dispatch = useAppDispatch(); // Agregado: Obtiene dispatch

  const handleClose = () => {
    dispatch(removeCategoriaActive()); // Resetea categoriaActive al cerrar el modal
    setIsOpenModal(false); // Cierra el modal
  };

  const API_URL = import.meta.env.VITE_API_URL;
  const categoriasService = new CategoriasServices(API_URL + "/categorias");

  const initialValues: ICreateCategoria = {
    denominacion: categoriaActive ? categoriaActive.denominacion : "",
    idEmpresa: empresaActive?.id || 0,
    idCategoriaPadre: categoriaActive ? categoriaActive.idCategoriaPadre : null,
  };

  return (
    <Modal show={isOpenModal} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {categoriaActive ? "Editar Categoría" : "Crear Categoría"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={categoriaActive || initialValues}
          validationSchema={Yup.object({
            denominacion: Yup.string().required("El nombre es requerido"),
          })}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            console.log("Valores enviados:", values); // Verifica los datos enviados
            try {
              setSubmitting(true);
              if (categoriaActive) {
                await categoriasService.put(categoriaActive.id, values);
              } else {
                await categoriasService.post(values);
              }
              getCategorias();
              handleClose();
            } catch (error) {
              console.error("Error al crear/editar categoría:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {() => (
            <Form>
              <TextFieldValue
                name="denominacion"
                placeholder="Nombre de la categoría"
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <Button variant="secondary" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Confirmar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};
