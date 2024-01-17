const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const moment = require("moment");
const request = require("request");
moment.locale("th");
const app = express();
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

app.post("/webhook", function (req, res) {
    let userId = req.body.events[0].source.userId;
    let userMessage = req.body.events[0].message.text;
    
    const header = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

let url = `https://dailydose365.net/updateUID.php`
const jsonData = {
    userId: userId,
    tel: userMessage
}
axios
    .get(`${url}?userId=${jsonData.userId}&tel=${jsonData.tel}`, { headers: header })
    .then((resp) => {
        //console.log(resp.data);
        const resultText=resp.data
        if(resultText.statusCode===200){
            let formatMessage = {
                type: "text",
                text: "ยืนยันการลงทะเบียนเพื่อรับบริการแจ้งเตือนบนไลน์เรียบร้อยแล้ว"
            };
           reply(userId, formatMessage);
        }
    })
    .catch((error) => console.log("Error :", error));
    
    res.sendStatus(200);
});

function reply(userId, formatMessage) {
    const KEY_API = "QODKoPseQFd00Y5XRu3ejCNnxZ6dN95Kg3ISuj/RYANNqbKVcjgF5tPG1dm5zycg06Gjq+Tt1RKxlcQLD30oDfqLPkguiCh/XTN7h5mxmCCDlAzLJspGrnW/tPzStvgoFvd8mIDXnZiwnZjenhjoQwdB04t89/1O/w1cDnyilFU="
    const URL = "https://api.line.me/v2/bot/message/push"
    const header = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${KEY_API}`
    };
    axios
        .post(URL, { to: userId, messages: [formatMessage], }, { headers: header })
        .then((resp) => {
            console.log(resp.data);
        })
        .catch((error) => {
            console.log(error);
        })
}

app.listen(process.env.PORT || 8000, function () {
    console.log("Server up and listening");
});
