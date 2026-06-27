import { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  transition: border-color 0.15s;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const Select = styled.select`
  padding: 10px 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: #fff;
  outline: none;
  transition: border-color 0.15s;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const Textarea = styled.textarea`
  padding: 10px 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: border-color 0.15s;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 14px;
`;

const ImagePreview = styled.img`
  margin-top: 8px;
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SubmitBtn = styled.button`
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.primaryHover}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const CATEGORIES = ['carne', 'frango', 'porco', 'peixe', 'congelados', 'pães', 'sopa', 'massas', 'proteina', 'outro'];
const UNITS = ['un', 'kg', 'g', 'l', 'ml', 'pacote', 'caixa'];

export default function ItemForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    category: initial.category || 'carne',
    quantity: initial.quantity || 1,
    unit: initial.unit || 'un',
    notes: initial.notes || '',
    expiry_date: initial.expiry_date ? initial.expiry_date.split('T')[0] : '',
    image_url: initial.image_url || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initial.image_url || null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    onSubmit(fd);
  };

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
            {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
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
