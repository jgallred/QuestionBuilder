/**
 * MultipleChoicePreview
 * 
 * Exam Questions page preview of a MultipleChoice question.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['views/exam/questions/preview/question', 
    'handlebars',
    'text!tpl/exam/questions/preview/multipleChoice.html'], 

    function(QuestionPreview, Handlebars, MultipleChoiceTpl){
        
        var MultipleChoicePreview = QuestionPreview.extend({
            template : Handlebars.compile(MultipleChoiceTpl),
            render : function(){
                QuestionPreview.prototype.render.apply(this);
                this.setQuestionContent(this.template(this.model.toJSON()));
                return this;
            }
        });
        
        return MultipleChoicePreview;
});