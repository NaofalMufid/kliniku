import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './pages/Auth/Login';
import Welcome from './pages/Home/Welcome';
import DokterList from './pages/Dokter/DokterList';
import PasienList from './pages/Pasien/PasienList';
import PemeriksaanList from './pages/Pemeriksaan/PemeriksaanList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Welcome />} />
          <Route path="dokter" element={<DokterList />} />
          <Route path="pasien" element={<PasienList />} />
          <Route path="pemeriksaan" element={<PemeriksaanList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App; 