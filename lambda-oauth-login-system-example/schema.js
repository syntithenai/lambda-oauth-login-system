const mongoose = require('mongoose')

const topicsSchema = new mongoose.Schema({
	topic: { type: String },
	description: { type: String }
}, { collation: { locale: 'en_US', strength: 1 } })
topicsSchema.index({
		topic: "text",
		description:"text"
});

const commentsSchema = new mongoose.Schema({
	comment: { type: String },
	type: { type: String },
	userAvatar: { type: String },
	questionTopic: { type: String },
	questionText: { type: String },
	user: { type:mongoose.Types.ObjectId },
	question: { type:mongoose.Types.ObjectId }
}, { collation: { locale: 'en_US', strength: 1 } })
commentsSchema.index({
	comment: "text"	
});


const tagsSchema = new mongoose.Schema({
	title: { type: String }
}, { collation: { locale: 'en_US', strength: 1 } })
tagsSchema.index({
		title: "text"
});

const mnemonicsSchema = new mongoose.Schema({
	mnemonic: { type: String },
	user: { type:mongoose.Types.ObjectId },
	question: { type:mongoose.Types.ObjectId }
}, { collation: { locale: 'en_US', strength: 1 } })
mnemonicsSchema.index({
	title: "text"
});

const multipleChoiceQuestionsSchema = new mongoose.Schema({
	specific_question: { type: String},
	specific_answer: { type: String},
	multiple_choice: { type: String},
	also_accept: { type: String},
	user: { type:mongoose.Types.ObjectId },
	question: { type:mongoose.Types.ObjectId }
}, { collation: { locale: 'en_US', strength: 1 } })
multipleChoiceQuestionsSchema.index({
	specific_question: "text",
	specific_answer: "text",
	multiple_choice: "text",
	also_accept: "text",
	user: { type:mongoose.Types.ObjectId },
	question: { type:mongoose.Types.ObjectId }
});


const questionsSchema = new mongoose.Schema({
  created_date: { type: Number}, 
  updated_date: { type: Number}, 
  // store the minimum in the hosted database
  quiz: { type: String },
  tags: { type: Array },
  interrogative: { type: String},
  prefix: { type: String},
  postfix: { type: String},
  question: { type: String},
  answer: { type: String},
  discoverable: { type: String},
  access: { type: String},
  user: { type: String},
  sort: { type: String},
  //importId: { type: String},
  ok_for_alexa: { type: String},
  feedback: { type: String},
  difficulty: { type: Number},
  // links and media
  link: { type: String},
  image: { type: Array},
  media: { type: Array},
  attribution: { type: String},
  image_attribution: { type: String},
  autoshow_image: { type: String},
  autoplay_media: { type: String}  
}, { collation: { locale: 'en_US', strength: 1 } })


questionsSchema.index({
		question: "text",
		answer:"text"
});

module.exports = {questionsSchema, topicsSchema, tagsSchema, mnemonicsSchema, multipleChoiceQuestionsSchema, commentsSchema}
