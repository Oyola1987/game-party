const fs = require('fs');
const _ = require('lodash');
const express = require('express');
const libs = 'libs';
const app = express();

const readFile = (file) => { 
    return fs.readFileSync(file);
};

const createFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
};

const writeFile = (file, content) => {
    _.each(file.split('/'), (folder, index) => {
        if (index > 0) {
            createFolder(file.split(folder)[0]);
        }
    });

    fs.writeFileSync(file, content);
};

app.get('/*', (req, res) => {
    let route = 'src/' + (req.params[0] || 'index.html');
    console.log('Send file =>', route);
    res.sendfile(route);
});

app.listen(4000, () => console.log('Listening on port 4000!'))