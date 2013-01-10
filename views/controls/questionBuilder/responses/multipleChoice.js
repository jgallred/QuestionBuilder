/**
 * MultipleChoiceResponsesView
 * 
 * View for the QuestionBuilder's Multiple Choice responses.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['views/controls/questionBuilder/responses/response', 
    'views/controls/questionBuilder/viewModel/responses/basicResponses',
    'views/controls/questionBuilder/responses/basicResponsesTable'], 

    function(ResponsesView, BasicResponseCollection, BasicResponsesTable){
        
        var MultipleChoiceResponsesView = ResponsesView.extend({
            /** Overrides parent */
            verifyResponseCollection : function(model) {
                if(!model.get('multipleChoiceResponses')) {
                    // No Multiple Choice responses
                    var basicAnswers = new BasicResponseCollection([],{name:"multiple-choice"});
                    for(var i = 0; i < 4; i++) {
                        basicAnswers.create();
                    }
                    basicAnswers.first().set({correct:true}, {silent:true});
                    
                    model.set({"multipleChoiceResponses":basicAnswers}, {silent:true});
                }
            },
            render : function() {
                // Render the table of Mulitple Choice responses
                var mcResponsesView = new BasicResponsesTable({
                    collection:this.model.get('multipleChoiceResponses'), 
                    model:this.model,
                    canAdd:true, 
                    canDelete:true,
                    headers:{
                        "correct":{subtext:"choose 1", helpId:"mc_correct"},
                        "text" : {helpId:"mc_rep"},
                        "points" : {helpId:"mc_pts"},
                        "feedback" : {helpId:"mc_fb"}
                    }});
                
                this.$el.append(mcResponsesView.render().$el);
                
                return this;
            }
        });
        
        return MultipleChoiceResponsesView;
});