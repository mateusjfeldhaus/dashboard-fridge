import { useLocation } from 'react-router-dom';
import { Nav, Logo, NavLinks, NavLink, LogoutBtn } from './styles';
import { useNavbar } from './useNavbar';

export default function Navbar() {
  const { pathname } = useLocation();
  const { handleLogout } = useNavbar();

  return (
    <Nav>
      <Logo to="/"><img src="/favicon.svg" width={24} height={24} alt="" /> Minha Geladeira</Logo>
      <NavLinks>
        <NavLink to="/" $active={pathname === '/' || pathname.startsWith('/category')}>Estoque</NavLink>
        <NavLink to="/add" $active={pathname === '/add'}>+ Adicionar</NavLink>
        <LogoutBtn onClick={handleLogout}>Sair</LogoutBtn>
      </NavLinks>
    </Nav>
  );
}
