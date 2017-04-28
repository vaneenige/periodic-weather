# Periodic Weather

A **17kb** Preact & Redux based Progressive Web App that provides relevant information to the user outside of the tab.

This application uses the [Push API](https://www.w3.org/TR/push-api/) which enables sending a push notification on the web through a push service. Notifications can be delivered at any time, even when the website is inactive.

This application shows how Web Push Notifications can be used to deliver the user specific information with a custom payload they asked for. The server handles updates from the API which then delivers the updated weather status to every user subscribed to it.

[Click here for a demo!](https://use-the-platform.com/periodic-weather)

## Structure
To keep performance high and application size small this application is powered by [Preact](https://github.com/developit/preact/). A 3kb React alternative that works with the same ES6 API. Together with Redux for keeping state it's really fast.

* Based on [Preact Redux Example](https://github.com/developit/preact-redux-example) by [developit](https://github.com/developit).

* Preact based components manage controls of the user to add and remove images.

* Redux is used to store the state of the application (locations, subscriptions, network and service worker support).

* UI is adjusted based on state (opening modal and showing buttons).

* There's a fallback message if javascript isn't available. The application also works if Service Worker is not supported but it won't include push notifications.

* The application works offline, can be saved to the home screen (on android) and stores locations and subscriptions in local storage.

## What's missing?
The idea of this PWA was to show how user based push notifications could work yet there are some improvements not included yet:

* Fahrenheit
* Relative time of latest sync
* Update data in cache on push
* Notifications based on type instead of temperature
* Notifications based on user specific time
* Background Sync for handling offline actions

## License

MIT
