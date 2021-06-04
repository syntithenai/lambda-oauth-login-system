const mongoose = require('mongoose')

const topicsSchema = new mongoose.Schema({
	created_date: { type: Number}, 
    updated_date: { type: Number}, 
    user: { type:mongoose.Types.ObjectId },
    topic: { type: String },
	description: { type: String }
}, { collation: { locale: 'en_US', strength: 1 } })


const topicCategoriesSchema = new mongoose.Schema({
	created_date: { type: Number}, 
    updated_date: { type: Number}, 
    user: { type:mongoose.Types.ObjectId },
    name: { type: String },
	icon: { type: String },
	sort: { type: Number },
	topics: {type: Array },
}, { collation: { locale: 'en_US', strength: 1 } })
 
//topicsSchema.index({
		//topic: "text",
		//description:"text"
//});

const commentsSchema = new mongoose.Schema({
	created_date: { type: Number}, 
    updated_date: { type: Number}, 
    comment: { type: String },
	type: { type: String },
	user: { type:mongoose.Types.ObjectId },
	userAvatar: { type: String },
	access: { type: String},
	sort: {type: Number},
	questionTopic: {type: String},
	questionText: {type: String},
	question: { type:mongoose.Types.ObjectId },
	parentComment: { type:mongoose.Types.ObjectId }
}, { collation: { locale: 'en_US', strength: 1 } })
//commentsSchema.index({
	//comment: "text"	,
	//userAvatar: "text"	,
	//topic: "text"	
//});


const tagsSchema = new mongoose.Schema({
	created_date: { type: Number}, 
    updated_date: { type: Number}, 
    user: { type:mongoose.Types.ObjectId },
    title: { type: String }
}, { collation: { locale: 'en_US', strength: 1 } })
//tagsSchema.index({
		//title: "text"
//});

const mnemonicsSchema = new mongoose.Schema({
	created_date: { type: Number}, 
    updated_date: { type: Number}, 
    mnemonic: { type: String },
	user: { type:mongoose.Types.ObjectId },
	question: { type:mongoose.Types.ObjectId },
	access: { type: String},
}, { collation: { locale: 'en_US', strength: 1 } })
//mnemonicsSchema.index({
	//title: "text"
//});

const classesSchema = new mongoose.Schema({
	created_date: { type: Number}, 
    updated_date: { type: Number}, 
    start_date: { type: Number}, 
    end_date: { type: Number}, 
    name: { type: String },
	user: { type:mongoose.Types.ObjectId },
	topics: {type: Array },
	students: {type: Array },
	access: { type: String},
}, { collation: { locale: 'en_US', strength: 1 } })
//classesSchema.index({
	//name: "text"
//});

const usersSchema = new mongoose.Schema({
	created_date: { type: Number}, 
    updated_date: { type: Number}, 
    avatar: { type: String },
    email: { type: String },
    username: { type: String },
}, { collation: { locale: 'en_US', strength: 1 } })
//usersSchema.index({
	//name: "text"
//}); 

const grabsSchema = new mongoose.Schema({
	created_date: { type: Number}, 
    updated_date: { type: Number}, 
    text: { type: String },
    url: { type: String },
	user: { type:mongoose.Types.ObjectId },
}, { collation: { locale: 'en_US', strength: 1 } })
//grabsSchema.index({
	//title: "text"
//});

const multipleChoiceQuestionsSchema = new mongoose.Schema({
	created_date: { type: Number}, 
    updated_date: { type: Number}, 
    specific_question: { type: String},
	specific_answer: { type: String},
	multiple_choice: { type: String},
	also_accept: { type: Array},
	user: { type:mongoose.Types.ObjectId },
	access: { type: String},
	questionId: { type:mongoose.Types.ObjectId }
}, { collation: { locale: 'en_US', strength: 1 } })

//multipleChoiceQuestionsSchema.index({
	//specific_question: "text",
	//specific_answer: "text",
	//multiple_choice: "text",
//});


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
  question_full: { type: String},
  question_subject: { type: Object},
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


//questionsSchema.index({
		//question: "text",
		//answer:"text"
//});

const seenSchema = new mongoose.Schema({
	updated_date: { type: Number}, 
    user: { type:mongoose.Types.ObjectId },
	question: { type:mongoose.Types.ObjectId }
 })
const successSchema = new mongoose.Schema({
	updated_date: { type: Number}, 
    user: { type:mongoose.Types.ObjectId },
	question: { type:mongoose.Types.ObjectId }
 })
 const userStatsSchema = new mongoose.Schema({
	updated_date: { type: Number}, 
    user: { type:mongoose.Types.ObjectId },
	seenTally: {type: Number},
	successTally: {type: Number},
	successRate: {type: Number}
 })
 const questionStatsSchema = new mongoose.Schema({
	updated_date: { type: Number}, 
    question: { type:mongoose.Types.ObjectId },
	seenTally: {type: Number},
	successTally: {type: Number},
	successRate: {type: Number}
 })
 
 const userQuestionProgressSchema = new mongoose.Schema({
	updated_date: { type: Number}, 
    user: { type:mongoose.Types.ObjectId },
	question: { type:mongoose.Types.ObjectId },
	seenTally: {type: Number},
	seen: {type: Number},
	successTally: {type: Number},
	successRate: {type: Number},
	topic: {type: String},
	difficulty: {type: Number},
	block: {type: Number}
 })


module.exports = {questionsSchema, topicsSchema, topicCategoriesSchema, tagsSchema, mnemonicsSchema, multipleChoiceQuestionsSchema, commentsSchema,  seenSchema, successSchema, userStatsSchema, questionStatsSchema, userQuestionProgressSchema, grabsSchema, classesSchema, usersSchema}
