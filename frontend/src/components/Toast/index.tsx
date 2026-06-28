import { useToast } from '../../contexts/ToastContext';
import { Container, ToastEl, UndoBtn, CloseBtn } from './styles';

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (!toasts.length) return null;

  return (
    <Container>
      {toasts.map((toast) => (
        <ToastEl key={toast.id} role="status" aria-live="polite">
          <span>{toast.message}</span>
          {toast.onUndo && (
            <UndoBtn onClick={() => { toast.onUndo!(); dismissToast(toast.id); }}>
              Desfazer
            </UndoBtn>
          )}
          <CloseBtn onClick={() => dismissToast(toast.id)} aria-label="Fechar">✕</CloseBtn>
        </ToastEl>
      ))}
    </Container>
  );
}
