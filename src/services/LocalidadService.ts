import { ILocalidad } from "../types/ILocalidad";
import { BackendClient } from "./BackendClient";

export class LocalidadService extends BackendClient<ILocalidad> {
    async getAllByProvinciaId(id:number): Promise<ILocalidad[]> {
        const response = await fetch(`${this.baseUrl}/${id}`);
        const data = await response.json();
        return data as ILocalidad[];
    }
}