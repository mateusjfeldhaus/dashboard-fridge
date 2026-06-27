import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Input = styled.input`
  padding: 10px 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  transition: border-color 0.15s;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const Select = styled.select`
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

export const Textarea = styled.textarea`
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

export const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 14px;
`;

export const ImagePreview = styled.img`
  margin-top: 8px;
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const SubmitBtn = styled.button`
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
