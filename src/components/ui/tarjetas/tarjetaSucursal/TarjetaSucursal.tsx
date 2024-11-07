import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { SucursalService } from "../../../../services/SucursalService";
import { setSucursalActive, setSucursalesPorEmpresa } from "../../../../redux/store/slices/SucursalReducer";
import { ISucursal } from "../../../../types/dtos/sucursal/ISucursal";
import { ModalVerSurcusal } from "../../modals/modalsSucursal/modalVerSucursal/ModalVerSurcusal";
import styles from "./TarjetaSucursal.module.css"
import Buttons from "../../buttons/Buttons";
import { ModalCrearSucursal } from "../../modals/modalsSucursal/modalCrearSucursal/ModalCrearSucursal";
import { Link } from "react-router-dom";

export const TarjetaSucursal = () => {

    const [openModalCrearSucursal, setOpenModalCrearSucursal] = useState(false)
    const [openModalVerSucursal, setOpenModalVerSucursal] = useState(false)
    const iconScale:string = "1.3"
    const empresaActive = useAppSelector(
        (state) => state.empresaReducer.empresaActive
    );

    const dispatch = useAppDispatch();
    const API_URL = import.meta.env.VITE_API_URL;
    const sucursalService = new SucursalService(API_URL + "/sucursales/porEmpresa")

    const [sucursalesEmpresa, setSucursalesEmpresa] = useState<ISucursal[]>([])
    const getSucursales = async () => {
        empresaActive ?
            (
                await sucursalService.getAllByEmpresaId(empresaActive.id).then((sucursalesData) => {
                    dispatch(setSucursalesPorEmpresa({ empresaId: empresaActive.id, sucursales: sucursalesData }))
                    setSucursalesEmpresa(sucursalesData)
                })
            )
            :
            (console.log("No hay una empresa activa"))
    }
    useEffect(() => {
        getSucursales();
    }, [empresaActive, openModalCrearSucursal]);

    const handleVerSucursal = (sucursal: ISucursal)=>{
        dispatch(setSucursalActive(sucursal))
        setOpenModalVerSucursal(true)
    }
    const handleEditarSucursal = (sucursal: ISucursal)=>{
        dispatch(setSucursalActive(sucursal))
        setOpenModalCrearSucursal(true)
    }
    return (
        <div className={styles.containerSucursales}>
            {sucursalesEmpresa.map((sucursal, index) => (
                <div key={index} className={styles.contenedorTarjetaSucursal}>
                    <div className={styles.headerTarjetaSucursal}>
                        <h3 style={{ fontSize: "18px" }}>{sucursal.nombre}</h3>
                        <h4 style={{ fontSize: "18px" }}>{sucursal.horarioApertura.substring(0, 5)} - {sucursal.horarioCierre.substring(0, 5)}</h4>
                    </div>
                    <div className={styles.bodyTarjetaSucursal}>
                        <div className={styles.contenedorImagenTarjetaSucursal}>
                            {sucursal.logo !== null ?
                                (<img src={sucursal.logo} />)
                                :
                                (<span className="material-symbols-outlined" style={{ scale: '3.8' }} >no_photography</span>)
                            }
                        </div>
                        <div className={styles.contenedorBotonesTarjetaSucursal} style={{marginTop: "10px"}}>
                            <Buttons onClick={() => handleEditarSucursal(sucursal)} buttonColor={"0077FF"}><span className="material-symbols-outlined" style={{ scale: iconScale, display:"flex", alignItems:"center", justifyContent:"center"}}>edit</span></Buttons>
                            <Link to={`/sucursal`}>
                              <Buttons buttonColor={"00A419"}><span className="material-symbols-outlined" style={{ scale: iconScale, display:"flex", alignItems:"center", justifyContent:"center"}}>apartment</span></Buttons>
                            </Link>
                            <Buttons onClick={() => handleVerSucursal(sucursal)} buttonColor={"FC7600"}><span className="material-symbols-outlined" style={{ scale: iconScale, display:"flex", alignItems:"center", justifyContent:"center"}}>visibility</span></Buttons>
                        </div>
                    </div>
                </div>
            ))}
            <ModalVerSurcusal 
                openModal={openModalVerSucursal}
                setOpenModal={setOpenModalVerSucursal}
            />
            <ModalCrearSucursal openModal={openModalCrearSucursal} setOpenModal={setOpenModalCrearSucursal} />
        </div>
    )
}
