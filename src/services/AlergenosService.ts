import Swal from "sweetalert2";
import { IAlergenos } from "../types/dtos/alergenos/IAlergenos";
import { ICreateAlergeno } from "../types/dtos/alergenos/ICreateAlergeno";
import { IUpdateAlergeno } from "../types/dtos/alergenos/IUpdateAlergeno";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de empresa
export class AlergenosService extends BackendClient<IAlergenos | ICreateAlergeno | IUpdateAlergeno> {
  async getAll(): Promise<IAlergenos[]> {
    const response = await fetch(`${this.baseUrl}`);
    const data = await response.json();
    return data as IAlergenos[];
  }

  async post(data: ICreateAlergeno): Promise<ICreateAlergeno> {
    Swal.fire({
      title: "Enviando datos...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Error`);
      }
      const newData = await response.json();
      return newData as ICreateAlergeno;
    } finally {
      Swal.close();
    }
  }

  async put(id: number, data: IUpdateAlergeno): Promise<IUpdateAlergeno> {
    Swal.fire({
      title: "Editando datos...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Error`);
      }
      const newData = await response.json();
      return newData as IUpdateAlergeno;
    } finally {
      Swal.close();
    }
  }


  // async deleteById(id: number): Promise<void> {
  //   const response = await fetch(`${this.baseUrl}/${id}`, {
  //     method: "DELETE",
  //   });
  //   if (!response.ok) {
  //     throw new Error(`Error al eliminar el elemento con ID ${id}`);
  //   }
  // }

  // Método para eliminar un elemento por su ID
  async deleteById(id: number): Promise<void> {
    Swal.fire({
      title: "Eliminando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      console.log(this.baseUrl)
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error`);
      }
    } finally {
      Swal.close();
    }
  }
}