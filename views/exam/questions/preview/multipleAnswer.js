/**
 * MultipleAnswerPreview
 * 
 * Exam Questions page preview of a MultipleAnswer question.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['views/exam/questions/preview/question', 
    'handlebars',
    'text!tpl/exam/questions/preview/multipleAnswer.html'], 

    function(QuestionPreview, Handlebars, MultipleAnswerTpl){
        
        var MultipleAnswerPreview = QuestionPreview.extend({
            template : Handlebars.compile(MultipleAnswerTpl),
            render : function(){
                QuestionPreview.prototype.render.apply(this);
                this.setQuestionContent(this.template(this.model.toJSON()));
                return this;
            }
        });
        
        return MultipleAnswerPreview;
});