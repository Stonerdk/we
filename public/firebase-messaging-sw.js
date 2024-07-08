
    importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-messaging.js');

    firebase.initializeApp({
      apiKey: 'AIzaSyBaBsJh2TDxXH7_KjBy96bjU8KpfnftKWI',
      authDomain: 'projectwe-421109.firebaseapp.com',
      projectId: 'projectwe-421109',
      storageBucket: 'projectwe-421109.appspot.com',
      messagingSenderId: '522002244667',
      appId: '1:522002244667:web:b29a2b1ca5616ee973a81e',
      measurementId: 'G-308R04JP5N',
    });

    const messaging = firebase.messaging();

    messaging.setBackgroundMessageHandler(function(payload) {
      console.log('[firebase-messaging-sw.js] Received background message ', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png'
      };

      return self.registration.showNotification(notificationTitle, notificationOptions);
    });
  