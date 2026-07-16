import { createPortal } from 'react-dom';
import type { Item } from '../../types';
import {
  Card, ImageWrapper, Body, Name, Badge, Meta, Expiry,
  Actions, Btn, RemovePanel, RemoveLabel, RemoveRow,
  Stepper, StepBtn, StepValue, ConfirmBtn,
  LightboxOverlay, LightboxImg, LightboxClose,
} from './styles';
import { useItemCard, getCategoryEmoji } from './useItemCard';
import { formatDate } from '../../utils/date';
import { formatQty } from '../../utils/number';

interface Props {
  item: Item;
  onDeleted: (id: string) => void;
  onUpdated: (item: Item) => void;
  onRestored: (item: Item) => void;
}

export default function ItemCard({ item, onDeleted, onUpdated, onRestored }: Props) {
  const {
    cat, categoryStyle,
    removing, setRemoving, cancelRemove,
    amount, setAmount, maxQty,
    loading,
    lightbox, openLightbox, closeLightbox,
    expiryStatus,
    handleConfirmRemove,
    navigate,
  } = useItemCard(item, { onDeleted, onUpdated, onRestored });

  return (
    <Card>
      <ImageWrapper
        type="button"
        onClick={openLightbox}
        aria-label={item.image_url ? 'Ver foto em tamanho completo' : undefined}
        style={{ cursor: item.image_url ? 'zoom-in' : 'default' }}
      >
        {item.image_url
          ? <img src={item.image_url} alt={item.name} />
          : <span>{getCategoryEmoji(cat)}</span>}
      </ImageWrapper>

      {lightbox && item.image_url && createPortal(
        <LightboxOverlay onClick={closeLightbox} role="dialog" aria-modal="true" aria-label={item.name}>
          <LightboxClose onClick={closeLightbox} aria-label="Fechar">✕</LightboxClose>
          <LightboxImg src={item.image_url} alt={item.name} onClick={(e) => e.stopPropagation()} />
        </LightboxOverlay>,
        document.body
      )}

      <Body>
        <Name>{item.name}</Name>
        <Badge $bg={categoryStyle.bg} $color={categoryStyle.color}>{categoryStyle.label}</Badge>
        <Meta>{formatQty(item.quantity)} {item.unit}</Meta>
        {item.expiry_date && (
          <Expiry $warn={expiryStatus}>
            {expiryStatus === 'urgent' ? '🔴 ' : expiryStatus === 'soon' ? '🟡 ' : ''}
            Validade: {formatDate(item.expiry_date)}
          </Expiry>
        )}
        {item.notes && <Meta>{item.notes}</Meta>}
      </Body>

      {removing ? (
        <RemovePanel>
          <RemoveLabel>Quantas unidades remover?</RemoveLabel>
          <RemoveRow>
            <Stepper>
              <StepBtn onClick={() => setAmount((a) => Math.max(1, a - 1))} disabled={amount <= 1} aria-label="Diminuir quantidade">−</StepBtn>
              <StepValue>{formatQty(amount)}</StepValue>
              <StepBtn onClick={() => setAmount((a) => Math.min(maxQty, a + 1))} disabled={amount >= maxQty} aria-label="Aumentar quantidade">+</StepBtn>
            </Stepper>
            <ConfirmBtn onClick={handleConfirmRemove} disabled={loading}>
              {amount >= maxQty ? '🗑 Remover tudo' : `Remover ${formatQty(amount)}`}
            </ConfirmBtn>
          </RemoveRow>
          <Btn $variant="ghost" onClick={cancelRemove}>Cancelar</Btn>
        </RemovePanel>
      ) : (
        <Actions>
          <Btn onClick={() => navigate(`/edit/${item.id}`)}>Editar</Btn>
          <Btn $variant="danger" onClick={() => setRemoving(true)}>Remover</Btn>
        </Actions>
      )}
    </Card>
  );
}
