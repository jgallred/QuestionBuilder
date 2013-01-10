/**
 * AnswersView
 * 
 * Base View class for QuestionBuilder's responses.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone', 
    'handlebars', 
    'text!tpl/controls/questionBuilder/responseProperties.html'], 

    function(Backbone, Handlebars, PropertiesTpl){
        
        var AnswersView = Backbone.View.extend({
            tagName : 'section',
            className : 'hidden answersView',
            _propertyTemplate : Handlebars.compile(PropertiesTpl),
            initialize : function() {
                this.verifyResponseCollection(this.model); 
            },
            /**
             * Checks the ViewModel to ensure it has responses to render. Adds empty 
             * responses if none are found. Override in subclasses. 
             * @param model The QuestionViewModel passed on initialization
             */
            verifyResponseCollection : function(model) {
                //Override in subclasses
            }
        });
        
        return AnswersView;
});