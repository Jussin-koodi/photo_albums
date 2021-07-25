
var albumIds = [];

var pageToken = null;
const pageSize = 30;
let albums = [];
/* 
Get the shared albums id:s and name
*/
async function listAlbums(){
    console.log("list albums");
    try {
    
      do {
       
      
        response = await gapi.client.photoslibrary.sharedAlbums.list({
          pageSize,pageToken})    
        result = response.result;
        albums = albums.concat(result.sharedAlbums);
      
        pageToken = result.nextPageToken;
      } while (pageToken != null);
   
    }
    catch (err) {
      console.log("Execute error", err);
    } 
    finally{ 
  
    generateId();
      }

/*
find album id's according it's name and for each album
instantiate class getShowImages /the real workhorse 
*/
 async function generateId(){
      var value = null;
      var a= [];
        for (var i = 0; i < places.length; i++) {
            var value = albums.find(element => element.title == places[i].name);
            a[i] = new getShowImages(value.id,places[i].posit);
            await a[i].albumItems();
        
        }
      }
    }
