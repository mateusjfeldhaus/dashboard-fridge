import styled from 'styled-components';

export const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px;
`;

export const Header = styled.div`
  margin-bottom: 28px;
`;

export const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 16px;
`;

export const Filters = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

export const SearchInput = styled.input`
  padding: 8px 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.9rem;
  outline: none;
  min-width: 200px;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const FilterBtn = styled.button<{ $active: boolean }>`
  padding: 7px 16px;
  border-radius: 99px;
  border: 1.5px solid ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active }) => $active ? '#eff6ff' : '#fff'};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
`;

export const Empty = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1rem;
`;
