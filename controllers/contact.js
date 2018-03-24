const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

/**
 * GET /contact
 * Contact form page.
 */
module.exports.getContact = (req, res) => {
  res.render('./account/contact', {
    title: 'Contact'
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
module.exports.postContact = (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const subject = req.body.subject;
    
    
  req.checkBody('name', 'Name cannot be blank').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('subject', 'Message cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('error_msg',  errors);
    return res.redirect('/contact');
  }

  const mailOptions = {
    to: 'raduprodan200@gmail.com',
    from: `${req.body.name} <${req.body.email}>`,
    subject: 'Contact Form ',
    text: req.body.subject,
    
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
    req.flash('error_msg', errors);
      return res.redirect('/contact');
    }
    req.flash('success_msg', 'Email has been sent successfully!' );
    res.redirect('/contact');
  });
};