/**
 * OpenResponse
 * 
 * Client counterpart to LearningSuite_ExamBuilder_OpenResponse.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['models/exam/questions/question'], 

    function(Question){
        
        var OpenResponse = Question.extend({
            validation : {
                boxHeight : {
                    required : true,
                    min : 5
                },
                responseWordLength : {
                    required : false,
                    min : 0
                },
                questionFeedback : {
                    richTextRequired : false,
                    //TODO Need feedback max length
                    maxLength : 50
                }
            },
            defaults : function(){
                var def = Question.prototype.defaults();
                return $.extend(true, def, {   
                    itemType: Question.types.OPEN_RESPONSE,// Overrides Question default
                    boxHeight : 5,
                    responseWordLength : 0
                });
            }
        });
        
        // Inherit the validation
        OpenResponse.prototype.validation = $.extend(true, {}, Question.prototype.validation, OpenResponse.prototype.validation);
        
        return OpenResponse;
});