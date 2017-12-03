var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var faker = require("faker");

var data = [];


for(var i=0;i<4;i++){
        data.push({
        name: faker.address.cityPrefix()+" "+faker.address.city(),
        image: faker.image.nature(),
        description: faker.lorem.sentences()
    })
};

function seedDB(){
    //Remove Campgrounds
    Campground.remove({},function(err){
        if(err){
            console.log(err)
        }else{
            console.log("CAMPGROUND REMOVED");
            //Add Campgrounds
            data.forEach(function(seed){
                Campground.create(seed,function(err,data){
                    if(err){
                        console.log(err)
                    }else{
                        console.log("added data");
                        Comment.create(
                            {
                                text:faker.lorem.sentences(),
                                author: faker.name.findName()
                            },function(err,comment){
                                if(err){
                                    
                                }else{
                                    data.comments.push(comment)
                                    data.save();
                                    console.log("Created new comment")
                                }
                            }
                        )
                    }
                });
            })
        }
    })
    
}

module.exports = seedDB;