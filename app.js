const express=require("express")

const mongoose=require("mongoose")
main().catch(err => console.log(err));

const bodyParser=require("body-parser")

const _=require("lodash")
const dotenv=require('dotenv').config();
async function main() 

   {
      await mongoose.connect("mongodb+srv://krishnendu:krishnendu22@cluster0.37roixz.mongodb.net/todolistDB?retryWrites=true&w=majority");

      console.log("Connected");


const app=express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))


const itemSchema= new mongoose.Schema({
   name:String
})

const Item=mongoose.model("Item",itemSchema)

const item1=new Item({
   name:"Welcome to-do list!"

})

const item2=new Item({
   name:"Press + to add."
})
const item3=new Item({
   name:"<----Check the box to delete."
})

const defaultItems=[item1,item2,item3]

//


const listschema=new mongoose.Schema({
   name:String,
   items:[itemSchema]

})

const List=mongoose.model("List",listschema)




//await Item.deleteMany({});


app.get("/", async function (request, response) {
   Item.find()
     .then( async function (items) {
      if(items.length===0){
        await Item.insertMany(defaultItems)
      response.redirect("/")}
      else{
       response.render("list", { kindOfDay: "Today", newListItems: items });}
     })
     .catch(function (err) {
       console.log(err);
     });
 });





 app.get("/:customListName",async function(request,response){
   customList=_.capitalize(request.params.customListName);
   await List.findOne({ name:customList })
   .then(function(foundlist)
   {
      if(!foundlist)
     {const list=new List({
      name:customList,
      items:defaultItems
   })
   list.save();
   response.redirect("/"+customList)}
      else
     {response.render("list", { kindOfDay: customList, newListItems:foundlist.items })}
   })
   .catch(function(err)
   {
      console.log(err);
   })
   
})





 
app.post("/",async function(request,response)
{
  const newAdded=request.body.newItem;
  const listName=request.body.list;
   const newItem= new Item({
      name:newAdded
   })
   

   if(listName=="Today"){
      newItem.save();
   response.redirect("/")
   }
   else{
      await List.findOne({name:listName})
      .then(function(foundlist){
         foundlist.items.push(newItem)
         foundlist.save();
         response.redirect("/"+listName)
      })
      .catch(function(err)
   {
      console.log(err);
   })
   }
})




app.post("/delete", async function(req, res){
 
   const checkedItemId = req.body.checkbox.trim();
   const listName = req.body.listName;
  
   if(listName === "Today") {
  
    await  Item.findByIdAndRemove(checkedItemId).then(function(foundItem){Item.deleteOne({_id: checkedItemId})})
  
     res.redirect("/");
  
   } else {
    await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).then(function (foundList)
       {
         res.redirect("/" + listName);
       });
   }
  
 });





app.listen(process.env.PORT ||3000,function()
{
    console.log("Server on port 3000 is deployed.")
})







}