import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import LoginHelp from '../pages/LoginHelp'
import Subscribe from '../pages/Subscribe'
import SignUp from '../pages/SignUp'
import ResetPassword from '../pages/ResetPassword'
import Home from '../pages/Home'
import CrearContenido from '../components/crearPeliculas/CrearContenido'
import ContenidoList from '../components/adminPage/ContenidoList'
import AudioDescriptivo from '../pages/AudioDescriptivo';
import AvisosLegales from '../pages/AvisosLegales';
import TerminosDeUso from '../pages/TerminosDeUso';
import Series from '../pages/Series';
import MiLista from '../components/MiLista';
import EditarContenido from '../components/editarPeliculas/EditarContenido'
import Cuenta from '../pages/Cuenta'
import Peliculas from '../pages/Peliculas'
import CentroDeAyuda from '../pages/CentroDeAyuda'
import Profiles from '../pages/Profiles'
import CreateProfiles from '../pages/CreateProfiles'
import EditProfiles from '../components/editProfiles/Main'
import PrivateRoutes from './PrivateRoutes'
import ProtectedLogin from './ProtectedLogin'
import ProtectedReset from './ProtectedReset'
import ProtectedRoutes from './ProtectedRoutes'


const AppRoutes = () => {
  return (
    <>
      <Routes>


        <Route element={<PrivateRoutes />}>
          <Route path="/contenido" element={<ContenidoList />} />
          <Route path="/contenido/crear" element={<CrearContenido />} />
          <Route path="/contenido/editar/:tipo/:id" element={<EditarContenido />} />
          <Route path="/ContenidoList" element={<ContenidoList />} />
          <Route path="/CrearContenido" element={<CrearContenido />} />
          <Route path="/EditarContenido/:id" element={<EditarContenido />} />
        </Route>


        <Route element={<ProtectedRoutes />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/series" element={<Series />} />
          <Route path="/milista" element={<MiLista />} />
          <Route path="/Cuenta" element={<Cuenta />} />
          <Route path="/peliculas" element={<Peliculas />} />
          <Route path="/CentroDeAyuda" element={<CentroDeAyuda />} />
          <Route path="/Profiles" element={<Profiles />} />
          <Route path="/CreateProfiles" element={<CreateProfiles />} />
          <Route path="EditProfiles" element={<EditProfiles />} />
        </Route>


        <Route element={<ProtectedLogin />}>
          <Route path="/" element={<Login />} />
          <Route path="/LoginHelp" element={<LoginHelp />} />
          <Route path="/Subscribe" element={<Subscribe />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/avisos-legales" element={<AvisosLegales />} />
          <Route path="/terminos-uso" element={<TerminosDeUso />} />
          <Route path="/audio-descriptivo" element={<AudioDescriptivo />} />
        </Route>


        <Route element={<ProtectedReset />}>
          <Route path="/ResetPassword" element={<ResetPassword />} />
        </Route>


      </Routes>
    </>
  )
}

export default AppRoutes
