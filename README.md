Welcome to Starting with Firebase

Setup a Firebase project on Cloud 9:
1. update nvm... $ nvm install 8.1.2
2. alias new version... $ nvm alias default 8.1.2
3. update npm... npm i -g npm
4. install Firebase CLI... $ npm install -g firebase-tools
5. create a subdirectory... $ mkdir my-project-name
6. cd into new subdirectory
7. (if needed) Create project in Firebase console
8. credential Firebase... $ firebase login -no-localhost
9. initialize Firebase... $ firebase init
10. run devserver... $ firebase serve --host 0.0.0.0 --port 8080


---- cURL for testing Cloud Messaging: ----

curl -X POST -H "Authorization: key=YOUR-SERVER-KEY" -H "Content-Type: application/json" -d '{
  "notification": {
    "title": "Test Title",
    "body": "This is a test cloud message, like it?"
  },
  "to": "YOUR-IID-TOKEN"
}' "https://fcm.googleapis.com/fcm/send"
