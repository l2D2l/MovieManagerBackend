import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as express from 'express';
import * as cors from 'cors';

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fire-moviemanager.firebaseio.com"
});

const db = admin.firestore();
// Express

const app = express();
app.use( cors({ origin: true }) );

app.get('/movies', async(req, res) => {

    const gotyRef  = db.collection('movies');
    const docsSnap = await gotyRef.get();
    const juegos   = docsSnap.docs.map( doc => doc.data() );

    res.json( juegos );
});

app.post('/cossas', (req, res) => res.send({
        "message":'Hola'
    }));

app.post('/movies/:id', async(req, res) => {
    
    console.log("ENTRO /movies/:id")
    // const id = req.params.id;
    // const movieRef  = db.collection('movies').doc( id );
    // const movieSnap = await movieRef.get();
    // if ( !movieSnap.exists ) {
    //     res.status(404).json({
    //         ok: false,
    //         mensaje: 'No existe una pelicula con ese ID ' + id
    //     });
    // } else {

    //     const antes = movieSnap.data() || { };
       
    //     console.log("[/movies/:id]",req)
    //     switch(req.body.action){
    //         case 'edit':await movieRef.update(req.body.request);break;
    //         case 'delete':await movieRef.update(req.body.request);break;
    //     }
    //     res.json({
    //         ok: true,
    //         mensaje: `Actualización exitosa a ${ antes.name }`
    //     });

    // }
    res.json( {
        "message":'Hola'
    } );
});

// app.post('/movies/add', async(req, res) => {

//    console.log("[/movies/add]",req)
//     await db.collection('movies').add(req.body)
    
//     res.json({
//         ok: true,
//         mensaje: `Se añadio exitosamente`
//     });
// });
export const api = functions.https.onRequest( app );
