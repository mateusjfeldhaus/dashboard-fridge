import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { login } from '../api/items';
import { setToken } from '../auth';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  padding: 40px 36px;
  width: 100%;
  max-width: 380px;
`;

const Logo = styled.div`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 28px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Input = styled.input`
  padding: 11px 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const Btn = styled.button`
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

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.85rem;
  text-align: center;
  margin-top: 12px;
`;

export default function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await login(password);
      setToken(data.token);
      navigate('/');
    } catch {
      setError('Senha incorreta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <Logo>🧊</Logo>
        <Title>Minha Geladeira</Title>
        <form onSubmit={handleSubmit}>
          <Field>
            <Label>Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              required
            />
          </Field>
          <Btn type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Btn>
          {error && <ErrorMsg>{error}</ErrorMsg>}
        </form>
      </Card>
    </Page>
  );
}
