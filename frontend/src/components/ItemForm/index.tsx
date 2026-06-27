import type { Item } from '../../types';
import { Form, Field, Label, Input, Select, Textarea, Row, ImagePreview, SubmitBtn } from './styles';
import { useItemForm, CATEGORIES, UNITS } from './useItemForm';

interface Props {
  initial?: Partial<Item>;
  onSubmit: (fd: FormData) => void;
  loading: boolean;
}

export default function ItemForm({ initial = {}, onSubmit, loading }: Props) {
  const { form, preview, set, handleImage, handleSubmit } = useItemForm(initial, onSubmit);

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        <Label>Nome *</Label>
        <Input value={form.name} onChange={set('name')} placeholder="ex: Contrafilé" required />
      </Field>

      <Row>
        <Field>
          <Label>Categoria *</Label>
          <Select value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label>Quantidade</Label>
          <Input type="number" min="0" step="0.01" value={form.quantity} onChange={set('quantity')} />
        </Field>
      </Row>

      <Field>
        <Label>Unidade</Label>
        <Select value={form.unit} onChange={set('unit')}>
          {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
        </Select>
      </Field>

      <Field>
        <Label>Validade</Label>
        <Input type="date" value={form.expiry_date} onChange={set('expiry_date')} />
      </Field>

      <Field>
        <Label>Observações</Label>
        <Textarea value={form.notes} onChange={set('notes')} placeholder="Congelado, marinado, etc." />
      </Field>

      <Field>
        <Label>Foto</Label>
        <Input type="file" accept="image/*" onChange={handleImage} />
        {preview && <ImagePreview src={preview} alt="preview" />}
      </Field>

      <SubmitBtn type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar item'}
      </SubmitBtn>
    </Form>
  );
}
