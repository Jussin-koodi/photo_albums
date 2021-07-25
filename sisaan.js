

function authenticate() {
  return gapi.auth2.getAuthInstance()
      .signIn({scope: "https://www.googleapis.com/auth/photoslibrary.sharing"})
      //"https://www.googleapis.com/auth/photoslibrary.sharing"})
      .then(function() { console.log("Sign-in successful"); },
            function(err) { console.error("Error signing in", err); });
}
function loadClient() {
  gapi.client.setApiKey("AIzaSyDlfsLLLheFOvTeOtq0wFGWudkiJxVqRCQ");
  return gapi.client.load("https://photoslibrary.googleapis.com/$discovery/rest?version=v1")
      .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}

gapi.load("client:auth2", function() {
  gapi.auth2.init({client_id: "306709585419-dgkqhgn9k9ut0ievoj46k545bumavgu6.apps.googleusercontent.com",
  immediate: true,
  fetch_basic_profile: true
});
}

);  


