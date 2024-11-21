import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { Home } from "../components/screens/Home/Home"
import { Sucursal } from "../components/screens/Sucursal/Sucursal"
import { useEffect } from "react";

export const AppRouter = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Al recargar la página, redirige automáticamente a '/home'
        navigate('/home', { replace: true });
    },[]);
    return (
        <>
            <Routes>
                <Route path="/" element= {<Navigate to={"/home"} />} />
                <Route path="/home" element= {<Home />} />
                <Route path="/sucursal" element={<Sucursal/>} />
            </Routes>
        </>
    )
}