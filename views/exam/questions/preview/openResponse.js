/**
 * OpenResponsePreview
 * 
 * Exam Questions page preview of a TrueFalse question.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['views/exam/questions/preview/question', 
    'handlebars',
    'text!tpl/exam/questions/preview/openResponse.html'], 

    function(QuestionPreview, Handlebars, OpenResponseTpl){
        
        var OpenResponsePreview = QuestionPreview.extend({
            template : Handlebars.compile(OpenResponseTpl),
            render : function(){
                QuestionPreview.prototype.render.apply(this);
                this.setQuestionContent(this.template(this.model.toJSON()));
                return this;
            }
        });
        
        return OpenResponsePreview;
});