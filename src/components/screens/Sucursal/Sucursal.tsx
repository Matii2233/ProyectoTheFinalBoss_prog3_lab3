import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import Buttons from "../../ui/buttons/Buttons"
import { TableGeneric } from "../../ui/TableGeneric/TableGeneric"
import styles from "./Sucursal.module.css"
import { Button } from "react-bootstrap"
import { IAlergenos } from "../../../types/dtos/alergenos/IAlergenos"
import { useEffect, useState } from "react"
import { AlergenosService } from "../../../services/AlergenosService"
import { ModalCrearAlergeno } from "../../ui/modals/ModalCrearAlrgeno/ModalCrearAlergeno"
import { setDataAlergeno } from "../../../redux/store/slices/AlergenoReducer"
import { ProductosService } from "../../../services/ProductosService"
import { setDataProducto } from "../../../redux/store/slices/ProductoReducer"
import { useNavigate } from "react-router-dom"


export const Sucursal = () => {
  const [isAlergenosOpen, setIsAlergenosOpen] = useState(false)

  const [alergenos, setAlergeno] = useState<IAlergenos[]>()

  const [isOpenModal, setIsOpenModal] = useState(false)

  // Guardamos el useAppDispatch
  const dispatch = useAppDispatch()

  // Guardamos la variable de entorno
  const API_URL = import.meta.env.VITE_API_URL;
  
  // Alergenos
  const alergenosData = useAppSelector( (state) => state.alergenoReducer.dataAlergenos )

  // Productos
  const productosData = useAppSelector( (state) => state.productoReducer.dataProductos )

  // Guardamos un objeto AlergenosService del service de alergenos
  const alergenosService = new AlergenosService(API_URL+"/alergenos")

  // Guardamos un objeto AlergenosService del service de alergenos
  const productosService = new ProductosService(API_URL+"/articulos")

  // Función para obtener las personas
  const getAlergenos = async () => {
    await alergenosService.getAll().then((alergenosData) => {
        dispatch(setDataAlergeno(alergenosData));
        setAlergeno(alergenosData);
    });
  };

  // Eliminar un alergeno
  const handleDeleteAlergeno = async (id: number) => {
    try {
      await alergenosService.deleteById(id);
      // Actualiza la lista para reflejar el cambio
      const updatedAlergenos = alergenos?.filter(alergeno => alergeno.id !== id);
      setAlergeno(updatedAlergenos);
      dispatch(setDataAlergeno(updatedAlergenos || []));
    } catch (error) {
      console.error(error);
    }
  };

  // Función para obtener las personas
  const getProductos = async () => {
    await productosService.getAll().then((productosData) => {
      dispatch(setDataProducto(productosData));
    });
  };

  // Cargar todos los alergenos y productos
  useEffect( ()=>{
    getAlergenos()
  },[] )

  useEffect( ()=>{
    getProductos()
  },[] )

  const alergenosColumns = [
    {
      label: 'Nombre',
      key: 'denominacion',
    },
    {
      label: 'AlergenoId',
      key: 'imagen',
      render: (alergenos:IAlergenos) => {
        return alergenos?alergenos.id:'alergeno sin Id'
      }
    },
    {
      label: 'Acciones',
      key: 'acciones',
    },
  ];

  const navigate = useNavigate()

  // Metodo handle para volver al home 
  const handleBackToHome = () => {
    navigate("/")
  }

  const handleOpenEditarAlergeno = () => {
    setIsOpenModal(true)
  }

  const empresaActive = useAppSelector( (state) => state.empresaReducer.empresaActive );

  const sucursalActive = useAppSelector( (state) => state.sucursalReducer.sucursalActive );

  const handleActiveButtonStyle = () => {
    if(isAlergenosOpen) {
      return {
        transform: 'scale(1.05)',
        fontWeight: '500',
      }
    } else {
      return {}
    }
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div>
          <Buttons onClick={handleBackToHome} buttonColor={'#33A6B8'}><span className="material-symbols-outlined">arrow_back</span></Buttons>
          <p>{empresaActive?.nombre} - {sucursalActive?.nombre}</p>
        </div>

        {isAlergenosOpen?
        <Button className={styles.agregarGenero} onClick={handleOpenEditarAlergeno}>Agregar Alergeno</Button>
        :
        <h2></h2>
        }
        
      </nav>

      <div className={styles.sucursalCont}>
        <div className={styles.aside}>
        
          <h2>Administracion</h2>

          <div className={styles.buttContainer}>
            <Button
            className={styles.butt1}
            style={handleActiveButtonStyle()}
            onClick={() => setIsAlergenosOpen(!isAlergenosOpen)}
            >
              Alergeno
            </Button>
            <Button className={styles.butt2}>Categorias</Button>
            <Button className={styles.butt3} onClick={() => console.log(productosData)}>Productos</Button>
          </div>
        </div>

        <div className={styles.main}>
          {isAlergenosOpen?
            <TableGeneric<IAlergenos>
              dataTable={alergenosData}
              columns={alergenosColumns?alergenosColumns:[]}
              handleDelete={handleDeleteAlergeno}
              isOpenModal={isOpenModal}
              setOpenModal={handleOpenEditarAlergeno}
            />
            :
            <h2></h2>
          }

          <ModalCrearAlergeno
          getAlergenos={getAlergenos}
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          />
        </div>
      </div>
    </>
  )
}
