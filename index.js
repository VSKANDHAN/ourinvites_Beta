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

          const filePath = path.join(__dirname, 'public', 'ourinvites', 'inviteReqData.json');

        fs.writeFileSync(filePath, JSON.stringify(requests, null, 4), 'utf8');

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

// app.post('/submitFeedback', async (req, res) => {
    
//     let feedbackDataParams = req.body;
//     console.log(feedbackDataParams);
    
// try{
        
// let feedbackDataRes = new feedbackData(feedbackDataParams);


// let messageString = `
// Received New Feedback!\n
// <b>Name:</b> ${feedbackDataRes.name}\n
// <b>email:</b> ${feedbackDataRes.email}\n
// <b>Contact:</b> ${feedbackDataRes.contact}\n
// <b>rating:</b> ${feedbackDataRes.rating}\n
// <b>loved:</b> ${feedbackDataRes.loved}\n
// <b>improvements:</b> ${feedbackDataRes.improvements}\n
// <b>comments:</b> ${feedbackDataRes.comments}\n
// <b>booksCount:</b> ${feedbackDataRes.booksCount}\n
// <b>booksName:</b> ${feedbackDataRes.booksName}\n
// <b>createdAt:</b> ${feedbackDataRes.createdAt}\n
// `;

// bot.sendMessage(chatId, messageString, { parse_mode: "HTML" })
// .then(response => {
// console.log('Telegram Response:', response);
// })
// .catch(err => {
// console.log('Telegram Error:', err);
// });



// await feedbackDataRes.save();

// res.sendFile(path.join(__dirname, 'public','ourinvites', 'freeInviteRequest.html'));
// }
// catch(err){
// res.status(400).send(err)
// console.log(err);

// }

// });


const bookSuggestions1 = [
    {
        title: "Atomic Habits of [Name]",
        description: "Tiny changes can lead to massive success! 🚀 This book teaches you how small daily habits can transform your life. Ready to become unstoppable?",
        image: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg"
    },
    {
        title: "The Power of Subconscious Mind of [Name]",
        description: "Did you know your mind is your greatest superpower? 💭 This book reveals how you can use it to attract success, happiness, and wealth!",
        image: "https://m.media-amazon.com/images/I/81gTwYAhU7L._SL1500_.jpg"
    },
    {
        title: "Wings of Fire: The Story of [Name]",
        description: "Dream big, achieve big! 🚀 This legendary book tells the inspiring journey of Dr. APJ Abdul Kalam, a true visionary from Tamil Nadu.",
        image: "https://m.media-amazon.com/images/I/71KKZlVjbwL.jpg"
    },
    {
        title: "[Name] & The 5 AM Club Chronicles",
        description: "Want to start waking up early and winning at life? ⏰ This book reveals the secrets of the most successful early risers in the world!",
        image: "https://m.media-amazon.com/images/I/81N7FmJhbhL.jpg"
    },
    {
        title: "[Name]’s Journey Through Ponniyin Selvan",
        description: "A thrilling historical adventure awaits you! 🏰 Step into the Chola dynasty with Kalki's masterpiece, filled with war, love, and royalty.",
        image: "https://m.media-amazon.com/images/I/81yCXN0gLcL._SL1500_.jpg"
    },
    {
        title: "[Name] & The Immortals of Meluha",
        description: "What if Shiva was real? 🔱 Dive into this epic mythology where Lord Shiva becomes the hero of an ancient war!",
        image: "https://m.media-amazon.com/images/I/818bGgNn0EL._SL1500_.jpg"
    },
    {
        title: "The Ancient Wisdom of Thirukkural, Explained by [Name]",
        description: "Tamil Nadu’s timeless wisdom in just two lines! 📜 This book deciphers Thiruvalluvar’s powerful life lessons for success, love, and happiness.",
        image: "https://m.media-amazon.com/images/I/71Hst3mRkiL._SL1500_.jpg"
    }
];

const bookSuggestions = [
    {
        title: "Atomic Habits of [Name]",
        description: "Tiny changes can lead to massive success! 🚀 This book teaches you how small daily habits can transform your life. Ready to become unstoppable?",
        image: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg"
    },
    {
        title: "The Power of Subconscious Mind of [Name]",
        description: "Did you know your mind is your greatest superpower? 💭 This book reveals how you can use it to attract success, happiness, and wealth!",
        image: "https://m.media-amazon.com/images/I/81gTwYAhU7L._SL1500_.jpg"
    },
    {
        title: "Wings of Fire: The Story of [Name]",
        description: "Dream big, achieve big! 🚀 This legendary book tells the inspiring journey of Dr. APJ Abdul Kalam, a true visionary from Tamil Nadu.",
        image: "https://m.media-amazon.com/images/I/71KKZlVjbwL.jpg"
    },
    {
        title: "[Name] & The 5 AM Club Chronicles",
        description: "Want to start waking up early and winning at life? ⏰ This book reveals the secrets of the most successful early risers in the world!",
        image: "https://m.media-amazon.com/images/I/81N7FmJhbhL.jpg"
    },
    {
        title: "[Name]’s Journey Through Ponniyin Selvan",
        description: "A thrilling historical adventure awaits you! 🏰 Step into the Chola dynasty with Kalki's masterpiece, filled with war, love, and royalty.",
        image: "https://m.media-amazon.com/images/I/81yCXN0gLcL._SL1500_.jpg"
    },
    {
        title: "[Name] & The Immortals of Meluha",
        description: "What if Shiva was real? 🔱 Dive into this epic mythology where Lord Shiva becomes the hero of an ancient war!",
        image: "https://m.media-amazon.com/images/I/818bGgNn0EL._SL1500_.jpg"
    },
    {
        title: "The Ancient Wisdom of Thirukkural, Explained by [Name]",
        description: "Tamil Nadu’s timeless wisdom in just two lines! 📜 This book deciphers Thiruvalluvar’s powerful life lessons for success, love, and happiness.",
        image: "https://m.media-amazon.com/images/I/71Hst3mRkiL._SL1500_.jpg"
    },
    {
        title: "Siva Purana: The Divine Stories Retold for [Name]",
        description: "The ultimate tales of Lord Shiva, filled with wisdom, devotion, and power! 🔱 A must-read for spiritual seekers and mythology lovers.",
        image: "https://m.media-amazon.com/images/I/711CQiHBFQL._SL1335_.jpg"
    },
    {
        title: "[Name] & The Secret of Bhagavad Gita",
        description: "The eternal wisdom of Krishna, decoded for modern success! 🏹 Learn how to master life, decision-making, and personal growth.",
        image: "https://m.media-amazon.com/images/I/812796bHzQL._SL1500_.jpg"
    },
    {
        title: "Think & Grow Rich: The [Name] Edition",
        description: "Money, success, and mindset! 💰 This classic book teaches you the secrets used by the world’s richest people to build their empires.",
        image: "https://m.media-amazon.com/images/I/61IxJuRI39L._SL1000_.jpg"
    },
    {
        title: "[Name] & The Art of War",
        description: "Master the strategies of war, business, and life! ⚔️ Sun Tzu’s ancient book teaches how to win in any situation using intelligence over force.",
        image: "https://m.media-amazon.com/images/I/61DB25+yH9L._SL1400_.jpg"
    },
    {
        title: "Zero to One: The Startup Journey of [Name]",
        description: "Want to build something unique? 🚀 This book by Peter Thiel reveals how to create a startup that changes the world!",
        image: "https://m.media-amazon.com/images/I/71doP+hSREL._SL1302_.jpg"
    },
    {
        title: "Mindset: The [Name] Formula for Success",
        description: "Fixed mindset vs. growth mindset – which one do you have? 🤔 This book teaches you how to change your mindset and unlock your potential.",
        image: "https://m.media-amazon.com/images/I/71wEDMAAnOL._SL1500_.jpg"
    },
    {
        title: "[Name] & The Monk Who Sold His Ferrari",
        description: "A high-flying lawyer gives up everything to find inner peace! 🏞️ This book shows how a simple life leads to happiness and fulfillment.",
        image: "https://m.media-amazon.com/images/I/61OByUf1TfL._SL1275_.jpg"
    },
    {
        title: "Sapiens: A History of [Name]’s Civilization",
        description: "Ever wondered how humans went from cavemen to rulers of the world? 🌍 This book takes you on an incredible journey through history!",
        image: "https://m.media-amazon.com/images/I/713jIoMO3UL._SL1500_.jpg"
    },
    {
        title: "[Name] & The Rich Dad, Poor Dad Chronicles",
        description: "Are you making money work for you? 💰 This book teaches you the financial secrets rich people use to build wealth!",
        image: "https://m.media-amazon.com/images/I/81bsw6fnUiL._SL1500_.jpg"
    },
    {
        title: "[Name] & The You Can Win Journey",
        description: "Want to achieve anything in life? 🏆 Shiv Khera’s book is a motivational masterpiece that teaches you how to win!",
        image: "https://m.media-amazon.com/images/I/71KCBR2XkhL._SL1500_.jpg"
    },
    {
        title: "The Life Lessons from Bhagavad Gita by [Name]",
        description: "Krishna’s timeless wisdom on self-discovery, inner peace, and leadership. 🏹 A must-read for personal growth!",
        image: "https://m.media-amazon.com/images/I/41k08wVRI+L.jpg"
    },
    {
        title: "Kallikaatu Idhihasam: The Epic Journey of [Name]",
        description: "A gripping tale of Tamil Nadu’s rural life, this novel beautifully portrays the struggles, emotions, and aspirations of common people. 🌾",
        image: "https://m.media-amazon.com/images/I/41kPtF75NYL.jpg"
    },
  
    {
        title: "Velpari: The Warrior Saga of [Name]",
        description: "A legendary Tamil story filled with bravery, sacrifice, and adventure! ⚔️ Experience the incredible journey of the great king Velpari.",
        image: "https://m.media-amazon.com/images/I/61Q654HOq7L._SL1000_.jpg"
    },
    {
        title: "Karisal Kaatu Kadudasi: [Name]’s Rural Adventure",
        description: "An emotional rollercoaster depicting the hardships and beauty of rural Tamil Nadu, written by Vannadasan. 🌾📖",
        image: "https://m.media-amazon.com/images/I/71N7bZ4LT2L._SL1000_.jpg"
    },
    {
        title: "[Name] & The Secret",
        description: "Manifest your dreams into reality! ✨ *The Secret* reveals how the law of attraction can help you achieve success, happiness, and abundance.",
        image: "https://m.media-amazon.com/images/I/81fdQIY6ykL._SL1500_.jpg"
    }
    
];



app.post('/submitFeedback1', async (req, res) => {
    let feedbackDataParams = req.body;
    console.log(feedbackDataParams);

    try {
        let feedbackDataRes = new feedbackData(feedbackDataParams);


let messageString = `
Received New Feedback!\n
<b>Name:</b> ${feedbackDataRes.name}\n
<b>email:</b> ${feedbackDataRes.email}\n
<b>Contact:</b> ${feedbackDataRes.contact}\n
<b>rating:</b> ${feedbackDataRes.rating}\n
<b>loved:</b> ${feedbackDataRes.loved}\n
<b>improvements:</b> ${feedbackDataRes.improvements}\n
<b>comments:</b> ${feedbackDataRes.comments}\n
<b>booksCount:</b> ${feedbackDataRes.booksCount}\n
<b>booksName:</b> ${feedbackDataRes.booksName}\n
<b>createdAt:</b> ${feedbackDataRes.createdAt}\n
`;

bot.sendMessage(chatId, messageString, { parse_mode: "HTML" })
.then(response => {
console.log('Telegram Response:', response);
})
.catch(err => {
console.log('Telegram Error:', err);
});



        await feedbackDataRes.save();
        

        // Select a random book suggestion
        let randomBook = bookSuggestions[Math.floor(Math.random() * bookSuggestions.length)];
        let bookTitle = randomBook.title.replace("[Name]", feedbackDataRes.name);
        let bookDescription = randomBook.description;
        let bookImage = randomBook.image;

        // res.send(`
        //     <html>
        //     <head>
        //         <title>🎁 Surprise Inside! | OurInvites</title>
        //         <style>
        //             body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #fffcf2; }
        //             .container { max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        //             h2 { color: #ff5733; }
        //             .book-title { font-size: 22px; font-weight: bold; color: #2c3e50; margin-top: 10px; }
        //             .book-description { font-size: 16px; color: #555; margin-top: 10px; }
        //             .book-image { width: 200px; height: auto; margin-top: 15px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        //             .cta { margin-top: 20px; padding: 10px 20px; background: #28a745; color: white; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block; }
        //         </style>
        //     </head>
        //     <body>
        //         <div class="container">
        //             <h2>🎁 Your Next Book is Calling!🎉</h2>
        //             <p>Hey <strong>${feedbackDataRes.name}</strong>, your book destiny has been revealed! 📖✨</p>
        //             <img class="book-image" src="${bookImage}" alt="Book Cover">
        //             <p class="book-title">"${bookTitle}"</p>
        //             <p class="book-description">${bookDescription}</p>
                   
        //         </div>
        //     </body>
        //     </html>
        // `);

        res.send(`
            <html>
            <head>
                <title>🎁 Surprise Inside! | OurInvites</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #fffcf2; margin: 0; }
                    .container { width: 60%; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center; margin-top: 2vh; }
                    h2 { color: #ff5733; font-size: 24px; }
                    .book-title { font-size: 22px; font-weight: bold; color: #2c3e50; margin-top: 10px; }
                    .book-description { font-size: 16px; color: #555; margin-top: 10px; }
                    .bookImageDIv { width: 50%; margin: auto; }
                    .book-image { width: 50%; height: auto; margin-top: 15px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .cta { margin-top: 20px; padding: 10px 20px; background: #28a745; color: white; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block; }
                    .share-btn { margin-top: 20px; padding: 10px 20px; background: #25D366; color: white; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block; }
                    @media (max-width: 640px) {
                        .container { width: 90%; padding: 15px; }
                        h2 { font-size: 20px; }
                        .book-title { font-size: 18px; }
                        .bookImageDIv { width: 80%; }
                        .book-image { width: 90%; }
                        .book-description { font-size: 14px; }
                        .cta, .share-btn { font-size: 14px; padding: 8px 16px; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>🎁 Your Next Book is Calling! 🎉</h2>
                    <p>Hey <strong>${feedbackDataRes.name}</strong>, your book destiny has been revealed! 📖✨</p>
                    <div class="bookImageDIv">
                        <img class="book-image" src="${bookImage}" alt="Book Cover">
                    </div>
                    <p class="book-title">"${bookTitle}"</p>
                    <p class="book-description">${bookDescription}</p>
        
                    <!-- WhatsApp Share Button -->
                    <a class="share-btn" href="https://api.whatsapp.com/send?text=Hey!%20I%20just%20got%20a%20book%20suggestion%20from%20OurInvites.%20Check%20this%20out!%20📚%0A%0A*Title:*%20${encodeURIComponent(bookTitle)}%0A*Description:*%20${encodeURIComponent(bookDescription)}%0A%0AGet%20your%20own%20book%20suggestion%20here:%20https://ourinvites.com/kpm-bookfair2025" target="_blank">
                        📤 Share with Friends on WhatsApp
                    </a>
                </div>
            </body>
            </html>
        `);
        
        
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
});





app.get('/get/admin/feedbacks', async (req, res) => {
    try {
        let requests = await feedbackData.find();
        const filePath = path.join(__dirname, 'public', 'ourinvites', 'finalFeedbackData.json');

        fs.writeFileSync(filePath, JSON.stringify(requests, null, 4), 'utf8');
        
        // Read the HTML template file
        fs.readFile(path.join(__dirname,'public','ourinvites', 'feedbackDashboard.html'), 'utf8', (err, htmlTemplate) => {
            if (err) {
                return res.status(500).send("Error reading HTML template.");
            }

            let feedbackListHTML = '';
            let totalRating = 0;
            // let recommendedCount = 0;

            requests.forEach((element) => {

                if (!isNaN(element.rating)) { 
                    totalRating += parseInt(element.rating || 0);

                }

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