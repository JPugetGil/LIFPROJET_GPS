// JavaScript Document

var StravaApiV3 = require('strava_api_v3');
var defaultClient = StravaApiV3.ApiClient.instance;

// Configure OAuth2 access token for authorization: strava_oauth
var strava_oauth = defaultClient.authentications['strava_oauth'];
strava_oauth.accessToken = "YOUR ACCESS TOKEN"

var api = new StravaApiV3.UploadsApi()

var opts = { 
  'file': /path/to/file.txt, // {File} The uploaded file.
  'name': name_example, // {String} The desired name of the resulting activity.
  'description': description_example, // {String} The desired description of the resulting activity.
  'private': 56, // {Integer} Whether the resulting activity should be private.
  'trainer': trainer_example, // {String} Whether the resulting activity should be marked as having been performed on a trainer.
  'commute': commute_example, // {String} Whether the resulting activity should be tagged as a commute.
  'dataType': dataType_example, // {String} The format of the uploaded file.
  'externalId': externalId_example // {String} The desired external identifier of the resulting activity.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
api.createUpload(opts, callback);

