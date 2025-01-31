const express=require('express')
const TelegramBot = require('node-telegram-bot-api');

const fs=require('fs')
const path=require('path')
require('dotenv/config')

const connectDB=require('./config/db')
const InviteRequest = require('./models/inviteRequest');
const feedbackData=require('./models/feedbackData')



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
app.get('/kpm-bookfair2025',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public','ourinvites', 'feedback.html'));
    
})
app.get('/freeinvite',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public','ourinvites', 'freeInvite.html'));
    
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

app.post('/freeInviteRequest', async (req, res) => {
    
    let inviteRequestParams = req.body;
try{
        
let inviteRequest = new InviteRequest(inviteRequestParams);


let messageString = `
Received Free Invite Request!\n
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

app.post('/submitFeedback', async (req, res) => {
    
    let feedbackDataParams = req.body;
    console.log(feedbackDataParams);
    
try{
        
let feedbackDataRes = new feedbackData(feedbackDataParams);


let messageString = `
Received New Feedback!\n
<b>Name:</b> ${feedbackDataRes.name}\n
<b>Contact:</b> ${feedbackDataRes.contact}
`;

bot.sendMessage(chatId, messageString, { parse_mode: "HTML" })
.then(response => {
console.log('Telegram Response:', response);
})
.catch(err => {
console.log('Telegram Error:', err);
});



await feedbackDataRes.save();

res.sendFile(path.join(__dirname, 'public','ourinvites', 'freeInviteRequest.html'));
}
catch(err){
res.status(400).send(err)
console.log(err);

}

});




app.get('/get/admin/feedbacks', async (req, res) => {
    try {
        let requests = await feedbackData.find();
        
        // Read the HTML template file
        fs.readFile(path.join(__dirname,'public','ourinvites', 'feedbackDashboard.html'), 'utf8', (err, htmlTemplate) => {
            if (err) {
                return res.status(500).send("Error reading HTML template.");
            }

            let feedbackListHTML = '';
            let totalRating = 0;
            // let recommendedCount = 0;

            requests.forEach((element) => {
                totalRating += parseInt(element.rating || 0);

                feedbackListHTML += `
                    <li class="feedback-item">
                        <strong>${element.name}</strong> <br>
                        <span class="rating">⭐ ${element.rating || 'N/A'}</span> <br>
                        <p><strong>Contact:</strong> ${element.contact || 'N/A'}</p>
                        <p><strong>Email:</strong> ${element.email || 'N/A'}</p>
                        <p><strong>Feedback Loved:</strong> ${element.loved || 'N/A'}</p>
                        <p><strong>Improvements:</strong> ${element.improvements || 'N/A'}</p>
                        <p><strong>Comments:</strong> ${element.comments || 'N/A'}</p>
                        <p><strong>Books Count:</strong> ${element.booksCount || 'N/A'}</p>
                        <p><strong>Books Names:</strong> ${element.booksName || 'N/A'}</p>
                        <p><strong>Created At:</strong> ${new Date(element.createdAt).toLocaleString()}</p>
                        <hr>
                    </li>
                `;
            });

            const averageRating = (totalRating / requests.length).toFixed(1);

            // Replace placeholders in the HTML template
            const populatedHTML = htmlTemplate
                .replace('{{feedbackList}}', feedbackListHTML)
                .replace('{{totalFeedback}}', requests.length)
                .replace('{{averageRating}}', averageRating)
                // .replace('{{recommendedCount}}', recommendedCount);

            // Send the populated HTML as response
            res.send(populatedHTML);
        });
        
    } catch (err) {
        res.status(500).send(err);
    }
});



app.listen(9000,()=>{
    console.log('Server started at port 9000');
})