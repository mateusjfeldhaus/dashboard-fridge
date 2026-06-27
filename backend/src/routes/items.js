import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db.js';
import supabase from '../supabase.js';
import { validate } from '../middleware/validate.js';
import { itemBodySchema, quantitySchema, idParamSchema, getItemsQuerySchema } from '../schemas.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Apenas imagens são permitidas'));
    }
    cb(null, true);
  },
});

const BUCKET = 'fridge-images';

// GET /api/items
router.get('/', validate(getItemsQuerySchema, 'query'), async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM items';
    const params = [];
    const conditions = [];

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`name ILIKE $${params.length}`);
    }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY created_at DESC';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET /api/items/:id
router.get('/:id', validate(idParamSchema, 'params'), async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Item not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST /api/items
router.post('/', upload.single('image'), validate(itemBodySchema), async (req, res) => {
  try {
    const { name, category, quantity, unit, notes, expiry_date } = req.body;
    let image_url = null;

    if (req.file) {
      const ext = req.file.originalname.split('.').pop();
      const filename = `${uuidv4()}.${ext}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filename, req.file.buffer, { contentType: req.file.mimetype });
      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
      image_url = data.publicUrl;
    }

    const { rows } = await pool.query(
      `INSERT INTO items (name, category, quantity, unit, notes, expiry_date, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, category, quantity, unit, notes ?? null, expiry_date ?? null, image_url]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT /api/items/:id
router.put('/:id', upload.single('image'), validate(idParamSchema, 'params'), validate(itemBodySchema), async (req, res) => {
  try {
    const { name, category, quantity, unit, notes, expiry_date } = req.body;
    let image_url = req.body.image_url ?? null;

    if (req.file) {
      const ext = req.file.originalname.split('.').pop();
      const filename = `${uuidv4()}.${ext}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filename, req.file.buffer, { contentType: req.file.mimetype });
      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
      image_url = data.publicUrl;
    }

    const { rows } = await pool.query(
      `UPDATE items SET name=$1, category=$2, quantity=$3, unit=$4, notes=$5, expiry_date=$6, image_url=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [name, category, quantity, unit, notes ?? null, expiry_date ?? null, image_url, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Item not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// PATCH /api/items/:id/image
router.patch('/:id/image', upload.single('image'), validate(idParamSchema, 'params'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const ext = req.file.originalname.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, req.file.buffer, { contentType: req.file.mimetype });
    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    const image_url = data.publicUrl;

    const { rows } = await pool.query(
      'UPDATE items SET image_url=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [image_url, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Item not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update image' });
  }
});

// PATCH /api/items/:id/quantity
router.patch('/:id/quantity', validate(idParamSchema, 'params'), validate(quantitySchema), async (req, res) => {
  try {
    const { amount } = req.body;

    const { rows: current } = await pool.query('SELECT * FROM items WHERE id=$1', [req.params.id]);
    if (!current.length) return res.status(404).json({ error: 'Item not found' });

    const newQty = parseFloat(current[0].quantity) - amount;

    if (newQty <= 0) {
      await pool.query('DELETE FROM items WHERE id=$1', [req.params.id]);
      return res.json({ deleted: true, id: req.params.id });
    }

    const { rows } = await pool.query(
      'UPDATE items SET quantity=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [newQty, req.params.id]
    );
    res.json({ deleted: false, item: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

// DELETE /api/items/:id
router.delete('/:id', validate(idParamSchema, 'params'), async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM items WHERE id=$1 RETURNING *', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Deleted', item: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
