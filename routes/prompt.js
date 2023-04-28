/*
  prompt.js -- Router for the promot
*/
const express = require('express');
const router = express.Router();
const Dialog = require('../models/dialog');
const User = require('../models/User');

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getCompletion(question) {
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "return most popular visting spots in the " + question,
      });
      return completion.data.choices[0].text;
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
}

router.get("/prompt", (req,res) => {
    res.render("prompt");
})

router.post("/prompt", async (req,res) => {
    const answer = await getCompletion(req.body.question);
    const dialog = new Dialog({question:req.body.question, answer:answer, userId:req.session.user._id});
    await dialog.save();
    res.render("prompt", {answer:answer});
});

router.get("/prevDialog", 
    async (req,res) => {
    let dialogs = [];
    dialogs = 
        await Dialog.find({userId: req.session.user._id});
    console.log(dialogs);
    res.render("prevDialog", {dialogs:dialogs});
})

    module.exports = router;