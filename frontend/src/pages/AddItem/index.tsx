import ItemForm from '../../components/ItemForm';
import { Page, Card, Title, ErrorMsg } from './styles';
import { useAddItem } from './useAddItem';

export default function AddItem() {
  const { loading, error, handleSubmit } = useAddItem();

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
