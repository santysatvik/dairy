
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// *********************************database connection *********************************
main().catch(err =>console.log(err));
async function main(){
  mongoose.set('strictQuery',false);
  await mongoose.connect("mongodb://127.0.0.1:27017/DairyDB");
  console.log("connected");
}

// *****************************item schema & default item**********************
const postSchema = new mongoose.Schema({
  title:String,
  post:String
});

const Post = mongoose.model("Post", postSchema);

const home_content = new Post({
  title:'Home',
  post:homeStartingContent
});


const about_content = new Post({
  title:'About',
  post:aboutContent

});


const contact_content = new Post({
  title:'contact',
  post:contactContent
});


const defaultItem =[home_content,about_content,contact_content];





let content = [];




var posts=[];



// ************************************get for home**********************************

app.get("/",function(req,res){
  Post.find({},function(err,foundItem){
    if(foundItem.length === 0){
      Post.insertMany(defaultItem,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("sucessfully saved");
        }
      });
      res.redirect("/");
    }
    else{
      res.render("home",{newdairy:foundItem});
    }

  });
});



// for contact

app.get("/contact",function(req,res){
  Post.findOne({title:'contact'}, function(err,foundItem){
    if(err){
      console.log(err);
    }
    else{
        res.render("contact",{contactContent:foundItem.post});
    }
  })

});


 // for about

 app.get("/about",function(req,res){
   Post.findOne({title:'About'}, function(err,foundItem){
     if(err){
       console.log(err);
     }
     else{
          res.render("about",{aboutContent:foundItem.post });
     }
   });




 });


// for composeContent

app.get("/compose",function(req,res){
  res.render("compose");
});

app.get("/posts/:postName",function(req,res){
//  console.log(_.lowerCase(req.params.postName));
  const current =_.lowerCase(req.params.postName);
  Post.findOne({title:current}, function(err,foundItem){
    if(err){
      console.log(err);
    }
    else{
         res.render("post",{currentTitle:foundItem.title,currentPost:foundItem.post });
    }
  });

  });


// post
app.post("/",function(req,res){
  const post = new Post({
    title:req.body.title.toLowerCase(),
    post:req.body.postBody
  });
post.save();
res.redirect("/");

});










app.listen(3000, function() {
  console.log("Server started on port 3000");
});
