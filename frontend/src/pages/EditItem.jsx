import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getItem, updateItem } from '../api/items';
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

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getItem(id).then(({ data }) => setItem(data)).catch(() => navigate('/'));
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await updateItem(id, formData);
      navigate('/');
    } catch (err) {
      setError('Erro ao atualizar. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <Page>
      <Card>
        <Title>✏️ Editar item</Title>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <ItemForm initial={item} onSubmit={handleSubmit} loading={loading} />
      </Card>
    </Page>
  );
}
