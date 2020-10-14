const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'pranavsrivatsav@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}. Let us know how you get along with the app`
    }).then(() => console.log(`Welcome Mail for ${name} sent.`)).catch((error) => console.log(error))
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'pranavsrivatsav@gmail.com',
        subject: 'GoodBye!',
        text: `We are sorry to see you go, ${name}.\n\nWe would be very grateful for any feedback regarding the app's shortcomings that led to your cancellation. You can provide your feedback as a reply to this mail.\nThanks once again for trying our app. We will definitely keep working on it and hopefully await your return to using our app in the future.`
    }).then(() => console.log(`Cancellation Mail for ${name} sent.`)).catch((error) => console.log(error))
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
