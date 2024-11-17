import { Button, Carousel, CarouselItem, Modal } from 'react-bootstrap'
import styles from './ModalVerProducto.module.css'
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux'

import { FC, useState } from 'react'
import { IImagen } from '../../../../../types/IImagen'
import Swal from 'sweetalert2'
import { ProductosService } from '../../../../../services/ProductosService'
import { removeProductoActive } from '../../../../../redux/store/slices/ProductoReducer'

interface IModalVerProducto {
    openModalVerProducto: boolean
    setOpenModalVerProducto: (state: boolean) => void;
    getProductos: Function

}

export const ModalVerProducto: FC<IModalVerProducto> = ({ openModalVerProducto, setOpenModalVerProducto, getProductos }) => {
    const dispatch = useAppDispatch();
    const API_URL = import.meta.env.VITE_API_URL
    const productosServices = new ProductosService(API_URL + "/articulos")
    const productoActive = useAppSelector((state) => state.productoReducer.productoActive)

    const [loading, setLoading] = useState(false);
    const handleClose = () => {
        setOpenModalVerProducto(false)
        dispatch(removeProductoActive())
    }
    
    return (
        <Modal
            id={"verProducto"}
            show={openModalVerProducto}
            onHide={handleClose}
            size={"sm"}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header className={styles.modalHeader}>
                <Modal.Title>Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p>Nombre: {productoActive?.denominacion}</p>
                    <p>Precio: {productoActive?.precioVenta}</p>
                    <p>Descripcion: {productoActive?.descripcion}</p>
                    <p>Categoria: {productoActive?.categoria.denominacion}</p>
                    <p>Habilitado: {productoActive?.habilitado ? <span className="material-symbols-outlined">
                        thumb_up
                    </span> :
                        <span className="material-symbols-outlined">
                            thumb_down
                        </span>}
                    </p>
                    {productoActive?.imagenes && productoActive.imagenes.length > 0 ? (
                        <Carousel>
                            {productoActive.imagenes.map((imagen, index) => (
                                <Carousel.Item key={index}> 
                                    <img src={imagen.url} alt={`Imagen ${index + 1}`} />
                                </Carousel.Item>    
                            ))}
                        </Carousel>
                    ) : (
                        <p>Imagen: Sin imagen</p>
                    )}
                    
                </div>
            </Modal.Body>
            <Modal.Footer className={styles.modalFooter}>
                <Button onClick={handleClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>

    )
}
