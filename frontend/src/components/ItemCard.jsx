import styled, { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { deleteItem } from '../api/items';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.md};
    transform: translateY(-2px);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Body = styled.div`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const Name = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Badge = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  width: fit-content;
`;

const Meta = styled.div`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Expiry = styled.div`
  font-size: 0.8rem;
  color: ${({ $warn, theme }) => $warn ? theme.colors.danger : theme.colors.textMuted};
  font-weight: ${({ $warn }) => $warn ? '600' : '400'};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px 14px;
`;

const Btn = styled.button`
  flex: 1;
  padding: 7px 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.82rem;
  font-weight: 600;
  background: ${({ $variant, theme }) =>
    $variant === 'danger' ? theme.colors.danger : theme.colors.primary};
  color: #fff;
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
`;

const EMOJI = { carne: '🥩', frango: '🍗', porco: '🥓', peixe: '🐟', congelados: '🧊', 'pães': '🍞', sopa: '🍲', massas: '🍝', proteina: '💪', outro: '📦' };

export default function ItemCard({ item, onDeleted }) {
  const navigate = useNavigate();
  const theme = useTheme();

  const isExpiringSoon = () => {
    if (!item.expiry_date) return false;
    const days = (new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
    return days <= 3;
  };

  const handleDelete = async () => {
    if (!confirm(`Remover "${item.name}"?`)) return;
    await deleteItem(item.id);
    onDeleted(item.id);
  };

  const cat = item.category?.toLowerCase() || 'outro';
  const { bg, color, label } = theme.categories[cat] || theme.categories.outro;

  return (
    <Card>
      <ImageWrapper>
        {item.image_url
          ? <img src={item.image_url} alt={item.name} />
          : <span>{EMOJI[cat] || '📦'}</span>}
      </ImageWrapper>
      <Body>
        <Name>{item.name}</Name>
        <Badge $bg={bg} $color={color}>{label}</Badge>
        <Meta>{item.quantity} {item.unit}</Meta>
        {item.expiry_date && (
          <Expiry $warn={isExpiringSoon()}>
            {isExpiringSoon() ? '⚠️ ' : ''}Validade: {new Date(item.expiry_date).toLocaleDateString('pt-BR')}
          </Expiry>
        )}
        {item.notes && <Meta>{item.notes}</Meta>}
      </Body>
      <Actions>
        <Btn onClick={() => navigate(`/edit/${item.id}`)}>Editar</Btn>
        <Btn $variant="danger" onClick={handleDelete}>Remover</Btn>
      </Actions>
    </Card>
  );
}
