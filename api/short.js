const express = require('express');

const admin = require('firebase-admin');

const app = express()

// initialize firebase admin

if (admin.apps.length === 0) {

  require('dotenv').config();

  admin.initializeApp({

    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),

  });

}

// get db reference

const db = admin.firestore();

/**

 * helper method to generate random string

 * @param {Number} n

 */

function randomString(n) {

  // character set

  let chars = 'abcdefghijklmnopqrstuvwxyz';

  chars += chars.toUpperCase();

  chars += '1234567890';

  return Array(n)

    .fill(0)

    .map(() => chars[~~(Math.random() * chars.length)])

    .join('');

}

app.get('/api/short', (req, ctx, res) => {

  // parse json body

  const { link } = JSON.parse(req.body);

  // generate shortcode

  const code = randomString(3);

  // generate timestamp

  const created_at = admin.firestore.Timestamp.now();

  // post payload to database

  db.collection('links').doc().set({ link, code, created_at });

  // create full shortlink

  const shortLink = `${req.headers.host}/${code}`;

  // create data

  const data = {

    success: true,

    shortLink,

  };

  res.status(200).send(data);

});

app.listen('3030');
