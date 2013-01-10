/**
 * TrueFalsePreview
 * 
 * Exam Questions page preview of a TrueFalse question.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['views/exam/questions/preview/question', 
    'handlebars',
    'text!tpl/exam/questions/preview/trueFalse.html'], 

    function(QuestionPreview, Handlebars, TrueFalseTpl){
        
        var TrueFalsePreview = QuestionPreview.extend({
            template : Handlebars.compile(TrueFalseTpl),
            initialize : function() {
                QuestionPreview.prototype.initialize.apply(this);
            },
            render : function(){
                QuestionPreview.prototype.render.apply(this);
                this.setQuestionContent(this.template(this.model.toJSON()));
                return this;
            }
        });
        
        return TrueFalsePreview;
});