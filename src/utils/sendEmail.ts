import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { __dirname } from "../app";
import { sendEmail } from "../types/custom";
import _throw from "./_throw";

export default async function sendMail({ email, token, url }: sendEmail) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // logger: true,
      // transactionLog: true,
    });

    const source = fs.readFileSync(path.join(__dirname, "..", "public", "reset.hbs"), "utf8");
    const compiledTemplate = handlebars.compile(source);

    const message = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `reset account`.toUpperCase(),
      html: compiledTemplate({ email, token, url }),
      headers: { "x-myheader": "test header" },
    };

    const infor = await transporter.sendMail(message);
    console.log("infor", infor);
    return;
  } catch (error) {
    _throw({ code: 500, message: JSON.stringify(error) });
    return;
  }
}
