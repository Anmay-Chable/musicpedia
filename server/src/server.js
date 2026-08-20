require('dotenv').config();
const express = require('express');
const cors = require('cors');
const albumRoutes = require('./routes/albums');
const { notFound, errorHandler } =  require('./errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Musicpedia API is running '});
});

app.use('/api/albums', albumRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});