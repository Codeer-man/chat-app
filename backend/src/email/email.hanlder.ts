import { resendClinet, sender } from "../lib/resend";
import { throwError } from "../lib/utils";
import { createWelcomeEmailTemplate } from "./email-templet";

export const sendWelcomeEmail = async (
  email: string,
  name: string,
  clientURL: string
) => {
  const { data, error } = await resendClinet.emails.send({
    from: "Manish <onboarding@resend.dev>",

    to: email,
    subject: "Welcome to chat app",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Resend error:", error);
    throwError("Failed to send welcome message");
    return;
  }

  console.log("Welcome email has been send", data);
};

export const emailVerification = async (email: string, otp: number) => {
  const { error, data } = await resendClinet.emails.send({
    from: "Manish <onboarding@resend.dev>",
    to: email,
    subject: "Welcome to chat app",
    html: `<p>Your verification code is: <b>${otp}</b>. It expires in 10 minutes.</p>`,
  });

  if (error) {
    console.error("Resend error:", error);
    throwError("Failed to send email verification message");
    return;
  }

  console.log("email verification send", data);
};
