import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Navbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/category/:category" element={<Dashboard />} />
                <Route path="/add" element={<AddItem />} />
                <Route path="/edit/:id" element={<EditItem />} />
              </Routes>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-center" autoClose={4000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </ThemeProvider>
  );
}
