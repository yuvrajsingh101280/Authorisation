import { MailtrapClient } from "mailtrap";

const TOKEN = "0489ffa667e4de23e1d6c64973c1d943";

export const mailtrapClient = new MailtrapClient({
    token: TOKEN,
});

export const sender = {
    email: "hello@demomailtrap.com",
    name: "Gangster",
};


