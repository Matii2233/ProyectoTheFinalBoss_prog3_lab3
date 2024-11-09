import { FC } from "react";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import noImage from "../../assets/images/noImage.jpeg"
import { IImagen } from "../../types/IImagen";
import { ImageService } from "../../services/ImagenService";
import { IAlergenos } from "../../types/dtos/alergenos/IAlergenos";
import { IProductos } from "../../types/dtos/productos/IProductos";
import { ICategorias } from "../../types/dtos/categorias/ICategorias";
import { ISucursal } from "../../types/dtos/sucursal/ISucursal";
import { IEmpresa } from "../../types/dtos/empresa/IEmpresa";

// Definimos la interfaz de las propiedades que recibirá el componente UploadImage
interface IUploadImage {
  elementActive: IAlergenos | IProductos | ICategorias | ISucursal | IEmpresa
  image?: string | null; // URL de la imagen cargada, opcional
  setImage?: (image: string | null) => void; // Función para actualizar la imagen cargada
  imageObjeto?: IImagen | null; // Objeto de tipo IImagen que representa la imagen cargada
  setImageObjeto?: (image: IImagen | null) => void; // Función para actualizar el objeto de imagen
  typeElement?: string; // Tipo de elemento que se utilizará al eliminar la imagen
}

// Componente funcional que permite subir y eliminar imágenes
export const UploadImage: FC<IUploadImage> = ({
  elementActive,
  image,
  setImage,
  imageObjeto,
  setImageObjeto,
  typeElement,
}) => {
  // Instanciamos el servicio para manejar las imágenes
  const API_URL = import.meta.env.VITE_API_URL
  const imageService = new ImageService(`${API_URL}/images`);

  // Función para manejar el cambio de archivo en el input de carga de imágenes
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Verificamos si existe un archivo seleccionado
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("uploads", file); // Agregamos el archivo al FormData para enviarlo

      // Muestra un mensaje de carga con SweetAlert2
      Swal.fire({
        title: "Subiendo...",
        didOpen: () => {
          Swal.showLoading(); // Activa el icono de carga
        },
      });

      try {
        // Subimos la imagen utilizando el servicio y obtenemos la URL de la imagen cargada
        const data = await imageService.uploadImage(formData);

        // Si setImage está definido, actualizamos la URL de la imagen cargada
        if (setImage) {
          setImage(data);
        }

        // Si setImageObjeto está definido, actualizamos el objeto de imagen con la URL y el nombre del archivo
        if (setImageObjeto) {
          setImageObjeto({
            url: data,
            name: file.name,
          });
        }
      } catch (error) {
        console.log(error); // En caso de error, lo mostramos en la consola
      }

      Swal.close(); // Cerramos el mensaje de carga
    }
  };

  // Función para manejar la eliminación de la imagen
  const handleDeleteImagen = async () => {
    // Si existe un objeto de imagen y la función para actualizarlo
    if (imageObjeto && setImageObjeto && elementActive && typeElement) {
      await imageService
        .deleteImgItems(elementActive?.id, imageObjeto.url, typeElement)
        .then(() => {
          setImageObjeto(null); // Eliminamos el objeto de imagen
        });
    }
    // Si existe solo la URL de la imagen
    else if (image && setImage) {
      await imageService.deleteImgCloudinary(image).then(() => {
        setImage(null); // Eliminamos la URL de la imagen
      });
    }
  };

  return (
    <div
      style={{
        width: "22vw",
        border: "1px solid #ccc",
        borderRadius: ".4rem",
        padding: ".4rem",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Si hay una imagen cargada, mostramos la vista con la imagen y el botón para eliminarla */}
      {image || imageObjeto ? (
        <div
          style={{
            width:'300px',
            borderRadius: ".4rem",
            display: "flex",
            justifyContent:'center',
            alignItems: "center",
            padding: ".4rem",
          }}
        >
          <div style={{ width: "10vw" }}>
            <Button
              onClick={handleDeleteImagen} // Ejecuta la función de eliminación de imagen
              variant="outlined"
              color="error"
            >
              Eliminar imagen
            </Button>
          </div>
          <img
            src={imageObjeto ? imageObjeto.url : image!} // Muestra la imagen desde el objeto o URL
            alt="Uploaded"
            style={{
              backgroundColor: "#ccc",
              maxWidth:"100px",
              maxHeight:"100px",
              borderRadius: ".4rem",
              objectFit: "fill",
            }}
          />
          
        </div>
      ) : (
        <>
          {/* Si no hay imagen cargada, mostramos el input para seleccionar una nueva imagen */}
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="contained-button-file"
            type="file"
            onChange={handleFileChange} // Ejecuta la función de cambio de archivo
          />
          <label htmlFor="contained-button-file">
            <Button variant="outlined" component="span">
              Elige una imagen
            </Button>
          </label>
          <div>
            <img
              src={noImage} // Muestra una imagen de reemplazo si no hay imagen cargada
              alt="Uploaded"
              style={{ maxWidth: "100px", height: "auto" }}
            />
          </div>
        </>
      )}
    </div>
  );
};