import ItemForm from '../../components/ItemForm';
import { Page, Card, Title, ErrorMsg } from './styles';
import { useEditItem } from './useEditItem';

export default function EditItem() {
  const { item, loading, error, handleSubmit } = useEditItem();

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
