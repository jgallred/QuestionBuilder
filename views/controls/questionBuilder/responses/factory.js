/**
 * ResponseViewFactory
 * 
 * Factory for creating the QuestionBuilder dialog response views based on the type from the
 * question type select box.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['views/controls/questionBuilder/responses/trueFalse',
    'views/controls/questionBuilder/responses/multipleChoice',
    'views/controls/questionBuilder/responses/multipleAnswer',
    'views/controls/questionBuilder/responses/openResponse'], 

    function(TrueFalseResponseView, MultipleChoiceResponseView, MultipleAnswerResponseView, 
            OpenResponseView){
        
        var ResponseViewFactory = {
            createView : function(type, model) {
                switch(type) {
                    case "multiple-choice":
                        return new MultipleChoiceResponseView({model:model, id:type});
                    case "multiple-answer":
                        return new MultipleAnswerResponseView({model:model, id:type});
                    case "true-false":
                        return new TrueFalseResponseView({model:model, id:type});
                    case "open-response":
                        return new OpenResponseView({model:model, id:type});
                    default:
                        throw new Error("AnswerViewFactory.createView: Unrecognized question type "+type);
                        break;
                }
            }
        }
        
        return ResponseViewFactory;
});