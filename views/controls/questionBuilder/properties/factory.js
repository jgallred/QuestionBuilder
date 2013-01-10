/**
 * ResponseViewFactory
 * 
 * Factory for creating the QuestionBuilder dialog properties views based on the type from the
 * question type select box.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['views/controls/questionBuilder/properties/properties',
    'views/controls/questionBuilder/properties/openResponse',
    'views/controls/questionBuilder/properties/multipleAnswer'], 

    function(PropertiesView, OpenResponseProperties, MultipleAnswerProperties){
        
        var PropertiesViewFactory = {
            createView : function(type, model) {
                switch(type) {
                    case 'open-response':
                        return new OpenResponseProperties({model:model});
                    case 'multiple-answer':
                        return new MultipleAnswerProperties({model:model});
                    default:
                        return new PropertiesView({model:model});
                }
            }
        }
        
        return PropertiesViewFactory;
});