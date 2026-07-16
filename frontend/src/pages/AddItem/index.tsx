import ItemForm from '../../components/ItemForm';
import { Page, Card, Title } from './styles';
import { useAddItem } from './useAddItem';

export default function AddItem() {
  const { loading, handleSubmit } = useAddItem();

  return (
    <Page>
      <Card>
        <Title>➕ Adicionar item</Title>
        <ItemForm onSubmit={handleSubmit} loading={loading} />
      </Card>
    </Page>
  );
}
