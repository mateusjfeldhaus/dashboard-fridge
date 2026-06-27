import ItemCard from '../../components/ItemCard';
import { Page, Header, Title, Filters, SearchInput, FilterBtn, Grid, Empty } from './styles';
import { useDashboard, CATEGORIES } from './useDashboard';

export default function Dashboard() {
  const {
    items, loading, error, search, setSearch,
    activeCategory, label,
    handleCategoryClick,
    handleDeleted, handleUpdated,
  } = useDashboard();

  return (
    <Page>
      <Header>
        <Title>🧊 {label}</Title>
        <Filters>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar item..."
          />
          {CATEGORIES.map((c) => (
            <FilterBtn key={c} $active={activeCategory === c} onClick={() => handleCategoryClick(c)}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </FilterBtn>
          ))}
        </Filters>
      </Header>

      {loading ? (
        <Empty>Carregando...</Empty>
      ) : error ? (
        <Empty>⚠️ {error}</Empty>
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
