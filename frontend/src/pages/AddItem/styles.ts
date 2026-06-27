import styled from 'styled-components';

export const Page = styled.div`
  max-width: 560px;
  margin: 40px auto;
  padding: 0 24px;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  padding: 32px;
`;

export const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 28px;
`;

export const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
  margin-bottom: 12px;
`;
