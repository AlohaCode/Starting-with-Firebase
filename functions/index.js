const functions = require('firebase-functions');

const Translate = require('@google-cloud/translate');
const projectId = 'mystarwarsapp';
const translateClient = Translate({
    projectId: projectId
});

// russian auto-translate
exports.translateToRussian = functions.database
    .ref('/trollbox/{messageId}')
    .onWrite(event => {
        const translated = event.data.val().translated;
        if (!translated) {
            const origTxt = event.data.val().message;
            const root = event.data.ref.root;
            const translate_promise = translateClient.translate(origTxt, 'ru')
                .then((results) => {
                    const translation = results[0];
                    return translation;
                })
                .catch((err) => {
                    console.error('ERROR:', err);
                });
            const completed_promise = translate_promise.then(ruText => {
                const postData = {
                    message: ruText,
                    troll: event.data.val().troll,
                    date: event.data.val().date,
                    translated: true
                };
                // Get a key for a new Post
                var newPostKey = root.child('/trollbox').push().key;
                // persist data
                root.child('/trollbox/' + newPostKey).set(postData);
            });
            return completed_promise;
        }
        return null;

    });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
