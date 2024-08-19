const express=require('express')
const fs=require('fs')
const path=require('path')

const app=express()
app.use(express.static(path.join(__dirname, 'public','ourinvites')));


app.get('/',(req,res)=>{
    res.send('<h1>OurInvites</h1>')
})
app.get('/:username', (req, res) => {
    const username = req.params.username;
    const filePath = path.join(__dirname,username, 'index.html');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(404).send('<h1>Invitation Not Found</h1>');
        } else {
            res.send(data);
        }
    });
});

app.listen(9000,()=>{
    console.log('Server started at port 9000');
})