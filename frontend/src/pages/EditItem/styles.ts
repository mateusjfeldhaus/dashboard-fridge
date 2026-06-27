import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  border-radius: ${({ theme }) => theme.radius.sm};
`;

export const SkeletonTitle = styled(SkeletonBase)`
  height: 28px;
  width: 160px;
  margin-bottom: 28px;
`;

export const SkeletonLabel = styled(SkeletonBase)`
  height: 14px;
  width: 80px;
  margin-bottom: 8px;
`;

export const SkeletonInput = styled(SkeletonBase)`
  height: 42px;
  width: 100%;
  margin-bottom: 20px;
`;

export const SkeletonBtn = styled(SkeletonBase)`
  height: 44px;
  width: 100%;
  margin-top: 8px;
`;

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
