import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { clearToken } from '../auth';

const Nav = styled.nav`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const Logo = styled(Link)`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const NavLink = styled(Link)`
  padding: 6px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  background: ${({ $active, theme }) => $active ? '#eff6ff' : 'transparent'};
  transition: all 0.15s;

  &:hover {
    background: #eff6ff;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LogoutBtn = styled.button`
  padding: 6px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: transparent;
  border: none;
  transition: all 0.15s;

  &:hover {
    background: #fef2f2;
    color: ${({ theme }) => theme.colors.danger};
  }
`;

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <Nav>
      <Logo to="/">🧊 Minha Geladeira</Logo>
      <NavLinks>
        <NavLink to="/" $active={pathname === '/'}>Estoque</NavLink>
        <NavLink to="/add" $active={pathname === '/add'}>+ Adicionar</NavLink>
        <LogoutBtn onClick={handleLogout}>Sair</LogoutBtn>
      </NavLinks>
    </Nav>
  );
}
