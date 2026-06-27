import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getItems } from '../api/items';
import ItemCard from '../components/ItemCard';

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const Header = styled.div`
  margin-bottom: 28px;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 16px;
`;

const Filters = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 8px 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.9rem;
  outline: none;
  min-width: 200px;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const FilterBtn = styled.button`
  padding: 7px 16px;
  border-radius: 99px;
  border: 1.5px solid ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) => $active ? '#eff6ff' : '#fff'};
  color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.15s;

  &:hover { border-color: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primary}; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
`;

const Empty = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1rem;
`;

const CATEGORIES = ['todos', 'carne', 'frango', 'porco', 'peixe', 'congelados', 'pães', 'sopa', 'massas', 'proteina', 'outro'];

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('todos');
  const [search, setSearch] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    const params = {};
    if (category !== 'todos') params.category = category;
    if (search) params.search = search;
    const { data } = await getItems(params);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleDeleted = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const handleUpdated = (updated) => setItems((prev) => prev.map((i) => i.id === updated.id ? updated : i));

  return (
    <Page>
      <Header>
        <Title>🧊 Estoque da Geladeira</Title>
        <Filters>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar item..."
            />
            <FilterBtn type="submit" $active>Buscar</FilterBtn>
          </form>
          {CATEGORIES.map((c) => (
            <FilterBtn key={c} $active={category === c} onClick={() => setCategory(c)}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </FilterBtn>
          ))}
        </Filters>
      </Header>

      {loading ? (
        <Empty>Carregando...</Empty>
      ) : items.length === 0 ? (
        <Empty>Nenhum item encontrado. Que tal adicionar algo?</Empty>
      ) : (
        <Grid>
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onDeleted={handleDeleted} onUpdated={handleUpdated} />
          ))}
        </Grid>
      )}
    </Page>
  );
}
