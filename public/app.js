// get refs to HTML elements
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnEmailLogin = document.getElementById('btnEmailLogin');
const btnCreateAccount = document.getElementById('btnCreateAccount');
const btnLogout = document.getElementById('btnLogout');
const txtTrollMsg = document.getElementById('txtTrollMsg');
const btnNewTrollMsg = document.getElementById('btnNewTrollMsg')

// get an instance of provider object (Googe Auth)
const provider = new firebase.auth.GoogleAuthProvider();

// get reference to Google Log In button
const btnLogin = document.getElementById('btnLogin');

var user;

function appInit() {
    // query movie data
    var moviesRef = firebase.database().ref('movies').orderByChild('episode_id');
    moviesRef.once('value', function(snapshot) {
        var movieData = '';
        snapshot.forEach(function(childSnapshot) {
            movieData += '<b>' + childSnapshot.val().title + '</b><br>';
            movieData += '<b>Episode:</b> ' + childSnapshot.val().episode_id;
            movieData += '<p>' + childSnapshot.val().opening_crawl + '</p>';
            movieData += '<div>&nbsp;</div>';
        });
        // inject into HTML list element
        document.getElementById('movies').innerHTML = movieData;
    });

    // query characters data
    var charactersRef = firebase.database().ref('characters');
    charactersRef.once('value', function(snapshot) {
        var charactersData = '';
        snapshot.forEach(function(childSnapshot) {
            charactersData += '<b>' + childSnapshot.val().name + '</b><br>';
            charactersData += '<b>Gender:</b> ' + childSnapshot.val().gender + '<br>';
            charactersData += '<b>Height:</b> ' + childSnapshot.val().height + '<br>';
            charactersData += '<b>Birthday:</b> ' + childSnapshot.val().birth_year;
            charactersData += '<div>&nbsp;</div>';
        });
        // inject into HTML list element
        document.getElementById('characters').innerHTML = charactersData;
    });

    // add listener for trollbox changes
    var trollBoxRef = firebase.database().ref('trollbox');
    trollBoxRef.on('child_added', function(data) {
        updateTrollbox(data.val().message, data.val().troll, data.val().date);
    });
}

// add Google login event
btnLogin.addEventListener('click', e => {
    firebase.auth().signInWithPopup(provider)
        .then(function(result) {
            user = result.user;
            const welcomeMsg = "Aloha, " + user.displayName;
            document.getElementById("msg").innerHTML = welcomeMsg;
            // get app data
            appInit();
            // log user info
            console.log('our logged in user: ' + JSON.stringify(user));
        })
        .catch(function(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('Error: message: ' + errorCode + ' -- ' + errorMessage);
        });
});

// create 'email login' user account event
btnCreateAccount.addEventListener('click', e => {
    const email = txtEmail.value;
    const password = txtPassword.value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(result) {
            var welcomeMsg = "Thanks for signing up, " + result.email + "! You can now log in.";
            document.getElementById("msg").innerHTML = welcomeMsg;
        })
        .catch(function(error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Email Sign-up Error: " + errorCode + " -- " + errorMessage);
        });
});

// Email user sign-in event
btnEmailLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const password = txtPassword.value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(result) {
            user = result;
            document.getElementById("msg").innerHTML = "Aloha, " + user.email;
            document.getElementById("txtEmail").value = '';
            document.getElementById("txtPassword").value = '';
            // get app data
            appInit();
        })
        .catch(function(error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Email Sign-in Error: " + errorCode + " -- " + errorMessage);
        });
});

// sign user out
btnLogout.addEventListener('click', e => {
    const byebyeMsg = "Thanks for playing, " + user.email + "! Have a nice day!"
    document.getElementById("msg").innerHTML = byebyeMsg;
    firebase.auth().signOut().then(function() {
        user = null;
        console.log('successful sign-out');
        // clear trollbox
        document.getElementById("trollbox").innerHTML = '';
    }).catch(function(error) {
        // An error happened.
    });
});

function updateTrollbox(message, troll, date) {
    var trollData = '<p><b>' + troll;
    trollData += '</b> said: ' + message;
    trollData += ' - <small>' + date + '</small></p>';

    // inject into HTML list element
    var currentTrollbox = document.getElementById('trollbox').innerHTML;
    document.getElementById('trollbox').innerHTML = currentTrollbox + trollData;
}

// new trollbox entry
btnNewTrollMsg.addEventListener('click', e => {
    if (user) {
        const troll = user.email;
        const msg = txtTrollMsg.value;
        const now = new Date();
        const postData = {
            troll: troll,
            message: msg,
            date: now.toUTCString()
        };

        // Get a key for a new Post
        var newPostKey = firebase.database().ref().child('trollbox').push().key;
        // persist data
        firebase.database().ref('trollbox/' + newPostKey).set(postData);
        // clear textbox
        document.getElementById("txtTrollMsg").value = '';
    }
});
