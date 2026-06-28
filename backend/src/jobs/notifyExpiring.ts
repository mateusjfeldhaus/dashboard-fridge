import pool from '../db.js';
import { sendMail } from '../mailer.js';

interface ExpiringItem {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry_date: string;
}

export async function notifyExpiringItems(): Promise<void> {
  const to = process.env.EMAIL_TO;
  if (!to || !process.env.EMAIL_FROM || !process.env.EMAIL_APP_PASSWORD) {
    console.log('[notify] EMAIL_FROM/EMAIL_TO/EMAIL_APP_PASSWORD not set, skipping.');
    return;
  }

  const { rows } = await pool.query<ExpiringItem>(`
    SELECT name, category, quantity, unit, expiry_date
    FROM items
    WHERE expiry_date IS NOT NULL
      AND expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
    ORDER BY expiry_date ASC
  `);

  if (rows.length === 0) {
    console.log('[notify] No items expiring in the next 30 days.');
    return;
  }

  const rows_html = rows.map((item) => {
    const date = new Date(item.expiry_date).toLocaleDateString('pt-BR');
    const daysLeft = Math.ceil(
      (new Date(item.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    const urgent = daysLeft <= 7;
    return `
      <tr>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">${item.name}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0;">${item.quantity} ${item.unit}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0; color:${urgent ? '#dc2626' : '#d97706'}; font-weight:600;">
          ${date} (${daysLeft}d)
        </td>
      </tr>`;
  }).join('');

  const html = `
    <div style="font-family:sans-serif; max-width:560px; margin:0 auto;">
      <h2 style="color:#1e293b;">🧊 Meu Freezer — Aviso de Validade</h2>
      <p style="color:#64748b;">Os itens abaixo vencem nos próximos 30 dias:</p>
      <table style="width:100%; border-collapse:collapse; margin-top:16px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="padding:8px 12px; text-align:left; font-size:0.85rem; color:#475569;">Item</th>
            <th style="padding:8px 12px; text-align:left; font-size:0.85rem; color:#475569;">Qtd</th>
            <th style="padding:8px 12px; text-align:left; font-size:0.85rem; color:#475569;">Validade</th>
          </tr>
        </thead>
        <tbody>${rows_html}</tbody>
      </table>
      <p style="margin-top:24px; font-size:0.8rem; color:#94a3b8;">
        Enviado automaticamente pelo Meu Freezer.
      </p>
    </div>
  `;

  await sendMail({ to, subject: `⚠️ ${rows.length} item(s) vencendo em breve`, html });
  console.log(`[notify] Email sent to ${to} with ${rows.length} expiring item(s).`);
}
