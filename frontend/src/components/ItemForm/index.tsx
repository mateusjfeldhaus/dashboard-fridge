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
        <Label htmlFor="field-name">Nome *</Label>
        <Input id="field-name" value={form.name} onChange={set('name')} placeholder="ex: Contrafilé" required />
      </Field>

      <Row>
        <Field>
          <Label htmlFor="field-category">Categoria *</Label>
          <Select id="field-category" value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="field-quantity">Quantidade</Label>
          <Input id="field-quantity" type="number" min="0" step="0.01" value={form.quantity} onChange={set('quantity')} />
        </Field>
      </Row>

      <Field>
        <Label htmlFor="field-unit">Unidade</Label>
        <Select id="field-unit" value={form.unit} onChange={set('unit')}>
          {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
        </Select>
      </Field>

      <Field>
        <Label htmlFor="field-expiry">Validade</Label>
        <Input id="field-expiry" type="date" value={form.expiry_date} onChange={set('expiry_date')} />
      </Field>

      <Field>
        <Label htmlFor="field-notes">Observações</Label>
        <Textarea id="field-notes" value={form.notes} onChange={set('notes')} placeholder="Congelado, marinado, etc." />
      </Field>

      <Field>
        <Label htmlFor="field-image">Foto</Label>
        <Input id="field-image" type="file" accept="image/*" onChange={handleImage} />
        {preview && <ImagePreview src={preview} alt="preview" />}
      </Field>

      <SubmitBtn type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar item'}
      </SubmitBtn>
    </Form>
  );
}
