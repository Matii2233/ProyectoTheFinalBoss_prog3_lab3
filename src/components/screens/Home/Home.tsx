import { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { EmpresaService } from '../../../services/EmpresaService';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { ModalCrearEmpresa } from '../../ui/modals/modalsEmpresa/modalCrearEmpresa/ModalCrearEmpresa';
import { removeEmpresaActive, setEmpresas } from '../../../redux/store/slices/EmpresaReducer';
import { TarjetaEmpresa } from '../../ui/tarjetas/tarjetaEmpresa/TarjetaEmpresa';
import { TarjetaSucursal } from '../../ui/tarjetas/tarjetaSucursal/TarjetaSucursal'
import { IEmpresa } from '../../../types/dtos/empresa/IEmpresa';
import { ModalCrearSucursal } from '../../ui/modals/modalsSucursal/modalCrearSucursal/ModalCrearSucursal';
import { removeSucursalActive } from '../../../redux/store/slices/SucursalReducer';

export const Home = () => {
    // Estado de empresas
    const [empresas, setEmpresa] = useState<IEmpresa[]>([])
    // Estado del modal crear empresa
    const [openModalEmpresa, setOpenModalEmpresa] = useState(false);
    const [openModalSucursal, setOpenModalSucursal] = useState(false);
    const empresaActive = useAppSelector( (state) => state.empresaReducer.empresaActive );
    const dispatch = useAppDispatch();
    const API_URL = import.meta.env.VITE_API_URL;

    const empresaService = new EmpresaService(API_URL+"/empresas");

    
    const handleOpenModalEmpresa = () => {
        dispatch(removeEmpresaActive())
        setOpenModalEmpresa(true);
    };
    const handleOpenModalSucursal =() =>{
        dispatch(removeSucursalActive())
        setOpenModalSucursal(true);
    }

    // Función para obtener las personas
    const getEmpresas = async () => {
        await empresaService.getAll().then((empresaData) => {
            dispatch(setEmpresas(empresaData));
            setEmpresa(empresaData);
        });
    };

    // Efecto para cargar los datos al inicio
    useEffect(() => {
        getEmpresas();
    }, []);

    return (
        <>
            <div className={styles.containerView}>
                <aside className={styles.asideContainer}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem' }}>Empresas</h1>
                    </div>
                    <div>
                        <button onClick={handleOpenModalEmpresa}>Agregar Empresa</button>
                    </div>
                    <TarjetaEmpresa empresas={empresas}  />
                </aside>

                <div className={styles.mainContainer}>
                    <div className={styles.containerButtonSucursal}>
                        {empresaActive ? (<button onClick={handleOpenModalSucursal} >Agregar Sucursal</button>) : (<div></div>)}
                        
                    </div>
                    <TarjetaSucursal />
                </div>
            </div>

            <ModalCrearEmpresa
                getEmpresas={getEmpresas}
                setOpenModal={setOpenModalEmpresa}
                openModal={openModalEmpresa}
            />
            <ModalCrearSucursal
                openModal={openModalSucursal}
                setOpenModal={setOpenModalSucursal}
            />
        </>
    );
};
