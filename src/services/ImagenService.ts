import Swal from "sweetalert2";
import { BackendClient } from "./BackendClient";
import { IImagen } from "../types/IImagen";

const API_URL = import.meta.env.VITE_API_URL

// Clase ImageService que extiende BackendClient para manejar imágenes con la API
export class ImageService extends BackendClient<IImagen> {
  constructor(baseUrl: string) {
    // Llama al constructor de BackendClient con la URL base de imágenes
    super(`${API_URL}/${baseUrl}`);
  }

  // Método para subir una imagen a la API
  async uploadImage(data: FormData): Promise<string> {
    // Muestra un mensaje de carga utilizando SweetAlert2
    Swal.fire({
      title: "Subiendo Imagen...",
      allowOutsideClick: false, // Impide que el usuario cierre el mensaje accidentalmente
      didOpen: () => {
        Swal.showLoading(); // Muestra el icono de carga
      },
    });
    try {
      // Realiza una solicitud POST a la API para cargar la imagen
      const response = await fetch(`${this.baseUrl}/uploads`, {
        method: "POST",
        body: data, // El cuerpo de la solicitud es el FormData con el archivo
      });

      // Si la respuesta no es satisfactoria, lanza un error
      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }

      // Obtiene el texto de la respuesta, que representa la URL de la imagen cargada
      const newData = await response.text();
      return newData; // Retorna la URL de la imagen
    } finally {
      Swal.close(); // Cierra el mensaje de carga
    }
  }

  // Método para eliminar una imagen específica de un elemento (idElement) en la API
  async deleteImgItems(
    idElement: number,
    url: string,
    pathDelete: string
  ): Promise<void> {

    // Regex para extraer el ID público de la imagen desde su URL de Cloudinary
    const regex =
      /https:\/\/res\.cloudinary\.com\/[\w\-]+\/image\/upload\/([\w\-]+)/;
    const publicId = url.match(regex);
    console.log('public id: ', publicId)

    // Muestra un mensaje de eliminación utilizando SweetAlert2
    Swal.fire({
      title: "Eliminando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Activa el icono de carga
      },
    });

    try {
      // Si no se pudo extraer el ID público, lanza un error
      if (!publicId) {
        throw new Error("ID público de la imagen no encontrado");
      }
      
      // Realiza una solicitud POST a la API para eliminar la imagen en el servidor
      const response = await fetch(
        `${API_URL}/${pathDelete}/deleteImg?id=${idElement}&publicId=${publicId[1]}`,
        {
          method: "POST",
        }
      );
      console.log(`${API_URL}/${pathDelete}/deleteImg?id=${idElement}&publicId=${publicId[1]}`)

      // Si la respuesta no es satisfactoria, lanza un error
      if (!response.ok) {
        throw new Error("Error al eliminar la imagen del servidor");
      }
    } finally {
      Swal.close(); // Cierra el mensaje de eliminación
    }
    console.log(`${API_URL}/${pathDelete}/deleteImg?id=${idElement}&publicId=${publicId[1]}`)
  }

  // Método para eliminar una imagen de Cloudinary directamente
  async deleteImgCloudinary(url: string): Promise<void> {
    // Regex para extraer el ID público de la imagen desde su URL de Cloudinary
    const regex =
      /https:\/\/res\.cloudinary\.com\/[\w\-]+\/image\/upload\/([\w\-]+)/;
    const match = url.match(regex);

    // Muestra un mensaje de eliminación utilizando SweetAlert2
    Swal.fire({
      title: "Eliminando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Activa el icono de carga
      },
    });

    try {
      // Si no se encuentra el ID público, lanza un error
      if (!match) {
        throw new Error("URL no válida o no se pudo extraer el ID público.");
      }

      // Realiza una solicitud POST a la API para eliminar la imagen en Cloudinary
      const response = await fetch(
        `${this.baseUrl}/deleteImg?publicId=${match[1]}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Especificamos el tipo de contenido
          },
        }
      );

      // Si la respuesta no es satisfactoria, lanza un error
      if (!response.ok) {
        throw new Error("Error al eliminar la imagen en Cloudinary");
      }
    } catch (error) {
      // Si ocurre un error, muestra una alerta de error
      Swal.fire("Error", "No se pudo eliminar la imagen.", "error");
    } finally {
      Swal.close(); // Cierra el mensaje de eliminación
    }
  }

  // Método para eliminar una imagen de alérgeno en el servidor
async deleteImgAlergeno(idElement: number, url: string): Promise<void> {
  // Regex para extraer el ID público de la imagen desde su URL de Cloudinary (si es que proviene de Cloudinary)
  const regex =
    /https:\/\/res\.cloudinary\.com\/[\w\-]+\/image\/upload\/([\w\-]+)/;
  const match = url.match(regex);

  // Muestra un mensaje de eliminación utilizando SweetAlert2
  Swal.fire({
    title: "Eliminando imagen de alérgeno...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading(); // Activa el icono de carga
    },
  });

  try {
    // Si no se encuentra el ID público, lanza un error
    if (!match) {
      throw new Error("URL no válida o no se pudo extraer el ID público.");
    }

    // Realiza una solicitud POST a la URL del servidor de alérgenos para eliminar la imagen
    const response = await fetch(
      `${this.baseUrl}/alergenos/deleteImg?id=${idElement}&publicId=${match[1]}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Especificamos el tipo de contenido
        },
      }
    );

    // Si la respuesta no es satisfactoria, lanza un error
    if (!response.ok) {
      throw new Error("Error al eliminar la imagen de alérgeno");
    }
  } catch (error) {
    // Si ocurre un error, muestra una alerta de error
    Swal.fire("Error", "No se pudo eliminar la imagen de alérgeno.", "error");
  } finally {
    Swal.close(); // Cierra el mensaje de eliminación
  }
}
}