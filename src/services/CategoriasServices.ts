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
}