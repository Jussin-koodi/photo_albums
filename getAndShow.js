var manyItems = null;
var myImage;
//var kuvat = [];

class getShowImages{
   
    
    constructor (myId, myPos){
      this.albumId = myId;
      this.canvas = document.getElementById(myPos);
      this.counter = 0;
      this.myPic = [];
      this.myKuvat = [];
      this.kuvaTaulu = [];
      this.imgContainer = '';
      this.stage = null;
      this.photoFrame = null;
      this.nextPreButtons = null;
      this.currentIndex = 0;
      this.counterText = null;
      this.frameProp = {
          width:600,
          height:400,
          bColor: "#573E3E"
      }
    }
    /* 
    In this method we create stage, its background and necessary info text
    */

    createStage(){

        this.canvas.width = this.frameProp.width + 15;
        this.canvas.height = this.frameProp.height + 50;
        this.stage = new createjs.Stage(this.canvas);

        this.photoFrame = new createjs.Shape();
        this.photoFrame.graphics.beginFill("this.frameProp.bColor").drawRect(0,0,this.canvas.width,this.canvas.height);
        this.stage.addChild(this.photoFrame);

        // album text
        var caption = new createjs.Text(" ","18px Arial", "#fffff0");
        caption.text = "album ";
        caption.y = this.frameProp.height + 30;
        caption.x = 20;
        caption.txtBaseline ="alphapetic";
        this.stage.addChild(caption);

        //mouse over text
        var mouseText = new createjs.Text(" ","12px Arial", "#fffff0");
        mouseText.text = "(mouse over) ";
        mouseText.y = this.frameProp.height + 30;
        mouseText.x = 510;
        mouseText.txtBaseline ="alphapetic";
        this.stage.addChild(mouseText);
        
        // curren image text
        this.counterText = new createjs.Text(" ","18px Arial", "#fffff0");
        this.counterText.text = "0/0 ";
        this.counterText.y = this.frameProp.height + 30;
        this.counterText.x = 300;
        this.counterText.txtBaseline ="alphapetic";
        this.stage.addChild(this.counterText);
    }
/*
Search album according albumId, if sucessfull responmse 
result contains id for each mediaitems (photographs) stored in
myKuvat array.

*/
    async albumItems() {
        this.createStage();
        
        try  {
            response = await gapi.client.photoslibrary.mediaItems.search({"albumId":this.albumId});
            this.myKuvat = response.result.mediaItems;
        } 
        catch(err) { 
            console.error("error in albums", err)}
    this.showPic();
    }

/* 
with get photos we get in batch photos from google server resultsa are stored in
array named manyItems
*/
async getPhotos() {
    return await gapi.client.photoslibrary.mediaItems.batchGet({
            "mediaItemIds": this.myPic    
            })
            .then(function(response) {
                manyItems = response.result.mediaItemResults;
            },
            function(err) { console.error("Execute error", err); });
        } 
/*
First we create array myPict that contains id for each single photo that was found in
method albumItems
*/
async showPic(){
    
    for (var i = 0; i < this.myKuvat.length; i++ ){
        this.myPic[i] = this.myKuvat[i].id;
    }

    this.counterText.text = "1/"+this.myKuvat.length;
    await this.getPhotos();
    
    for (var i = 0; i < this.myKuvat.length; i++ ) {
          
            myImage = new Image();
            myImage.src = manyItems[i].mediaItem.baseUrl;
            myImage.crossOrigin = "anonymous";
            this.kuvaTaulu.push(myImage);  
           
            if (i==0) {
                this.kuvaTaulu[0].addEventListener("load", this.handleImageLoad.bind(this))
            }
    
    }
}

    /*
    In this method we handle image load event
    Wwe a) create bitmap on event.target, b) scale it ro fill frame (odd as bitmap should
    be as large as original jpeg imnage, c) set offset of 10 px on photo frame in order to 
    have borders d) we add bitmap image on stage and update it and finally add buttons to stage.   
    */
        handleImageLoad(event){
             
        let bitmapImage = new createjs.Bitmap(event.target);

        this.scale(bitmapImage);
        this.currentIndex = this.stage.numChildren; 
       // var nextPreButtons = new myButtons(this); 
       new myButtons(this); 
    }

/* here we scale the image tahit is first we use createjs methods scaleX and scaleY with multilication of 1.16,
This is strange as converted bitmap images should be same size as original jpeg.

secondly we scale the image if it is larger than frame size (usually this happens when we have vertical length larger as horizontal).
Finally we position image vertically in the midle of frame.
*/

    scale(bmImg){
        
        let scFract = 0;

        if (bmImg.getBounds().width <= bmImg.getBounds().height){ 
    
            scFract = this.frameProp.height/bmImg.getBounds().height;
            bmImg.scaleX = scFract; 
            bmImg.scaleY = scFract;
            bmImg.x = (this.frameProp.width - bmImg.getBounds().width  )/2 + 15;

        }
        else {
                        
            bmImg.scaleX = 1.16;
            bmImg.scaleY = 1.16;
            bmImg.x = (this.frameProp.width - bmImg.getBounds().width)/2 - 35;
        }
        bmImg.y = 15;
        this.stage.addChild(bmImg);
        this.stage.setChildIndex(bmImg, this.currentIndex - 1);
    }
 /*
 Next button pressed also show the next photo
*/
    showRight(){
        this.counter++;
        var bitMapImage;
        if (this.counter >= this.kuvaTaulu.length)
            this.counter = 0;

        this.counterText.text = this.counter + 1 + "/" + this.kuvaTaulu.length;
      
        this.stage.removeChildAt(this.currentIndex - 1); 
        bitMapImage = new createjs.Bitmap(this.kuvaTaulu[this.counter]);
        this.scale(bitMapImage);
      
    }
    
/*
previous button pressed
*/
    showLeft(){
        this.counter--;
        if (this.counter <0)
             this.counter = this.kuvaTaulu.length - 1; 
    
        this.counterText.text = this.counter + 1 + "/" + this.kuvaTaulu.length;
        
        this.stage.removeChildAt(this.currentIndex - 1);
        var bitMapImage = new createjs.Bitmap(this.kuvaTaulu[this.counter]);
        this.scale(bitMapImage);
    }


} 
