/**
 * QuestionsView
 * 
 * Displays all questions belonging to the exam.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone', 
    'views/exam/questions/preview/factory',
    'views/shared/alert'], 

    function(Backbone, QuestionPreviewFactory, Alert){
        
        var QuestionsView = Backbone.View.extend({
            tagName : 'table',
            className : 'allQuestions',
            initialize : function() {
                this.collection.on('add remove reset', this.render, this);
            },
            render : function() {
                this.$el.html('');
                var view = this;
                var errMsgs = [];
                this.collection.forEach(function(model){
                    try {
                        // TODO If model is a question and does not have a block parent
                        view.$el.append(QuestionPreviewFactory.createView(model).render().$el);
                    } catch(e) {
                        var msg = e instanceof Error ? e.message : e;
                        log("QuestionsView.render: Unable to render model. \nMessage: "+msg);
                        log("Arguments:");
                        log(arguments);
                        errMsgs.push(msg);
                    }
                });
                
                if(errMsgs.length > 0) {
                    Alert.showAlert("error", {txt:"One or more questions could not be displayed.<br/><code>"+errMsgs.join("<br/>")+"</code>"});
                }
                return this;
            }
        });
        
        return QuestionsView;
});