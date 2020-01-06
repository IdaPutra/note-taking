const path = require('path');
const express = require('express');
const shortid = require('shortid');
const fs = require('fs').promises;
const bodyParser = require('body-parser');




const app = express();
const port = 3000;

const dbFilePath = path.resolve(__dirname, '..', 'db', 'db.json');

app.use(express.static('public'))

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


app.get('/', (_, res) => {
	const filePath = path.resolve(__dirname, '..', 'public', 'index.html');

	res.sendFile(filePath);
});

app.get('/notes', (_, res) => {
	const filePath = path.resolve(__dirname, '..', 'public', 'notes.html');

	res.sendFile(filePath);
});

app.get('/api/notes',async (_, res) => {
	const fileData = await fs.readFile(dbFilePath,'utf-8');
	const data= JSON.parse(fileData);
	
	

	res.json(data);
});

 app.post('/api/notes',async (req, res) => {
	 const {title,text}= req.body;
	 const fileData = await fs.readFile(dbFilePath,'utf-8');
	 const data= JSON.parse(fileData);

	 data.push({
		 id:shortid.generate(),
		 title,
		 text
	 });

	 await fs.writeFile(dbFilePath,JSON.stringify(data));

	 

	 res.json({
		 success:true
	 });
	

	 res.end();
 	
 });

 app.delete('/api/notes/:id',async (req, res) => {
	const noteID=req.params.id;
	console.log(noteID);

	const fileData = await fs.readFile(dbFilePath,'utf-8');
	const data= JSON.parse(fileData);

	const newData=data.filter(note=> note.id !== noteID);
	await fs.writeFile(dbFilePath,JSON.stringify(newData));
	
	res.end();
});


app.use('*', (_, res) => {
	res.redirect('/');
});


app.listen(port, async () => {
	console.log(`Example app listening on port ${port}!`)
});