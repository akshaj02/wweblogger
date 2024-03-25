const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require("qrcode-terminal");
const fs = require('fs');
const csv = require('csv-parse');

// const OpenAI  = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// csvFiles are saved to your local machine
const csvFile = "messages.csv";
const cleanCsvFile = "clean_messages.csv"

// Check if the CSV file already exists
let csvFileExists = fs.existsSync(csvFile);
let cleanCsvFileExists = fs.existsSync(cleanCsvFile)


// Keywords or patterns for filtering out unwanted messages
// Because this group gets spam messages frequently, I can remove them with set keywords
const spamKeywords = ['accommodation', 'assignment', 'http', 'doordash', 'available', 'job', 'fulltime', 'raukuten'];
const isSpam = message => spamKeywords.some(keyword => message.toLowerCase().includes(keyword));

// Using LocalAuth for automatic session management
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { executablePath: '/usr/bin/chromium',
                headless: true }
});

client.on('qr', qr => {
    // Generate and scan this QR with your phone
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async message => {
    let chat = await message.getChat();
    //console.log(message.body.replace(/(\r\n|\n|\r)/gm, " "));
    
    // specify the group you want to log messages from
    let groupName = SPECIFY_GROUP_NAME
    
    if (chat.isGroup && chat.name === groupName) {
        const phoneNumber = message.author;
        // Format the date and time without a comma
        const date = new Date(message.timestamp * 1000);
        const formattedTime = `${date.toLocaleDateString().replace(/\//g, '-')} ${date.toLocaleTimeString()}`;
        // Replace newlines and commas with spaces in message body
        const messageBody = message.body.replace(/(\r\n|\n|\r)/gm, " ");

        // add to csv only if message body is smaller than 150 characters
        // if (messageBody.length > 150) {
        //     return;
        // }

        // remove commas from message body and replace with spaces
        const messageBodySpace = messageBody.replace(/,/g, " ");
        // remove multiple spaces from message body and replace with single space
        const messageBodyClean = messageBodySpace.replace(/\s+/g, " ");

        console.log(`${phoneNumber},${formattedTime},${messageBodyClean}`);
        // Format the data as a CSV row
        const csvRow = `${phoneNumber},${formattedTime},${messageBodyClean}\n`;

        // Append to the CSV file
        if (!csvFileExists) {
            // Write headers followed by the first data row
            fs.appendFileSync(csvFile, "phoneNumber,time,messageBody\n");
            csvFileExists = true;
        }
        fs.appendFileSync(csvFile, csvRow);

        if (isSpam(messageBodyClean)) {
            return; // Skip this message
        }

        const timeRegex = /at \d{1,2} ?(AM|PM)|tomorrow at \d{1,2} ?(AM|PM)|now/i;
        
        // Updated location regex to be more flexible
        // This regex aims to capture phrases that start with 'from' followed by any text and 'to' followed by any text
        const locationRegex = /from\s+(.+?)\s+to\s+(.+?)(?=\s+(?:at|@)|\s*$)/i;

    }
});
client.initialize();
