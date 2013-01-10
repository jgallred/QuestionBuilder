/**
 * TrueFalseResponsesView
 * 
 * View for the QuestionBuilder's True/False responses.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['views/controls/questionBuilder/responses/response', 
    'views/controls/questionBuilder/viewModel/responses/basicResponses',
    'views/controls/questionBuilder/responses/basicResponsesTable'], 

    function(ResponsesView, BasicResponseCollection, BasicResponseTable){
        
        var TrueFalseResponsesView = ResponsesView.extend({
            /** Overrides parent */
            verifyResponseCollection : function(model) {
                if(!model.get('trueFalseResponses')) {
                    // No TrueFalse responses
                    var basicResponses = new BasicResponseCollection([
                        {symbol:"T", text:"True", correct:true},
                        {symbol:"F", text:"False"}], {name:"true-false"});  
                    basicResponses.comparator = function(model1, model2) {
                        // Sort reverse alphabetical, T before F
                        return (model1.get('symbol') > model2.get('symbol')) ? -1 : 1;
                    }
                    basicResponses.sort();
                    
                    model.set({"trueFalseResponses":basicResponses}, {silent:true});
                }
            },
            render : function() {
                // Render the table of T/R responses
                var trResponsesView = new BasicResponseTable({
                    collection:this.model.get('trueFalseResponses'), 
                    model:this.model,
                    canAdd:false, 
                    canDelete:false,
                    headers:{
                        "correct":{subtext:"choose 1", helpId:"tf_correct"},
                        "text" : {helpId:"tf_rep"},
                        "points" : {helpId:"tf_pts"},
                        "feedback" : {helpId:"tf_fb"}
                    }});
                
                this.$el.append(trResponsesView.render().$el);
                
                return this;
            }
        });
        
        return TrueFalseResponsesView;
});