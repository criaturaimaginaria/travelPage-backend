const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');


const app = express();
const port = 3000;

const pool = new Pool({
  connectionString: 'postgres://jbzluzey:Z-cLTRP7aA19CcpfsE_uGfQud3saJKWK@berry.db.elephantsql.com/jbzluzey',
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cors());
app.use(express.json());

// Ruta para crear la nueva tabla
app.post('/api/crearNuevaTabla', async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Consulta SQL para crear la nueva tabla (con las columnas que necesitas)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS nueva_tabla (
        id SERIAL PRIMARY KEY,
        country VARCHAR(255),
        region VARCHAR(255),
        city VARCHAR(255),
        iso VARCHAR(255),
        text TEXT
      );
    `;

    await client.query(createTableQuery);
    client.release();
    
    res.json({ message: 'Nueva tabla creada o ya existente' });
  } catch (error) {
    console.error('Error al crear o verificar la nueva tabla:', error);
    res.status(500).json({ error: 'Error al crear o verificar la nueva tabla', details: error.message });
  }
});


// Ruta para insertar datos en la tabla
app.post('/api/insertarDatos', async (req, res) => {
  try {
    const client = await pool.connect();
    const { country, region, city, iso, text } = req.body;

    // Consulta SQL para insertar datos en la tabla
    const insertDataQuery = `
      INSERT INTO nueva_tabla (country, region, city, iso, text)
      VALUES ($1, $2, $3, $4, $5);
    `; 

    await client.query(insertDataQuery, [country, region, city, iso, text]);
    client.release();

    res.json({ message: 'Datos insertados con éxito' });
  } catch (error) {
    console.error('Error al insertar datos:', error);
    res.status(500).json({ error: 'Error al insertar datos', details: error.message });
  }
});

// Ruta para obtener todos los datos de la tabla
app.get('/api/obtenerDatos', async (req, res) => {
  try {
    const client = await pool.connect();

    // Consulta SQL para seleccionar todos los datos de la tabla
    const selectDataQuery = `
      SELECT * FROM nueva_tabla;
    `;

    const result = await client.query(selectDataQuery);

    client.release();

    res.json(result.rows); // Envía los datos como respuesta en formato JSON
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos', details: error.message });
  }
});

// Ruta para eliminar un elemento por su ID
app.delete('/api/eliminarDato/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();

    // Consulta SQL para eliminar un elemento por su ID
    const deleteDataQuery = `
      DELETE FROM nueva_tabla WHERE id = $1;
    `;

    await client.query(deleteDataQuery, [id]);
    client.release();

    res.json({ message: 'Elemento eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar elemento:', error);
    res.status(500).json({ error: 'Error al eliminar elemento', details: error.message });
  }
});


app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
