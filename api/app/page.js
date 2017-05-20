const page = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <title>Periodic Weather</title>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">

    <meta name="description" content="A 17kb Preact & Redux based Progressive Web App that provides relevant information to the user outside of the tab.">
    <meta name="author" content="Colin van Eenige">

    <!-- iOS touch icon -->
    <link rel="apple-touch-icon" href="./app/assets/touch/PW_touch.png">

    <!-- Favicon -->
    <link rel="icon" href="./app/assets/favicon.ico?v=1">

    <!-- Web Application Manifest -->
    <link rel="manifest" href="./manifest.json">

    <!-- Add to homescreen for Chrome on Android -->
    <meta name="mobile-web-app-capable" content="yes">

    <!-- Color the status bar on mobile devices -->
    <meta name="theme-color" content="#FFC107">

    <link rel="stylesheet" href="./app/build/style.css">
  </head>

  <body>
    <div class="no-support-shell">
      <div id="toolbar">
        <div class="container">
          <span>Periodic Weather</span>
        </div>
      </div>
      <main>
        <div class="container">
          <p>This application is built with <a href="https://preactjs.com/">Preact</a> and requires Javascript to work.</p>
        </div>
      </main>
    </div>
    <script>
      document.querySelector('.no-support-shell').outerHTML = '';
      if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js', { scope: './' });
    </script>
    <script src="./app/build/bundle.js"></script>
  </body>

  </html>
`;

module.exports = page;
