const express=require('express')
const fs=require('fs')
const path=require('path')
require('dotenv/config')

const connectDB=require('./config/db')
const InviteRequest = require('./models/inviteRequest');



const app=express()
app.use(express.static(path.join(__dirname, 'public','ourinvites')));
app.use(express.urlencoded({ extended: true }));
connectDB()



app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public','ourinvites', 'index.html'));
    
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
app.post('/inviteRequest', async (req, res) => {
    
        let inviteRequestParams = req.body;
try{
            
 
    let inviteRequest = new InviteRequest(inviteRequestParams);
    await inviteRequest.save();

    res.sendFile(path.join(__dirname, 'public','ourinvites', 'inviteRequest.html'));
}
catch(err){
    res.status(400).send(err)
}

});


app.listen(9000,()=>{
    console.log('Server started at port 9000');
})