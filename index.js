const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const connection = mysql.createConnection(process.env.MYSQL_URL);

connection.connect((err) => {
    if (err) {
        console.log('Erreur de connexion :', err);
        return;
    }
    console.log('Connecté à MySQL !');
});

app.get('/livres', (req, res) => {
    connection.query(
        `SELECT livres.id, livres.titre, livres.annee, auteurs.nom as auteur
        FROM livres
        JOIN auteurs ON livres.auteur_id = auteurs.id`,
        (err, results) => {
            if (err) {
                res.send('Erreur');
                return;
            }
            res.json(results);
        }
    );
});

app.post('/livres', (req, res) => {
    const { titre, annee, auteur_id } = req.body;
    connection.query(
        'INSERT INTO livres (titre, annee, auteur_id) VALUES (?, ?, ?)',
        [titre, annee, auteur_id],
        (err, results) => {
            if (err) {
                res.send('Erreur');
                return;
            }
            res.json({ message: 'Livre ajouté !', id: results.insertId });
        }
    );
});

app.delete('/livres/:id', (req, res) => {
    const id = req.params.id;
    connection.query(
        'DELETE FROM livres WHERE id = ?',
        [id],
        (err, results) => {
            if (err) {
                res.send('Erreur');
                return;
            }
            res.json({ message: 'Livre supprimé !' });
        }