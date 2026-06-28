import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

export const Container = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
  pointer-events: none;
`;

export const ToastEl = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #1e293b;
  color: #f8fafc;
  padding: 12px 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.9rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  animation: ${slideIn} 0.2s ease;
  pointer-events: all;
  white-space: nowrap;
`;

export const UndoBtn = styled.button`
  background: none;
  border: none;
  color: #60a5fa;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;

  &:hover { color: #93c5fd; }
`;

export const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;

  &:hover { color: #f8fafc; }
`;
