const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const moment = require("moment");
moment.locale("th");
const app = express();
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

app.post("/webhook", function (req, res) {
    let userId = req.body.events[0]?.source.userId;
    let userMessage = req.body.events[0]?.message.text;

    const header = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    let url = `https://dailydose365.net/updateUID.php`
    const jsonData = {
        userId: userId,
        tel: userMessage
    }
    axios
        .get(`${url}?userId=${jsonData.userId}&tel=${jsonData.tel}`, { headers: header })
        .then((resp) => {
            const responeData = Number(resp.data)
            if (responeData === 1) {
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
    const KEY_API = "xHGZy7ih0yDUH3pBpe/wiOEgDF4kVnAqr64zXr7y/H2HRZVydE+hvXB1CU5RjnSk3dygASPut2/fD42ocwSVuG47n7eSRkjlns/2w2VfBz3dOGwx8K9ZfWdKaQ54PIVHheRqrBO53ivj5n18+4L+gQdB04t89/1O/w1cDnyilFU="
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
