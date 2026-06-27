import { Page, Card, Logo, Title, Field, Label, Input, Btn, ErrorMsg } from './styles';
import { useLogin } from './useLogin';

export default function Login() {
  const { password, setPassword, loading, error, handleSubmit } = useLogin();

  return (
    <Page>
      <Card>
        <Logo><img src="/favicon.svg" width={60} height={60} alt="" /></Logo>
        <Title>Minha Geladeira</Title>
        <form onSubmit={handleSubmit}>
          <Field>
            <Label>Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              required
            />
          </Field>
          <Btn type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Btn>
          {error && <ErrorMsg>{error}</ErrorMsg>}
        </form>
      </Card>
    </Page>
  );
}
