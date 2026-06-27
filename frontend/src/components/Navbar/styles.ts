import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Nav = styled.nav`
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

export const Logo = styled(Link)`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const NavLink = styled(Link)<{ $active: boolean }>`
  padding: 6px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  background: ${({ $active }) => $active ? '#eff6ff' : 'transparent'};
  transition: all 0.15s;

  &:hover {
    background: #eff6ff;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const LogoutBtn = styled.button`
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
