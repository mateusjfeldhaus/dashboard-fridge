import styled from 'styled-components';

export const Card = styled.div`
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

export const ImageWrapper = styled.button`
  width: 100%;
  aspect-ratio: 4/3;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: none;
  padding: 0;

  img { width: 100%; height: 100%; object-fit: cover; }

  &:hover .cam-overlay, &:focus-visible .cam-overlay { opacity: 1; }

  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.primary}; outline-offset: 2px; }
`;

export const CamOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  color: white;
  font-size: 1.6rem;

  span { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.03em; }
`;

export const Body = styled.div`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

export const Name = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Badge = styled.span<{ $bg: string; $color: string }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  width: fit-content;
`;

export const Meta = styled.div`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Expiry = styled.div<{ $warn: 'urgent' | 'soon' | null }>`
  font-size: 0.8rem;
  color: ${({ $warn, theme }) =>
    $warn === 'urgent' ? theme.colors.danger :
    $warn === 'soon'   ? theme.colors.warning :
    theme.colors.textMuted};
  font-weight: ${({ $warn }) => $warn ? '600' : '400'};
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px 14px;
`;

export const Btn = styled.button<{ $variant?: 'danger' | 'ghost' }>`
  flex: 1;
  padding: 7px 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.82rem;
  font-weight: 600;
  background: ${({ $variant, theme }) =>
    $variant === 'danger' ? theme.colors.danger :
    $variant === 'ghost' ? theme.colors.border :
    theme.colors.primary};
  color: ${({ $variant, theme }) => $variant === 'ghost' ? theme.colors.textPrimary : '#fff'};
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
`;

export const RemovePanel = styled.div`
  padding: 0 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RemoveLabel = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

export const RemoveRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Stepper = styled.div`
  display: flex;
  align-items: center;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
`;

export const StepBtn = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: ${({ theme }) => theme.colors.background};
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.border}; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export const StepValue = styled.span`
  min-width: 36px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ConfirmBtn = styled.button`
  flex: 1;
  padding: 7px 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.82rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.danger};
  color: #fff;
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
