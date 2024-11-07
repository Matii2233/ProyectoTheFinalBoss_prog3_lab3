import { Navigate, Route, Routes } from "react-router-dom"
import { Home } from "../components/screens/Home/Home"
import { Sucursal } from "../components/screens/Sucursal/Sucursal"

export const AppRouter = () => {

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