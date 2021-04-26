// REFRESH 
docker exec -it mongo_mongo_1 bash
mongorestore -u adminloginsystem -p adminloginsystem -h localhost --authenticationDatabase admin --db loginsystem dump/mnemo/



// ensure updated_date
db.questions.updateMany(
    {$or:[{"updated_date":{"$eq":null}}, {"updated_date":{"$eq":''}}]},
    [
        {"$set": {"updated_date": 0}
    ]
)

// difficulty 1-3 => 1-5

// TODO
// questions with no answer but link => load from, wikipedia

// mnemonics - migrate type from questions ?



// media
media
media_ogg 
media_webm
media_mp4
autoplay_media
mediaattribution

image
imageattribution
autoshow_image

db.questions.find({
    $and:[
        {image:{$ne:null}},
        {image:{$ne:''}},
        {image:{$not:/seasky.org/}},
        {image:{$not:/abc.net.au/}},
        {image:{$not:/wikimedia.org/}},
        {image:{$not:/mathopenref.com/}},
        {image:{$not:/data:/}},
        {image:{$ne:[]}}
    ]})
   .projection({image:1})
   .sort({_id:-1})
   .limit(2000)
   
// QUESTIONS   
db.questions.find({}).forEach(function(doc) {
// merge question fields
	var data = []
	var parts = []
	if (doc.pre) parts.push(doc.pre) 
	if (doc.interrogative) parts.push(doc.interrogative)
	if (doc.question) parts.push(doc.question)
	if (doc.post) parts.push(doc.post)
	data.question_full = parts.join(' ')
	data.question_subject = doc.question
	
	  
	  
	  
	  
// images
	if (doc.image) {
		data.images= [{href: doc.image, attribution: doc.imageattribution, autoplay: doc.autoshow_image}]
	} else {
		data.images=[]
	}
	
	if (doc.media) {
		data.medias= [{href: doc.media, attribution: doc.mediaattribution, autoplay: doc.autoplay_media}]
	} else {
		data.medias=[]
	}
	
	
	
	
	  db.questions.update({_id:doc._id}, 
		{$set:data}, 
		{ multi: false, upsert: false}
	  )  

})


// MCQUESTIONS
//- option generator_[collection|filter|field]
// ensure parent question
//- multiple choice -> multiple_choice_options []

db.multiplechoicequestions.find({}).forEach(function(doc) {
  db.multiplechoicequestions.update({_id:doc._id}, 
    {$set:{access:"public", multiple_choice_options:new String(doc.multiple_choices).split("|||")}}, 
    { multi: false, upsert: false}
  )  
})

db.comments.find({}).forEach(function(doc) {
	var d = 0
	if (doc.createDate) {
		var st = doc.createDate
		var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
		var dt = new Date(st.replace(pattern,'$3-$2-$1'));

		d = dt.getTime()
	}
  db.comments.update({_id:doc._id}, 
    {$set:{userEmail:'',created_date: d, updated_date: d, access:"public"}}, 
    { multi: false, upsert: false}
  )  
})
