import { useAppDispatch } from "../../../hooks/redux";
import { IAlergenos } from "../../../types/dtos/alergenos/IAlergenos";
import Buttons from "../buttons/Buttons";
import { IProductos } from "../../../types/dtos/productos/IProductos";
import { ICategorias } from "../../../types/dtos/categorias/ICategorias";
import { setAlergenoActive } from "../../../redux/store/slices/AlergenoReducer";
import { setProductoActive } from "../../../redux/store/slices/ProductoReducer";

interface IButtonsTable {
  el: IAlergenos | IProductos | ICategorias
  handleDelete: (id: number) => void;
  setOpenModal: (state: boolean) => void;
}

export const ButtonsTable = ({
  el,
  handleDelete,
  setOpenModal,
}: IButtonsTable) => {

  const dispatch = useAppDispatch();

  const handleDeleteItem = () => {
    handleDelete(el.id);
  };

  const handleModalSelected = (el: IAlergenos | IProductos | ICategorias) => {
    if ("someUniquePropertyForAlergenos" in el) {
      dispatch(setAlergenoActive({ element: el as IAlergenos }));
    } else if ("someUniquePropertyForProductos" in el) {
      dispatch(setProductoActive({ element: el as IProductos }));
    } else if ("someUniquePropertyForCategorias" in el) {
      dispatch(setAlergenoActive({ element: el as IAlergenos }));
    } else {
      console.error("Tipo de elemento no reconocido");
    }

    setOpenModal(true);
  };

  return (
    <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
      <div
        style={{
          width: '20%',
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Buttons onClick={() => handleModalSelected(el)} buttonColor="0077FF">
          <span className="material-symbols-outlined">edit</span>
        </Buttons>
        <Buttons onClick={handleDeleteItem} buttonColor='CA1212'>
          <span className="material-symbols-outlined">delete_forever</span>
        </Buttons>
      </div>
    </div>
  );
};
