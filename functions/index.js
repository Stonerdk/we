const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendChatNotification = functions.firestore
    .document("chats/{chatId}/messages/{messageId}")
    .onCreate(async (snap, context) => {
      const newValue = snap.data();
      const chatId = context.params.chatId;

      const senderRef = admin.firestore().collection("users")
          .doc(newValue.sender);
      const senderDoc = await senderRef.get();
      const senderData = senderDoc.data();
      if (!senderData) {
        console.log("invalid sender ID reported: ", newValue);
        return;
      }

      const chatRef = admin.firestore().collection("chats").doc(chatId);
      const chatDoc = await chatRef.get();
      const chatData = chatDoc.data();
      if (!chatData) {
        console.log("invalid chat ID reported: ", newValue);
        return;
      }

      const sendeeId = senderData.isMentor ? chatData.mentee : chatData.mentor;

      const userRef = admin.firestore().collection("users").doc(sendeeId);
      const userDoc = await userRef.get();
      const userData = userDoc.data();
      const fcmToken = userData?.fcmToken;

      if (fcmToken) {
        const message = {
          notification: {
            title: senderData.name,
            body: newValue.message,
          },
        };

        await admin.messaging().sendToDevice(fcmToken, message);
      }
    });
