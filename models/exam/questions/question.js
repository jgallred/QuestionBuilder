/**
 * Question
 * 
 * Client counterpart to LearningSuite_ExamBuilder_Question.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone'], 
    function(Backbone){
        
        var Question = Backbone.LSModel.extend({
            validation : {
                question : [
                    {
                        required : true,
                        msg: 'The question cannot be empty.'
                    },{
                        maxLength : 1000,
                        msg: 'The question cannot exceed 1000 characters.'
                    }
                ]
            },
            defaults : function(){
                return {
                    displayOrder : 0, // int - Order of the question within Exam, 0 indexed
                    question : "", // int - The actual question text
                    examID : null, // string - ID of the pexam to which the question belongs
                    linkToLearningOutcomes : false, // bool - Whether to associate the question with course Learning Outcomes
                    learningOutcomes : [], //TODO reconsider - array of strings - Array of Learning Outcome IDs
                    explainYourAnswer : false, // bool - Whether the student will need to explain why they chose their answer
                    extraCredit : false, //bool - Is the question extra credit
                    questionFeedback : "",
                    totalPoints : 0, //int - total value of the question
                    anyAnswerIsCorrect : false, //bool - Whether student can mark any answer to credit
                    itemType : null, //string - The type of the question, eg TrueFalse, Matching
                    partialCredit : false //bool - Is partial credit allowed for the question
                }
            }
        });
        
        Question.types = {
            TRUE_FALSE : "TrueFalse",
            MULTIPLE_CHOICE : "MultipleChoice",
            MULTIPLE_ANSWER : "MultipleResponse",
            OPEN_RESPONSE : "OpenResponse",
            FILL_IN_THE_BLANK : "FillInTheBlank",
            MATCHING : "Matching"
        }
        
        return Question;
});