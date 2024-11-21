import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { CategoriasServices } from "../../../../services/CategoriasServices";
import { ICategorias } from "../../../../types/dtos/categorias/ICategorias";
import { Dispatch } from "@reduxjs/toolkit";
import { SetStateAction } from "react";
import Swal from "sweetalert2";

const ModalCrearSubcategoria = ({
  isOpenModal,
  setIsOpenModal,
  categoriaPadreId,
  getCategorias,
  setCategorias, // Ahora se define correctamente el tipo
  subcategoriaSeleccionada,
  empresaActiva,
}: {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  categoriaPadreId: number | null;
  getCategorias: () => void;
  setCategorias: Dispatch<SetStateAction<ICategorias[]>>; // Tipo correcto para setCategorias
  subcategoriaSeleccionada: ICategorias | null; // Ajusta si tienes un tipo específico para subcategorías
  empresaActiva: any; // Define un tipo más específico si es posible
}) => {
  const [subcategoriaName, setSubcategoriaName] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const categoriaService = new CategoriasServices(API_URL + "/categorias");

  // Manejar el cierre del modal
  const handleClose = () => {
    setIsOpenModal(false);
    setSubcategoriaName("");
  };

  // Actualiza el estado al abrir el modal para edición
  useEffect(() => {
    if (subcategoriaSeleccionada) {
      setSubcategoriaName(subcategoriaSeleccionada.denominacion);
    } else {
      setSubcategoriaName("");
    }
  }, [subcategoriaSeleccionada]);

  const handleSubmit = async () => {
    if (!subcategoriaName.trim()) {
      Swal.fire(
        "Error",
        "El nombre de la subcategoría no puede estar vacío",
        "error"
      );
      return;
    }

    try {
      if (subcategoriaSeleccionada) {
        // Modo edición
        const updatedSubcategoria = {
          ...subcategoriaSeleccionada,
          denominacion: subcategoriaName,
        };
        await categoriaService.updateSubcategoria(subcategoriaSeleccionada.id, {
          denominacion: subcategoriaName,
          idEmpresa: empresaActiva.id,
          idCategoriaPadre: categoriaPadreId,
        });

        setCategorias((prevCategorias) =>
          prevCategorias.map((categoria) =>
            categoria.id === categoriaPadreId
              ? {
                  ...categoria,
                  subCategorias: categoria.subCategorias.map((subcategoria) =>
                    subcategoria.id === subcategoriaSeleccionada.id
                      ? updatedSubcategoria
                      : subcategoria
                  ),
                }
              : categoria
          )
        );

        Swal.fire("Éxito", "Subcategoría editada correctamente", "success");
      } else {
        // Modo creación
        const nuevaSubcategoria = {
          denominacion: subcategoriaName,
          idEmpresa: empresaActiva.id,
          idCategoriaPadre: categoriaPadreId,
        };
        const response = await categoriaService.createSubcategoria(
          nuevaSubcategoria
        );

        setCategorias((prevCategorias) =>
          prevCategorias.map((categoria) =>
            categoria.id === categoriaPadreId
              ? {
                  ...categoria,
                  subCategorias: [
                    ...(categoria.subCategorias || []),
                    { ...nuevaSubcategoria, id: response.id },
                  ],
                }
              : categoria
          )
        );

        Swal.fire("Éxito", "Subcategoría creada correctamente", "success");
      }

      setIsOpenModal(false);
    } catch (error) {
      console.error("Error al crear/editar la subcategoría", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al intentar crear/editar la subcategoría",
        "error"
      );
    }
  };

  console.log('id categoria padre: ', categoriaPadreId)

  return (
    <Modal show={isOpenModal} onHide={handleClose}>
      <Modal.Header closeButton className="modal-header">
        <Modal.Title>
          {subcategoriaSeleccionada
            ? "Editar Subcategoría"
            : "Crear Subcategoría"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Form>
          <Form.Group className="mb-3" controlId="subcategoriaName">
            <Form.Label>Nombre de Subcategoría</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre de la subcategoría"
              value={subcategoriaName}
              onChange={(e) => setSubcategoriaName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <Button className="modal-button-cancel" onClick={handleClose}>
          Cerrar
        </Button>
        <Button className="modal-button-confirm" onClick={handleSubmit}>
          {subcategoriaSeleccionada ? "Guardar Cambios" : "Crear Subcategoría"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCrearSubcategoria;
