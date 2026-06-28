import type { Item } from '../../types';
import {
  Card, ImageWrapper, CamOverlay, Body, Name, Badge, Meta, Expiry,
  Actions, Btn, RemovePanel, RemoveLabel, RemoveRow,
  Stepper, StepBtn, StepValue, ConfirmBtn,
} from './styles';
import { useItemCard, getCategoryEmoji } from './useItemCard';
import { formatDate } from '../../utils/date';

interface Props {
  item: Item;
  onDeleted: (id: string) => void;
  onUpdated: (item: Item) => void;
  onRestored: (item: Item) => void;
}

export default function ItemCard({ item, onDeleted, onUpdated, onRestored }: Props) {
  const {
    fileRef, cat, categoryStyle,
    removing, setRemoving, cancelRemove,
    amount, setAmount, maxQty,
    loading, imgUploading,
    expiryStatus,
    handleImageClick, handleImageChange,
    handleConfirmRemove,
    navigate,
  } = useItemCard(item, { onDeleted, onUpdated, onRestored });

  return (
    <Card>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />

      <ImageWrapper type="button" onClick={handleImageClick} aria-label="Trocar foto do item">
        {item.image_url
          ? <img src={item.image_url} alt={item.name} />
          : <span>{getCategoryEmoji(cat)}</span>}
        <CamOverlay className="cam-overlay">
          {imgUploading
            ? <span>Enviando...</span>
            : <><>📷</><span>Trocar foto</span></>}
        </CamOverlay>
      </ImageWrapper>

      <Body>
        <Name>{item.name}</Name>
        <Badge $bg={categoryStyle.bg} $color={categoryStyle.color}>{categoryStyle.label}</Badge>
        <Meta>{item.quantity} {item.unit}</Meta>
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
              <StepValue>{amount}</StepValue>
              <StepBtn onClick={() => setAmount((a) => Math.min(maxQty, a + 1))} disabled={amount >= maxQty} aria-label="Aumentar quantidade">+</StepBtn>
            </Stepper>
            <ConfirmBtn onClick={handleConfirmRemove} disabled={loading}>
              {amount >= maxQty ? '🗑 Remover tudo' : `Remover ${amount}`}
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
