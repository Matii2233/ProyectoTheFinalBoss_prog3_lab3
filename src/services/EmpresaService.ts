import { ICreateEmpresaDto } from "../types/dtos/empresa/ICreateEmpresaDto";
import { IEmpresa } from "../types/dtos/empresa/IEmpresa";
import { IUpdateEmpresaDto } from "../types/dtos/empresa/IUpdateEmpresaDto";
import { BackendClient } from "./BackendClient";

export class EmpresaService extends BackendClient<IEmpresa | ICreateEmpresaDto | IUpdateEmpresaDto> {
    async getAll(): Promise<IEmpresa[]> {
        const response = await fetch(`${this.baseUrl}`);
        const data = await response.json();
        return data as IEmpresa[];
    }
}
