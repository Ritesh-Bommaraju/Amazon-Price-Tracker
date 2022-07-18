require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const nightmare = require("nightmare")();

const args = process.argv.slice(2);
const url = args[0];
const min_price = args[1];
checkprice();

async function checkprice() {
  try {
    const price = await nightmare
      .goto(url)
      .wait(".a-offscreen")
      .evaluate(() => document.querySelector(".a-offscreen").innerText)
      .end();
    const temp = price.replace("₹", "");
    const final_price = parseFloat(temp.replace(",", ""));
    //   console.log(final_price);
    if (final_price < min_price) {
      sendEmail(
        "Price is Lower !!!!!!!!",
        `The price on ${url} has dropped below ${min_price} rupees, go & grab it mate`
      );
      // console.log("It's cheaper");
      //   } else {
      //     console.log("It's expensive bro");
      //   }
    }
  } catch (e) {
    await sendEmail("Error Mate, please fix it", e.message);
    throw e;
  }
}
function sendEmail(subject, body) {
  const email = {
    to: "kibag71173@lodores.com",
    from: "riteshbommaraju@gmail.com",
    subject: subject,
    text: body,
    html: body,
  };
  // we are returning this because it returns a promise, its asynchronous, so we should makesure we await that in our code
  return sgMail.send(email);
}
