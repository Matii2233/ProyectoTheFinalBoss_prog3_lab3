import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { ModalCrearAlergeno } from "../modals/ModalCrearAlrgeno/ModalCrearAlergeno";
import { AlergenosService } from "../../../services/AlergenosService";
import { useAppDispatch } from "../../../hooks/redux";
import { setAlergenoActive, setDataAlergeno } from "../../../redux/store/slices/AlergenoReducer";
import Buttons from "../buttons/Buttons";
import { IAlergenos } from "../../../types/dtos/alergenos/IAlergenos";
import { setDataProductos, setProductoActive } from "../../../redux/store/slices/ProductoReducer";
import { IProductos } from "../../../types/dtos/productos/IProductos";
import { ICategorias } from "../../../types/dtos/categorias/ICategorias";
import { ModalCrearProducto } from "../modals/modalProductos/ModalCrearProducto/ModalCrearProducto";
import { ModalVerProducto } from "../modals/modalProductos/ModalVerProducto/ModalVerProducto";
import { ProductosService } from "../../../services/ProductosService";


interface ITableColumn<T> {
  label: string;
  key: string;
  render?: (item: T) => React.ReactNode;
}

export interface ITableProps<T> {
  dataTable: IAlergenos[] | IProductos[] | ICategorias[]
  columns: ITableColumn<T>[];
  handleDelete: (id: number) => void;
  isOpenModal: boolean
  setOpenModal: (state: boolean) => void;
  setModalVerProducto?: (state: boolean) => void
}

export const TableGeneric = <T extends { id: any }>({
  dataTable,
  columns,
  handleDelete,
  isOpenModal,
  setOpenModal,
  setModalVerProducto
}: ITableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    setRows(dataTable);
  }, [dataTable]);

  // Comunicacion con la api
  const API_URL = import.meta.env.VITE_API_URL;

  const alergenosService = new AlergenosService(API_URL+"/alergenos")

  const productosService = new ProductosService(API_URL + "/articulos")

  const dispatch = useAppDispatch();
  
  const getAlergenos = async () => {
    await alergenosService.getAll().then((alergenosData) => {
        dispatch(setDataAlergeno(alergenosData));
    });
  };

  const handleEdit = (row: IAlergenos | IProductos | ICategorias) => {
    
    if (row as IProductos) {
      dispatch(setProductoActive({ element: row as IProductos }));
    } 

    if (row as IAlergenos) {
      dispatch(setAlergenoActive({ element: row as IAlergenos }));
    }

    setOpenModal(true);
  };

  const handleVerProducto = (el: IProductos) => {
    dispatch(setProductoActive({ element: el }));
    setModalVerProducto ? setModalVerProducto(true) : console.log('no existe setOpenModalVerProducto ');
  }

  return (
    <>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

        }}
      >
        <Paper sx={{ width: "90%", overflow: "hidden", backgroundColor: '#006284' }} >
          <TableContainer sx={{ maxHeight: "80vh" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column, i: number) => (
                    <TableCell style={{ backgroundColor: '#006284', color: 'white' }} key={i} align={"center"}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index: number) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        {columns.map((column, i: number) => {
                          return (
                            <TableCell style={{ color: 'white' }} key={i} align={"center"}>
                              {
                                column.render ? (
                                  column.render(row)
                                ) : column.label === "Acciones" ? (
                                  <div style={{display:'flex', justifyContent:'center', gap:'10px'}}>
                                    <Buttons onClick={()=>handleEdit(row)} buttonColor="0077FF">
                                      <span className="material-symbols-outlined" style={{ scale: '1.0', display:"flex", alignItems:"center", justifyContent:"center"}}>edit</span>
                                    </Buttons>
                                    {'precioVenta' in row && (
                                      <Buttons onClick={() => handleVerProducto(row)} buttonColor="FF8000">
                                      <span className="material-symbols-outlined" style={{ scale: '1.0', display: "flex", alignItems: "center", justifyContent: "center" }}>visibility</span>
                                      </Buttons>
                                    )}
                                    <Buttons onClick={() => handleDelete(row.id)} buttonColor="DE2C2C">
                                      <span className="material-symbols-outlined" style={{ scale: '1.0', display:"flex", alignItems:"center", justifyContent:"center"}}>delete</span>
                                    </Buttons>
                                  </div>
                                ) : (
                                  row[column.key]

                                )

                              }
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            style={{ color: 'white' }}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

      </div>
    </>
  );
};
