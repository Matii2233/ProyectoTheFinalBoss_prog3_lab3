import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import Buttons from "../../ui/buttons/Buttons"
import { TableGeneric } from "../../ui/TableGeneric/TableGeneric"
import styles from "./Sucursal.module.css"
import { Button, Dropdown } from "react-bootstrap"
import { IAlergenos } from "../../../types/dtos/alergenos/IAlergenos"
import { useEffect, useState } from "react"
import { AlergenosService } from "../../../services/AlergenosService"
import { ModalCrearAlergeno } from "../../ui/modals/ModalCrearAlrgeno/ModalCrearAlergeno"
import { setDataAlergeno } from "../../../redux/store/slices/AlergenoReducer"
import { ProductosService } from "../../../services/ProductosService"
import { removeProductoById, setDataProductos, setProductoActive } from "../../../redux/store/slices/ProductoReducer"
import { useNavigate } from "react-router-dom"
import { IImagen } from "../../../types/IImagen"
import { ICategorias } from "../../../types/dtos/categorias/ICategorias"
import { IProductos } from "../../../types/dtos/productos/IProductos"
import { ModalCrearProducto } from "../../ui/modals/modalProductos/ModalCrearProducto/ModalCrearProducto"
import { ModalVerProducto } from "../../ui/modals/modalProductos/ModalVerProducto/ModalVerProducto"


export const Sucursal = () => {
  const [isAlergenosOpen, setIsAlergenosOpen] = useState(false)
  const [isProductosOpen, setIsProductosOpen] = useState(false);
  const [alergenos, setAlergeno] = useState<IAlergenos[]>()
  const [productos, setProductos] = useState<IProductos[]>([]);
  const [categorias, setCategorias] = useState<ICategorias[]>([]);
  const [categoriaElegida, setCategoriaElegida] = useState<number | null>(null);
  const [isOpenModalAlergeno, setIsOpenModalAlergeno] = useState(false)
  const [isOpenModalProducto, setIsOpenModalProducto] = useState(false)
  const [modalVerProducto, setModalVerProducto] = useState(false)



  // Guardamos el useAppDispatch
  const dispatch = useAppDispatch()
  // Guardamos la variable de entorno
  const API_URL = import.meta.env.VITE_API_URL;

  const alergenosData = useAppSelector( (state) => state.alergenoReducer.dataAlergenos )

  const productosData = useAppSelector( (state) => state.productoReducer.dataProductos )
  // Guardamos un objeto AlergenosService del service de alergenos
  const alergenosService = new AlergenosService(API_URL+"/alergenos")
  // Guardamos un objeto AlergenosService del service de alergenos
  const productosService = new ProductosService(API_URL+"/articulos")

  const empresaActive = useAppSelector( (state) => state.empresaReducer.empresaActive );

  const sucursalActive = useAppSelector( (state) => state.sucursalReducer.sucursalActive );

  // Función para obtener los alergenos
  const getAlergenos = async () => {
    await alergenosService.getAll().then((alergenosData) => {
        dispatch(setDataAlergeno(alergenosData));
        setAlergeno(alergenosData);
    });
  };

  // Función para obtener las personas
  const getProductos = async () => {
    await productosService.getAll().then((productosData) => {
      dispatch(setDataProductos(productosData));
      setProductos(productosData);
    });
  };

  // Cargar todos los datos
  useEffect( ()=>{
    getAlergenos()
  },[] )

  useEffect( ()=>{
    getProductos()
  },[] )

  const handleActiveAlergenosButtonStyle = () => {
    if(isAlergenosOpen) {
      return {
        transform: 'scale(1.05)',
        fontWeight: '500',
      }
    } else {
      return {}
    }
  }

  const handleActiveProductosButtonStyle = () => {
    if(isProductosOpen) {
      return {
        transform: 'scale(1.05)',
        fontWeight: '500',
      }
    } else {
      return {}
    }
  }

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

  // Eliminar un producto
  const handleDeleteProducto = async (id: number) => {
    try {
      await productosService.delete(id);
      getProductos();
      dispatch(removeProductoById(id));
      alert("Producto eliminado con éxito");
    } catch (error) {
      console.error("Error eliminando el producto:", error);
      alert("Hubo un error al eliminar el producto");
    }
  };

  const handleCategoriaElegida = (categoria: number | null) => {
    setCategoriaElegida(categoria);
  };

  const productosFiltrados = categoriaElegida
    ? productosData.filter((producto) => producto.categoria?.id === categoriaElegida)
    : productosData;

  const alergenosColumns = [
    {
      label: 'Nombre',
      key: 'denominacion',
    },
    // {
    //   label: 'id alergeno',
    //   key: 'id',
    //   render: (alergeno: IAlergenos) => {
    //     return alergeno.id ? alergeno.id : 'no hay alergeno'
    //   }
    // },
    {
      label: 'Acciones',
      key: 'acciones',
    },
  ];

  const productosColumns = [
    { label: "Nombre", key: "denominacion" },
    {
      label: "Precio", key: "precioVenta",
      render: (producto: IProductos) => {
        return producto?.precioVenta || <p>Sin precio</p>;
      }
    },
    {
      label: "Descripcion", key: "descripcion",
      render: (producto: IProductos) => {
        return producto.descripcion ? producto.descripcion : <p>Sin descripcion</p>;
      }
    },
    {
      label: "Categoria", key: "categoriaid",
      render: (producto: IProductos) => {
        return producto.categoria?.denominacion || <p>Sin categoria</p>;
      }
    },
    {
      label: "Habilitado", key: "habilitado",
      render: (producto: IProductos) => {
        return producto.habilitado ? <span className="material-symbols-outlined">thumb_up</span> : <span className="material-symbols-outlined">thumb_down</span>;
      }
    },
    {
      label: "Acciones",
      key: "acciones",
    },
  ];

  // Metodo handle para volver al home 
  const navigate = useNavigate()
  const handleBackToHome = () => {
    navigate("/")
  }

  alergenosData.map((alergeno)=>{
    console.log(`alergeno: ${alergeno.id}, ${alergeno.denominacion}, ${alergeno.imagen.url}`)
  })


  return (
    <>
      <nav className={styles.navbar}>
        <div>
          <Buttons onClick={handleBackToHome} buttonColor={'#33A6B8'}><span className="material-symbols-outlined">arrow_back</span></Buttons>
          <p>{empresaActive?.nombre} - {sucursalActive?.nombre}</p>
        </div>

        {isAlergenosOpen &&(
          <Button className={styles.agregarGenero} onClick={() => setIsOpenModalAlergeno(true)}>Agregar Alergeno</Button>
        ) || isProductosOpen && (
          <Button className={styles.agregarGenero} onClick={() => setIsOpenModalProducto(true)}>Agregar Producto</Button>
        )}
      </nav>

      <div className={styles.sucursalCont}>
        <div className={styles.aside}>
          <h2>Administracion</h2>
          <div className={styles.buttContainer}>
            <Button className={styles.butt1}
            onClick={() => {
              setIsProductosOpen(false)
              setIsAlergenosOpen(!isAlergenosOpen)
            }}
            style={handleActiveAlergenosButtonStyle()}
            >Alergeno</Button>

            <Button className={styles.butt2}>Categorias</Button>
            
            <Button className={styles.butt3}
            onClick={() => {
              setIsAlergenosOpen(false)
              setIsProductosOpen(!isProductosOpen)
            }}
            style={handleActiveProductosButtonStyle()}
            >Productos</Button>
          </div>
        </div>

        <div className={styles.main}>
          {isAlergenosOpen && (
            <TableGeneric
              dataTable={alergenosData}
              columns={alergenosColumns}
              handleDelete={handleDeleteAlergeno}
              isOpenModal={isOpenModalAlergeno}
              setOpenModal={setIsOpenModalAlergeno}
            />
          ) || isProductosOpen && (
            <>
              <div className={styles.containerFiltro}>
                <Dropdown onSelect={(eventKey) => handleCategoriaElegida(Number(eventKey))}>
                  <Dropdown.Toggle className={styles.filterButton} variant="secondary">
                    Selecciona una categoría
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="">Todas las Categorías</Dropdown.Item>
                    {categorias.map((categoria) => (
                      <Dropdown.Item key={categoria.id} eventKey={categoria.id}>
                        {categoria.denominacion}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              
              <TableGeneric
              dataTable={productosFiltrados}
              columns={productosColumns}
              handleDelete={handleDeleteProducto}
              isOpenModal={isOpenModalProducto}
              setOpenModal={setIsOpenModalProducto}
              setModalVerProducto={setModalVerProducto}
              />
            </>
          )}
          
        {isOpenModalAlergeno && (
          <ModalCrearAlergeno
          getAlergenos={getAlergenos}
          isOpenModal={isOpenModalAlergeno}
          setIsOpenModal={setIsOpenModalAlergeno}
          />
        ) || isOpenModalProducto && (
          <ModalCrearProducto
          getProductos={getProductos}
          isOpenModal = {isOpenModalProducto}
          setOpenModal = {setIsOpenModalProducto}
        />
        ) || modalVerProducto && (
          <ModalVerProducto
          getProductos={getProductos}
          setOpenModalVerProducto={setModalVerProducto}
          openModalVerProducto={modalVerProducto}
        />
        )}
        </div>
      </div>
    </>
  )
}
