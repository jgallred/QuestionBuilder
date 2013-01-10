/**
 * MultipleAnswerPropertiesView
 * 
 * View class for QuestionBuilder's Open Response propterties controls. These are the checkboxes
 * below the responses.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone',
    'views/controls/questionBuilder/properties/properties', 
    'drivers/controls/longtext/driver'], 

    function(Backbone, PropertiesView, Longtext){
        
        var MultipleAnswerPropertiesView = PropertiesView.extend({
            events : function() {
                var evts = PropertiesView.prototype.events.apply(this);
                return $.extend(true, evts, {
                    'change .promptForNumberOfAnswers' : 'updatePromptForNumberOfAnswers'
                });
            },            
            questionProperties : function(){
                var props = PropertiesView.prototype.questionProperties.apply(this);
                props.splice(3,0,{id:"ma_promptForNumberOfAnswers", attrName:"shouldPromptForNumberOfAnswers", render:true, 
                    label:'Prompt student to enter <input type="number" step="1" class="promptForNumberOfAnswers" size="4" min="0" value="0"/> answers'});
                return props;
            },
            render : function() {                
                PropertiesView.prototype.render.apply(this);
                Longtext.createAny(this.$el);
                
                // Since I'm using some nontemplate HTML, I need to set the input
                if(this.model.get('promptForNumberOfAnswers')) {
                    this.$('.promptForNumberOfAnswers').val(this.model.get('promptForNumberOfAnswers'));
                }
                
                return this;
            },   
            
            validationSelectors : function() {
                var selectors = PropertiesView.prototype.validationSelectors.apply(this);
                selectors['promptForNumberOfAnswers'] = '.promptForNumberOfAnswers';
                return selectors;
            },
            
            updateShouldPromptForNumberOfAnswers : function(evt) {                
                this.model.set({shouldPromptForNumberOfAnswers:$(evt.target).is(':checked')}, {forceUpdate:true, silent:true});
                if(this.model.get('shouldPromptForNumberOfAnswers')) {
                    this.model.set({promptForNumberOfAnswers:parseInt(this.$('.promptForNumberOfAnswers').val())}, {forceUpdate:true, silent:true});
                } else {
                    this.model.set({promptForNumberOfAnswers:0}, {forceUpdate:true, silent:true});
                }                    
//                log(this.model.get('promptForNumberOfAnswers'));
            },
            updatePromptForNumberOfAnswers : function(evt) {
                if(this.model.get('shouldPromptForNumberOfAnswers')) {
                    this.model.set({promptForNumberOfAnswers:parseInt($(evt.target).val())}, {forceUpdate:true});
                }
//                log(this.model.get('promptForNumberOfAnswers'));
            }
        });
        
        return MultipleAnswerPropertiesView;
});