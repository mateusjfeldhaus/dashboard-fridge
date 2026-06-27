import 'dotenv/config';
import { sendMail } from '../src/mailer.js';

const to = process.env.EMAIL_TO;
if (!to || !process.env.EMAIL_FROM || !process.env.EMAIL_APP_PASSWORD) {
  console.error('❌ Faltam variáveis: EMAIL_FROM, EMAIL_TO, EMAIL_APP_PASSWORD no .env');
  process.exit(1);
}

console.log(`Enviando email de teste para: ${to} ...`);

await sendMail({
  to,
  subject: '✅ Teste — Minha Geladeira funcionando!',
  html: `
    <div style="font-family:sans-serif; max-width:480px;">
      <h2 style="color:#1e293b;">🧊 Minha Geladeira</h2>
      <p>Email de teste enviado com sucesso!</p>
      <p style="color:#64748b;">As notificações diárias de validade estão configuradas e vão chegar todo dia às <strong>8h da manhã</strong>.</p>
    </div>
  `,
});

console.log('✅ Email enviado com sucesso!');
