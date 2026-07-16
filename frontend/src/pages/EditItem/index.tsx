import ItemForm from '../../components/ItemForm';
import { Page, Card, Title, SkeletonTitle, SkeletonLabel, SkeletonInput, SkeletonBtn } from './styles';
import { useEditItem } from './useEditItem';

function EditItemSkeleton() {
  return (
    <Page>
      <Card>
        <SkeletonTitle />
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <SkeletonLabel />
            <SkeletonInput />
          </div>
        ))}
        <SkeletonBtn />
      </Card>
    </Page>
  );
}

export default function EditItem() {
  const { item, fetching, loading, handleSubmit } = useEditItem();

  if (fetching) return <EditItemSkeleton />;
  if (!item) return null;

  return (
    <Page>
      <Card>
        <Title>✏️ Editar item</Title>
        <ItemForm initial={item} onSubmit={handleSubmit} loading={loading} />
      </Card>
    </Page>
  );
}
