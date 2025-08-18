// import { google } from 'googleapis';
// import axios from 'axios';

// export default async function initGoogleDrive() {
//   const response = await axios.get('ruta/a/tu/archivo-de-credenciales.json');
//   const credentials = response.data;

//   const { client_secret, client_id, redirect_uris } = credentials.installed;
//   const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

//   const tokenPath = 'token.json'; // Puedes ajustar la ruta según tus necesidades

//   try {
//     const token = await axios.get(tokenPath);
//     oAuth2Client.setCredentials(token.data);
//   } catch (err) {
//     console.error('Error al obtener el token:', err);
//   }

//   const drive = google.drive({ version: 'v3', auth: oAuth2Client });

//   return drive;
// }
