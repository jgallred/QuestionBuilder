/**
 * EditQuestionViewModel
 * 
 * This model exists only for the QuestionBuilderDialog. It provides a single model interface
 * for the view so that it doesn't have to worry about question model subtypes. It is a
 * conglomerate model, with attributes for all question subtype properties and answers. 
 * However, the answer properties, if they do not exist, are created on the fly when the 
 * user changes the type in the dialog.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone'], 
    function(Backbone){
        
        var EditQuestionViewModel = Backbone.LSModel.extend({
            validation : {
                question : [
                    {richTextRequired:true, msg:"Question text is required."},
                    {maxLength:50, msg:"The question text cannot exceed 50 characters."}
                ],
                
                // Open Response
                boxHeight : {
                    required : function(value, attrName, modelAttrs) {
                        // Because its on the question model, we need to make sure its only enforced with the right type
                        return modelAttrs['itemType'] == EditQuestionViewModel.types.OPEN_RESPONSE ? true : false;
                    },
                    min : 5
                },
                                
                
                // Open Response Properties
                responseWordLength : {
                    required : function(value, attrName, modelAttrs) {
                        // Because its on the question model, we need to make sure its only enforced with the right type
                        return modelAttrs['itemType'] == EditQuestionViewModel.types.OPEN_RESPONSE 
                            && modelAttrs['useResponseWordLength'] ? true : false;
                    },
                    min : 0
                },
                questionFeedback : {
                    richTextRequired : function(value, attrName, modelAttrs) {
                        return  modelAttrs['itemType'] == EditQuestionViewModel.types.OPEN_RESPONSE 
                            && modelAttrs['useFeedback'] ? true : false;
                    },
                    //TODO Need feedback max length
                    maxLength : 50
                },
                
                // Multiple Answer Properties
                promptForNumberOfAnswers : {
                    required : function(value, attrName, modelAttrs) {
                        // Because its on the question model, we need to make sure its only enforced with the right type
                        return modelAttrs['itemType'] == EditQuestionViewModel.types.MULTIPLE_ANSWER 
                            && modelAttrs['shouldPromptForNumberOfAnswers'] ? true : false;
                    },
                    min : 0,
                    msg: "You must enter a positive number for the number of answers to prompt the student for."
                }
            },
            defaults : function(){
                return {
                    displayOrder : 0, // int - Order of the question within Exam, 0 indexed
                    question : "", // int - The actual question text
                    examID : null, // string - ID of the exam to which the question belongs
                    linkToLearningOutcomes : false, // bool - Whether to associate the question with course Learning Outcomes
                    learningOutcomes : [], //TODO reconsider - array of strings - Array of Learning Outcome IDs
                    explainYourAnswer : false, // bool - Whether the student will need to explain why they chose their answer
                    extraCredit : false, //bool - Is the question extra credit
                    explanation : null, //TODO do I need explanation?
                    questionFeedback : "", // string - For open response feedback?
                    totalPoints : 0, //int - total value of the question
                    anyAnswerIsCorrect : false, //bool - Whether student can mark any answer to credit
                    itemType : "multiple-choice", //string - The type of the question, eg TrueFalse, Matching
                    partialCredit : false, //bool - Is partial credit allowed for the question
                    
                    // Open Response Properties
                    boxHeight : 5,
                    responseWordLength : 0
                }
            },
            isWholeValid : function() {
                var responseIsValid = true;
                
                switch(this.get('itemType')) {
                    case EditQuestionViewModel.types.TRUE_FALSE:
                        responseIsValid = this.get('trueFalseResponses').isValid(true);
                        break;
                    case EditQuestionViewModel.types.MULTIPLE_CHOICE:
                        responseIsValid = this.get('multipleChoiceResponses').isValid(true);
                        break;
                    case EditQuestionViewModel.types.MULTIPLE_ANSWER:
                        responseIsValid = this.get('multipleAnswerResponses').isValid(true);
                        break;
                    case EditQuestionViewModel.types.OPEN_RESPONSE:
                        responseIsValid = this.get('openResponseData').isValid(true);
                        break;
                    default:
                        break;
                }
                
                var iAmValid = Backbone.LSModel.prototype.isValid.apply(this, arguments);
                return iAmValid && responseIsValid;
            }
        });
        
        EditQuestionViewModel.types = {
            TRUE_FALSE : "true-false",
            MULTIPLE_CHOICE : "multiple-choice",
            MULTIPLE_ANSWER : "multiple-answer",
            OPEN_RESPONSE : "open-response",
            FILL_IN_THE_BLANK : "fill-in-the-blank",
            MATCHING : "matching"
        }
        
        return EditQuestionViewModel;
});