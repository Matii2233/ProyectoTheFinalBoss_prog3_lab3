import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import Buttons from "../../ui/buttons/Buttons";
import { TableGeneric } from "../../ui/TableGeneric/TableGeneric";
import styles from "./Sucursal.module.css";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { IAlergenos } from "../../../types/dtos/alergenos/IAlergenos";
import { Dispatch, useEffect, useState } from "react";
import { AlergenosService } from "../../../services/AlergenosService";
import { ModalCrearAlergeno } from "../../ui/modals/ModalCrearAlrgeno/ModalCrearAlergeno";
import { setDataAlergeno } from "../../../redux/store/slices/AlergenoReducer";
import { ProductosService } from "../../../services/ProductosService";
import {
  removeProductoById,
  setDataProductos,
  setProductoActive,
} from "../../../redux/store/slices/ProductoReducer";
import {
  setCategoriaActive,
  setDataCategorias,
  removeCategoriaActive,
} from "../../../redux/store/slices/CategoriasReducer";
import { useNavigate } from "react-router-dom";
import { IImagen } from "../../../types/IImagen";
import { ICategorias } from "../../../types/dtos/categorias/ICategorias";
import { IProductos } from "../../../types/dtos/productos/IProductos";
import { ModalCrearProducto } from "../../ui/modals/modalProductos/ModalCrearProducto/ModalCrearProducto";
import { ModalVerProducto } from "../../ui/modals/modalProductos/ModalVerProducto/ModalVerProducto";
import { ModalCrearCategoria } from "../../ui/modals/ModalCrearCategoria/ModalCrearCategoria";
import { CategoriasServices } from "../../../services/CategoriasServices";
import ModalCrearSubcategoria from "../../ui/modals/ModalCrearSubcategoria/ModalCrearSubcategoria";

export const Sucursal = () => {
  const [productosFiltrados, setProductosFiltrados] = useState<IProductos[]>(
    []
  );
  const [selectedSubcategoria, setSelectedSubcategoria] = useState<
    number | null
  >(null);
  const [subCategoriaProducto, setSubCategoriaProducto] = useState<
    ICategorias[]
  >([]);

  // ----- ESTADOS -----
  // botones alergenos - categorias - productos
  const [isAlergenosOpen, setIsAlergenosOpen] = useState(false);
  const [isProductosOpen, setIsProductosOpen] = useState(false);
  const [isCategoriasOpen, setIsCategoriasOpen] = useState(false);
  // datos de alergenos, productos o categorias
  const [alergenos, setAlergeno] = useState<IAlergenos[]>();
  const [productos, setProductos] = useState<IProductos[]>([]);
  const [categorias, setCategorias] = useState<ICategorias[]>([]);
  // categoriaElegida es para modal productos
  const [categoriaElegida, setCategoriaElegida] = useState<number | null>(null);
  // selectedCategoria para modal categoria --- expandedCategoria para modal subcategria
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(
    null
  );
  const [expandedCategoriaId, setExpandedCategoriaId] = useState<number | null>(
    null
  );
  //estado para traer los datos a los modals de edit categoria y edit subcategoria
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] =
    useState(null);
  // estados para abrir cada modal
  const [isOpenModalAlergeno, setIsOpenModalAlergeno] = useState(false);
  const [isOpenModalProducto, setIsOpenModalProducto] = useState(false);
  const [modalVerProducto, setModalVerProducto] = useState(false);
  const [isOpenCategoriaModal, setIsOpenCategoriaModal] = useState(false);
  const [isOpenSubcategoriaModal, setIsOpenSubcategoriaModal] = useState(false);

  const dispatch = useAppDispatch();
  const API_URL = import.meta.env.VITE_API_URL;

  // DATA ELEMENTOS
  const alergenosData = useAppSelector(
    (state) => state.alergenoReducer.dataAlergenos
  );
  const productosData = useAppSelector(
    (state) => state.productoReducer.dataProductos
  );
  const categoriaData = useAppSelector(
    (state) => state.categoriaReducer.dataCategorias
  );

  // SERVICES
  const alergenosService = new AlergenosService(API_URL + "/alergenos");
  const productosService = new ProductosService(API_URL + "/articulos");
  const categoriasService = new CategoriasServices(API_URL + "/categorias");

  // ELEMENTOS ACTIVOS
  const empresaActive = useAppSelector(
    (state) => state.empresaReducer.empresaActive
  );
  const sucursalActive = useAppSelector(
    (state) => state.sucursalReducer.sucursalActive
  );
  const productoActive = useAppSelector(
    (state) => state.productoReducer.productoActive
  );

  // METODOS GET para alergenos, productos y categorias
  const getAlergenos = async () => {
    await alergenosService.getAll().then((alergenosData) => {
      dispatch(setDataAlergeno(alergenosData));
      setAlergeno(alergenosData);
    });
  };

  const getProductos = async () => {
    await productosService
      .getProductosBySucursal(sucursalActive?.id as number)
      .then((productosData) => {
        dispatch(setDataProductos(productosData));
        setProductos(productosData);
        setProductosFiltrados(productosData);
      });
  };

  const getSubcategorias = async () => {
    const categoriaPadre =
      await categoriasService.getCategoriasPadrePorSucursal(
        sucursalActive?.id as number
      );
    const allSubCategorias = categoriaPadre.flatMap(
      (categoria) => categoria.subCategorias || []
    );
    setSubCategoriaProducto(allSubCategorias);
  };

  const getCategorias = async () => {
    if (!sucursalActive) {
      alert("No hay una sucursal activa. Seleccione una sucursal primero.");
      return;
    }
    try {
      // Llama al endpoint para obtener las categorías padres por sucursal
      const categoriasPadre =
        await categoriasService.getCategoriasPadrePorSucursal(
          sucursalActive.id
        );
      setCategorias(categoriasPadre); // Actualiza el estado local
      dispatch(setDataCategorias(categoriasPadre)); // Actualiza el estado global
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  // Cargar todos los datos
  useEffect(() => {
    getAlergenos();
  }, []);

  useEffect(() => {
    getProductos();
  }, []);

  useEffect(() => {
    getSubcategorias();
  }, [sucursalActive]);

  useEffect(() => {
    getCategorias();
  }, []);

  // FUNCIONES DE ACCION / APLICACION DE ESTILOS
  const handleActiveAlergenosButtonStyle = () => {
    if (isAlergenosOpen) {
      return {
        transform: "scale(1.05)",
        fontWeight: "500",
      };
    } else {
      return {};
    }
  };

  const handleActiveProductosButtonStyle = () => {
    if (isProductosOpen) {
      return {
        transform: "scale(1.05)",
        fontWeight: "500",
      };
    } else {
      return {};
    }
  };

  const handleActiveCategoriasButtonStyle = () => {
    if (isCategoriasOpen) {
      return {
        transform: "scale(1.05)",
        fontWeight: "500",
      };
    } else {
      return {};
    }
  };

  const handleEditCategoria = (categoria) => {
    setCategoriaActiva(categoria);
    setIsOpenCategoriaModal(true);
  };

  const handleEditSubcategoria = (subcategoria) => {
    setSubcategoriaSeleccionada(subcategoria);
    setIsOpenSubcategoriaModal(true);
  };

  const toggleSubcategorias = async (categoriaId: number) => {
    if (!sucursalActive) {
      console.warn("No hay una sucursal activa");
      return;
    }
    if (expandedCategoriaId === categoriaId) {
      setExpandedCategoriaId(null); // Colapsa la categoría
    } else {
      try {
        const subcategorias =
          await categoriasService.getSubcategoriasPorCategoriaPadre(
            categoriaId,
            sucursalActive.id
          );
        setCategorias((prevCategorias) =>
          prevCategorias.map((categoria) =>
            categoria.id === categoriaId
              ? { ...categoria, subCategorias: subcategorias }
              : categoria
          )
        );
        setExpandedCategoriaId(categoriaId); // Expande la categoría seleccionada
      } catch (error) {
        console.error("Error al obtener subcategorías:", error);
      }
    }
  };

  const handleCategoriaElegida = (categoria: number | null) => {
    setCategoriaElegida(categoria);
  };

  const handleDeleteAlergeno = async (id: number) => {
    try {
      await alergenosService.deleteById(id);
      // Actualiza la lista para reflejar el cambio
      const updatedAlergenos = alergenos?.filter(
        (alergeno) => alergeno.id !== id
      );
      setAlergeno(updatedAlergenos);
      dispatch(setDataAlergeno(updatedAlergenos || []));
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleDeleteCategoria = async (id: number) => {
    try {
      await categoriasService.deleteById(id);
      const updatedCategorias = categorias?.filter(
        (categoria) => categoria.id !== id
      );
      setCategorias(updatedCategorias);
      dispatch(setDataCategorias(updatedCategorias || []));
    } catch (error) {
      console.error(error);
    }
  };

  // CONSTRUCCION DE LAS COLUMNAS PARA LA TABLA

  const handleSubcategoriaChange = (subcategoriaId: number | null) => {
    setSelectedSubcategoria(subcategoriaId);
    if (subcategoriaId) {
      const filtrados = productos.filter(
        (producto) => producto.categoria?.id === subcategoriaId
      );
      setProductosFiltrados(filtrados);
    } else {
      setProductosFiltrados(productos);
    }
  };
  const alergenosColumns = [
    {
      label: "Nombre",
      key: "denominacion",
    },
    /*{
      label: 'id alergeno',
      key: 'id',
      render: (alergeno: IAlergenos) => {
        return alergeno.id ? alergeno.id : 'no hay alergeno'
      }
    }*/
    {
      label: "Acciones",
      key: "acciones",
    },
  ];

  const productosColumns = [
    { label: "Nombre", key: "denominacion" },
    {
      label: "Precio",
      key: "precioVenta",
      render: (producto: IProductos) => {
        return producto?.precioVenta || <p>Sin precio</p>;
      },
    },
    {
      label: "Descripcion",
      key: "descripcion",
      render: (producto: IProductos) => {
        return producto.descripcion ? (
          producto.descripcion
        ) : (
          <p>Sin descripcion</p>
        );
      },
    },
    {
      label: "Categoria",
      key: "categoriaid",
      render: (producto: IProductos) => {
        return producto.categoria?.denominacion || <p>Sin categoria</p>;
      },
    },
    {
      label: "Habilitado",
      key: "habilitado",
      render: (producto: IProductos) => {
        return producto.habilitado ? (
          <span className="material-symbols-outlined">thumb_up</span>
        ) : (
          <span className="material-symbols-outlined">thumb_down</span>
        );
      },
    },
    {
      label: "Acciones",
      key: "acciones",
    },
  ];

  const categoriasColumns = [
    { label: "Nombre", key: "denominacion" },
    /*{ label: "ID", key: "id" }*/
    {
      label: "Acciones",
      key: "acciones",
      render: (categoria: ICategorias) => {
        const isExpanded = expandedCategoriaId === categoria.id;

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <Buttons
                onClick={() => handleEditCategoria(categoria)}
                buttonColor="0077FF"
              >
                <span className="material-symbols-outlined">edit</span>
              </Buttons>
              <Buttons
                onClick={() => toggleSubcategorias(categoria.id)}
                buttonColor={isExpanded ? "FC7600" : "0077FF"}
              >
                <span className="material-symbols-outlined">
                  {isExpanded ? "arrow_drop_up" : "arrow_drop_down"}
                </span>
              </Buttons>
              <Buttons
                onClick={() => {
                  setSubcategoriaSeleccionada(null);
                  setIsOpenSubcategoriaModal(true);
                  setSelectedCategoria(categoria.id); // Guardamos el ID de la categoría seleccionada
                }}
                buttonColor="00A419"
              >
                <span className="material-symbols-outlined">add</span>
              </Buttons>
            </div>

            {isExpanded && categoria.subCategorias && (
              <ul
                style={{
                  listStyleType: "disc",
                  marginLeft: "20px",
                  width: "90%",
                }}
              >
                {categoria.subCategorias.map((subcategoria) => (
                  <li
                    key={subcategoria.id}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        height: "50px",
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ width: "320px" }}>
                        {subcategoria.denominacion}
                      </div>
                      <Buttons
                        onClick={() => handleEditSubcategoria(subcategoria)}
                        buttonColor="0077FF"
                        style={{ marginLeft: "10px" }}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </Buttons>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      },
    },
  ];

  // Metodo handle para volver al home
  const navigate = useNavigate();
  const handleBackToHome = () => {
    navigate("/");
  };

  // alergenosData.map((alergeno)=>{
  //   console.log(`alergeno: ${alergeno.id}, ${alergeno.denominacion}, ${alergeno.imagen.url}`)
  // })

  const handleOpenCrearCategoria = () => {
    dispatch(removeCategoriaActive()); // Resetea categoriaActive
    setCategoriaActiva(null); // Limpia la categoría activa en el estado local
    setIsOpenCategoriaModal(true); // Abre el modal para creación
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div>
          <Buttons onClick={handleBackToHome} buttonColor={"#33A6B8"}>
            <span className="material-symbols-outlined">arrow_back</span>
          </Buttons>
          <p>
            {empresaActive?.nombre} - {sucursalActive?.nombre}
          </p>
        </div>

        {(isAlergenosOpen && (
          <Button
            className={styles.agregarGenero}
            onClick={() => setIsOpenModalAlergeno(true)}
          >
            Agregar Alergeno
          </Button>
        )) ||
          (isProductosOpen && (
            <Button
              className={styles.agregarGenero}
              onClick={() => setIsOpenModalProducto(true)}
            >
              Agregar Producto
            </Button>
          )) ||
          (isCategoriasOpen && (
            <Button
              className={styles.agregarGenero}
              onClick={handleOpenCrearCategoria}
            >
              Agregar Categoría
            </Button>
          ))}
      </nav>

      <div className={styles.sucursalCont}>
        {/* ASIDE */}
        <div className={styles.aside}>
          <h2>Administracion</h2>
          <div className={styles.buttContainer}>
            {/* BOTON ABRIR TABLA ALERGENOS */}
            <Button
              onClick={() => {
                setIsProductosOpen(false);
                setIsCategoriasOpen(false);
                setIsAlergenosOpen(!isAlergenosOpen);
              }}
              style={handleActiveAlergenosButtonStyle()}
            >
              Alergeno
            </Button>

            {/* BOTON ABRIR TABLA CATEGORIAS */}
            <Button
              onClick={() => {
                setIsAlergenosOpen(false);
                setIsProductosOpen(false);
                setIsCategoriasOpen(!isCategoriasOpen);
                if (!isCategoriasOpen) getCategorias(); // Solo llama a getCategorias si el modal se va a abrir
              }}
              style={handleActiveCategoriasButtonStyle()}
            >
              Categorias
            </Button>

            {/* BOTON ABRIR TABLA PRODUCTOS */}
            <Button
              onClick={() => {
                setIsAlergenosOpen(false);
                setIsCategoriasOpen(false);
                setIsProductosOpen(!isProductosOpen);
              }}
              style={handleActiveProductosButtonStyle()}
            >
              Productos
            </Button>
          </div>
        </div>

        <div className={styles.main}>
          {(isAlergenosOpen && (
            <TableGeneric
              dataTable={alergenosData}
              columns={alergenosColumns}
              handleDelete={handleDeleteAlergeno}
              isOpenModal={isOpenModalAlergeno}
              setOpenModal={setIsOpenModalAlergeno}
            />
          )) ||
            (isProductosOpen && (
              <>
                <div className={styles.containerFiltro}>
                  <DropdownButton
                    id="dropdown-subcategorias"
                    title={
                      selectedSubcategoria
                        ? "Seleccionar Subcategoria"
                        : "Seleccionar Subcategoría"
                    }
                    onSelect={(eventKey: string | null) =>
                      handleSubcategoriaChange(
                        eventKey ? parseInt(eventKey) : null
                      )
                    }
                  >
                    <Dropdown.Item>Todas las Subcategorías</Dropdown.Item>
                    {subCategoriaProducto.map((subcategoria) => (
                      <Dropdown.Item
                        key={subcategoria.id}
                        eventKey={subcategoria.id.toString()}
                      >
                        {subcategoria.denominacion}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
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
            )) ||
            (isCategoriasOpen && (
              <TableGeneric<ICategorias>
                dataTable={categorias}
                columns={categoriasColumns}
                handleDelete={handleDeleteCategoria}
                isOpenModal={isOpenCategoriaModal}
                setOpenModal={setIsOpenCategoriaModal}
              />
            ))}

          {(isOpenModalAlergeno && (
            <ModalCrearAlergeno
              getAlergenos={getAlergenos}
              isOpenModal={isOpenModalAlergeno}
              setIsOpenModal={setIsOpenModalAlergeno}
            />
          )) ||
            (isOpenModalProducto && (
              <ModalCrearProducto
                getProductos={getProductos}
                isOpenModal={isOpenModalProducto}
                setOpenModal={setIsOpenModalProducto}
              />
            )) ||
            (modalVerProducto && (
              <ModalVerProducto
                getProductos={getProductos}
                setOpenModalVerProducto={setModalVerProducto}
                openModalVerProducto={modalVerProducto}
              />
            )) ||
            (isOpenCategoriaModal && (
              <ModalCrearCategoria
                getCategorias={getCategorias}
                isOpenModal={isOpenCategoriaModal}
                setIsOpenModal={setIsOpenCategoriaModal} // Solo abre/cierra si recibe "categoria"
                categoriaActive={categoriaActiva}
              />
            )) ||
            (isOpenSubcategoriaModal && (
              <ModalCrearSubcategoria
                isOpenModal={isOpenSubcategoriaModal}
                setIsOpenModal={setIsOpenSubcategoriaModal}
                categoriaPadreId={selectedCategoria}
                getCategorias={getCategorias}
                setCategorias={setCategorias} // Pasar correctamente setCategorias como prop
                subcategoriaSeleccionada={subcategoriaSeleccionada}
                empresaActiva={empresaActive}
              />
            ))}
        </div>
      </div>
    </>
  );
};
