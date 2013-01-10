/**
 * QuestionPreviewFactory
 * 
 * A view factory for questions and question blocks. Returns the correct view for a given model.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['models/exam/questions/trueFalse',
    'views/exam/questions/preview/trueFalse',
    'models/exam/questions/multipleChoice',
    'views/exam/questions/preview/multipleChoice',
    'models/exam/questions/multipleAnswer',
    'views/exam/questions/preview/multipleAnswer',
    'models/exam/questions/openResponse',
    'views/exam/questions/preview/openResponse'],

    function(TrueFalseModel, TrueFalsePreview, MultipleChoiceModel, MultipleChoicePreview,
        MultipleAnswerModel, MultipleAnswerPreview,  OpenResponseModel, OpenResponsePreview){    
        
        var QuestionPreviewFactory = {
            /**
             * Given a models/exam/question subclass or models/exam/questionBlock instance,
             * renders the correct preview subclass
             * @param model An instance of models/exam/questionBlock or a models/exam/question subclass
             * @return The intialized view
             * @throws Error if the model is unrecognized
             */
            createView : function(model) {
                if(model instanceof TrueFalseModel) {
                    return (new TrueFalsePreview({model:model}));
                } else if(model instanceof MultipleChoiceModel) {
                    return (new MultipleChoicePreview({model:model}));
                } else if(model instanceof MultipleAnswerModel) {
                    return (new MultipleAnswerPreview({model:model}));
                } else if(model instanceof OpenResponseModel) {
                    return (new OpenResponsePreview({model:model}));
                } else {
                    throw new Error("QuestionPreviewFactory: Unrecognized model of type "+model.get('itemType'));
                }
            }            
        };
        
        return QuestionPreviewFactory;
});