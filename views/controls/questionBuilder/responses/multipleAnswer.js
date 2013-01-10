/**
 * MultipleAnswerResponseView
 * View for the QuestionBuilder's Multiple Answer responses.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['views/controls/questionBuilder/responses/response', 
    'views/controls/questionBuilder/viewModel/responses/basicResponses',
    'views/controls/questionBuilder/responses/basicResponsesTable'], 

    function(ResponsesView, BasicResponseCollection, BasicResponsesTable){
        
        var MultipleAnswerResponseView = ResponsesView.extend({
            /** Overrides parent */
            verifyResponseCollection : function(model) {
                if(!model.get('multipleAnswerResponses')) {
                    // No Multiple Choice responses                    
                    var basicAnswers = new BasicResponseCollection([],{name:"multiple-answer"});
                    for(var i = 0; i < 4; i++) {
                        basicAnswers.create();
                    }
                    basicAnswers.first().set({correct:true}, {silent:true});
                    
                    model.set({"multipleAnswerResponses":basicAnswers}, {silent:true});
                }
            },
            render : function() {
                // Render the table of Mulitple Answer responses
                var maResponsesView = new BasicResponsesTable({
                    collection:this.model.get('multipleAnswerResponses'),
                    model:this.model, 
                    canAdd:true, 
                    canDelete:true, 
                    multipleCorrect:true,
                    headers:{
                        "correct" : {helpId:"mr_correct"},
                        "text" : {helpId:"mr_rep"},
                        "points" : {helpId:"mr_pts"},
                        "feedback" : {helpId:"mr_fb_"}
                    }});
                
                this.$el.append(maResponsesView.render().$el);
                
                return this;
            }
        });
        
        return MultipleAnswerResponseView;
});