const express=require('express')
const TelegramBot = require('node-telegram-bot-api');

const fs=require('fs')
const path=require('path')
require('dotenv/config')

const connectDB=require('./config/db')
const InviteRequest = require('./models/inviteRequest');



const app=express()
app.use(express.static(path.join(__dirname, 'public','ourinvites')));
app.use(express.urlencoded({ extended: true }));
const token = '7244253089:AAEOr1W_zDYRZi8WAr3zhRmtjlH9QF5tGP0';
const chatId = '1436538631'; 
const bot = new TelegramBot(token, { polling: false });



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
app.get('/get/adminvsk', async (req, res) => {
    try {
        let requests = await InviteRequest.find();
        let div = '<div class="requests-container" style="width:90%;margin:auto;">';
        console.log(requests);
        

        requests.forEach((element) => {
            div += `
                <div class="request-item" style="border:2px solid crimson;padding:10px;border-radius:8px">
                    <h3 style="color:#ff3392">Name: ${element.name}</h3>
                    <p>Contact: ${element.contact}</p>
                    <p>Event Name: ${element.eventName}</p>
                    <p>Event Date: ${element.eventDate}</p>
                    <p>Created At: ${element.createdAt}</p>


                </div>
            `;
        });

        div += '</div>';
        res.send(div);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/inviteRequest', async (req, res) => {
    
        let inviteRequestParams = req.body;
try{
            
    let inviteRequest = new InviteRequest(inviteRequestParams);

    
    let messageString = `
    Received New Invite Request!\n
<b>Name:</b> ${inviteRequest.name}\n
<b>Event Name:</b> ${inviteRequest.eventName}\n
<b>Event Date:</b> ${inviteRequest.eventDate}\n
<b>Contact:</b> ${inviteRequest.contact}
    `;
    
    bot.sendMessage(chatId, messageString, { parse_mode: "HTML" })
  .then(response => {
    console.log('Telegram Response:', response);
  })
  .catch(err => {
    console.log('Telegram Error:', err);
  });

    
   
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