import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createItem } from '../api/items';
import ItemForm from '../components/ItemForm';

const Page = styled.div`
  max-width: 560px;
  margin: 40px auto;
  padding: 0 24px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  padding: 32px;
`;

const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 28px;
`;

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
  margin-bottom: 12px;
`;

export default function AddItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await createItem(formData);
      navigate('/');
    } catch (err) {
      setError('Erro ao salvar. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <Title>➕ Adicionar item</Title>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <ItemForm onSubmit={handleSubmit} loading={loading} />
      </Card>
    </Page>
  );
}
