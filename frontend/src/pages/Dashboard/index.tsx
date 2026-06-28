import ItemCard from '../../components/ItemCard';
import { Page, Header, Title, Filters, SearchInput, FilterBtn, Grid, Empty, Pagination, PageBtn, PageInfo } from './styles';
import { useDashboard, CATEGORIES } from './useDashboard';

export default function Dashboard() {
  const {
    items, loading, error, search, setSearch,
    activeCategory, label,
    page, totalPages, setPage, totalItems,
    handleCategoryClick,
    handleDeleted, handleUpdated, handleRestored,
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
            <FilterBtn key={c} $active={activeCategory === c} onClick={() => handleCategoryClick(c)} aria-pressed={activeCategory === c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </FilterBtn>
          ))}
        </Filters>
      </Header>

      {loading ? (
        <Empty>Carregando...</Empty>
      ) : error ? (
        <Empty>⚠️ {error}</Empty>
      ) : totalItems === 0 ? (
        <Empty>Nenhum item encontrado. Que tal adicionar algo?</Empty>
      ) : (
        <>
          <Grid>
            {items.map((item) => (
              <ItemCard key={item.id} item={item} onDeleted={handleDeleted} onUpdated={handleUpdated} onRestored={handleRestored} />
            ))}
          </Grid>

          {totalPages > 1 && (
            <Pagination>
              <PageBtn onClick={() => setPage(page - 1)} disabled={page === 1} aria-label="Página anterior">‹</PageBtn>
              <PageInfo>{page} de {totalPages} ({totalItems} itens)</PageInfo>
              <PageBtn onClick={() => setPage(page + 1)} disabled={page === totalPages} aria-label="Próxima página">›</PageBtn>
            </Pagination>
          )}
        </>
      )}
    </Page>
  );
}
