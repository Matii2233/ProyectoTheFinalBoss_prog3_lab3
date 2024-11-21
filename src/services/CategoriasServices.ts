import Swal from "sweetalert2";
import { ICategorias } from "../types/dtos/categorias/ICategorias";
import { ICreateCategoria } from "../types/dtos/categorias/ICreateCategoria";
import { IUpdateCategoria } from "../types/dtos/categorias/IUpdateCategoria";
import { BackendClient } from "./BackendClient";


export class CategoriasServices extends BackendClient<ICategorias | ICreateCategoria | IUpdateCategoria>{
    async getAll(): Promise<ICategorias[]> {
        const response = await fetch(`${this.baseUrl}`);
        const data = await response.json();
        return data as ICategorias[]
    }

    async post(data: ICreateCategoria): Promise<ICreateCategoria> {
        Swal.fire({
          title: "Creando categoría...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          const response = await fetch(`${this.baseUrl}/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
    
          if (!response.ok) {
            const errorText = await response.text(); // Leer respuesta del error
            console.error("Error al crear la categoría:", errorText);
            throw new Error("Error al crear la categoría");
          }
    
          return response.json(); // Devuelve la categoría creada
        } catch (error) {
          console.error("Error en POST:", error);
          throw error;
        } finally {
          Swal.close();
        }
      }

      async deleteById(id: number): Promise<void> {
        Swal.fire({
          title: "Eliminando...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          const response = await fetch(`${this.baseUrl}/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error(`Error al eliminar la categoría`);
          }
        } finally {
          Swal.close();
        }
      }
    

      async put(id: number, data: IUpdateCategoria): Promise<IUpdateCategoria> {
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
            throw new Error(`Error al editar la categoría`);
          }
          const updatedData = await response.json();
          return updatedData as IUpdateCategoria;
        } finally {
          Swal.close();
        }
      }
    
      async getCategoriasPadrePorSucursal(
        idSucursal: number
      ): Promise<ICategorias[]> {
        try {
          const response = await fetch(
            `${this.baseUrl}/allCategoriasPadrePorSucursal/${idSucursal}`
          );
          if (!response.ok) {
            throw new Error("Error al obtener categorías padre por sucursal");
          }
          return await response.json();
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

      async getSubcategoriasPorCategoriaPadre(
        idCategoriaPadre: number,
        idSucursal: number
      ): Promise<ICategorias[]> {
        try {
          const response = await fetch(
            `${this.baseUrl}/allSubCategoriasPorCategoriaPadre/${idCategoriaPadre}/${idSucursal}`
          );
          if (!response.ok) {
            throw new Error("Error al obtener subcategorías por categoría padre");
          }
          return await response.json();
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    
    async getSubcategoriasBySucursal(id: number): Promise<ICategorias[]> {
        const response = await fetch(`${this.baseUrl}/allSubCategoriasPorSucursal/${id}`);
        const data = await response.json();
        return data as ICategorias[]
            
    }

    // Nuevo método: Crear una subcategoría
  async createSubcategoria(data: {
    denominacion: string;
    idEmpresa: number;
    idCategoriaPadre: number | null;
  }): Promise<void> {
    Swal.fire({
      title: "Creando subcategoría...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        // Corrige aquí el endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al crear la subcategoría");
      }

      return await response.json(); // Devuelve la respuesta para obtener el ID de la subcategoría creada
    } finally {
      Swal.close();
    }
  }

  // Nuevo método: Editar una subcategoría
  async updateSubcategoria(
    id: number,
    data: {
      denominacion: string;
      idEmpresa: number;
      idCategoriaPadre: number | null;
      eliminado?: boolean;
      idSucursales?: number[];
    }
  ): Promise<void> {
    Swal.fire({
      title: "Editando subcategoría...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await fetch(`${this.baseUrl}/update/${id}`, {
        // Ajustar aquí el endpoint
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Error al editar la subcategoría");
      }
    } finally {
      Swal.close();
    }
  }
}