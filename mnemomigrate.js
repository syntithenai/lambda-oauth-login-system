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

//mcquestions
//- option generator_[collection|filter|field]
// ensure parent question
//- multiple choice -> multiple_choice_options []

db.multiplechoicequestions.find({}).forEach(function(doc) {
  db.multiplechoicequestions.update({_id:doc._id}, 
    {$set:{multiple_choice_options:new String(doc.multiple_choices).split("|||")}}, 
    { multi: false, upsert: false}
  )  
})


// mnemonics - migrate type from questions ?


// question - join pre, interrogative, question, post into general_question
// * TODO build ML model of combined question => question field as slot question_target
db.questions.updateMany(
    {},
    [
        {"$set": {"general_question": {"$concat":["$pre",' ',"$interrogative",' ',"$question",' ',"$post",' ']}}}
    ]
)

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

db.questions.find({}).forEach(function(doc) {
	var data = {}
	var doUpdate = false
	if (doc.image) {
		data.images= [{href: doc.image, attribution: doc.imageattribution, autoplay: doc.autoshow_image}]
		doUpdate = true
	}
	if (doc.media) {
		data.medias= [{href: doc.media, attribution: doc.mediaattribution, autoplay: doc.autoplay_media}]
		doUpdate = true
	}
	if (doUpdate) {
		  db.questions.update({_id:doc._id}, 
			{$set:data}, 
			{ multi: false, upsert: false}
		  )  
	}
})


