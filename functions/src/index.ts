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
    
    console.log("[request]",req.body.body)
    try{
        const id = req.params.id;
        const movieRef  = db.collection('movies').doc( id );

        const movieSnap = await movieRef.get();
        
        if ( !movieSnap.exists ) {
            res.status(404).json({
                ok: false,
                mensaje: 'No existe una pelicula con ese ID ' + id
            });
        } else {

            const antes = movieSnap.data() || { };
            
            switch(req.body.body.action){
                case 'edit':{
                    console.log("edit")
                    await movieRef.update(req.body.body.request);
                }break;
                case 'delete':{
                    await movieRef.delete();}break;
            }
            res.json({
                ok: true,
                mensaje: `Operación exitosa a ${ antes.name }`
            });

        }
    }catch(e){
        console.log("error",e)
    }
    
   
});

app.post('/add-movies', async(req, res) => {

    try{
        console.log("[/movies/add]",req)
     
        const id=await db.collection("collection").doc().id

        console.log("[id]",id)
        db.collection("movies").doc(id).set({
            name:req.body.body.request.name,
            state:req.body.body.request.state,
            publicationDate:req.body.body.request.publicationDate,
            id:id
        })

        res.json({
            ok: true,
            mensaje: `Se añadio exitosamente`
        });
    }catch(e){
        console.log("No se logro añadir",e)
    }
   
});
export const api = functions.https.onRequest( app );
