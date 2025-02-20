const express = require('express');
const app = express();
const port = 3000;
const noteModel = require('./models/note.model');
const connectDB = require('./config/db.config');

connectDB();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', async (req, res, next) => {
    try {
        const notes = await noteModel.find();
        res.render('index', { notes });
    } catch (err) {
        next(err);
    }
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const note = new noteModel({ title, content });
        await note.save();
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

app.get('/edit/:id', async (req, res, next) => {
    try {
        const note = await noteModel.findById(req.params.id);
        if (!note) {
            return res.status(404).send('Note not found');
        }
        res.render('edit', { note });
    } catch (err) {
        next(err);
    }
});

app.post('/update/:id', async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const note = await noteModel.findByIdAndUpdate(
            req.params.id, 
            { title, content },
            { new: true, runValidators: true }
        );
        if (!note) {
            return res.status(404).send('Note not found');
        }
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

app.post('/delete/:id', async (req, res, next) => {
    try {
        const note = await noteModel.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).send('Note not found');
        }
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
