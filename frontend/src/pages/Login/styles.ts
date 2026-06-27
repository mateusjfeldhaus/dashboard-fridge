import styled from 'styled-components';

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  padding: 40px 36px;
  width: 100%;
  max-width: 380px;
`;

export const Logo = styled.div`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 8px;
`;

export const Title = styled.h1`
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 28px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Input = styled.input`
  padding: 11px 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const Btn = styled.button`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.15s;
  margin-top: 4px;

  &:hover { background: ${({ theme }) => theme.colors.primaryHover}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.85rem;
  text-align: center;
  margin-top: 12px;
`;
