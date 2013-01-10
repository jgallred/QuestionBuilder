/**
 * OpenResponsePropertiesView
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
        
        var OpenResponsePropertiesView = PropertiesView.extend({
            events : function() {
                var evts = PropertiesView.prototype.events.apply(this);
                return $.extend(true, evts, {
                    'change .feedback' : 'updateFeedback',
                    'change .responseWordLength' : 'updateResponseWordLength'
                });
            },            
            questionProperties : function(){
                var props = PropertiesView.prototype.questionProperties.apply(this);
                props[2] = {id:"mwc_words", attrName:"useResponseWordLength", render:true, 
                    label:'Limit response length to <input type="number" step="1" class="responseWordLength" size="4" min="0" value="0"/> words'};
                props.splice(3,0,{id:"or_feedback", attrName:"useFeedback", render:true, 
                    label:'Add feedback <div contenteditable="true" class="longtextEditableDiv feedback"></div>'});
                return props;
            },
            render : function() {                
                PropertiesView.prototype.render.apply(this);
                Longtext.createAny(this.$el);
                
                // Since I'm using some nontemplate HTML, I need to set inputs
                if(this.model.get('responseWordLength')) {
                    this.$('.responseWordLength').val(this.model.get('responseWordLength'));
                }
                if(this.model.get('feedback')) {
                    this.$('.feedback').val(this.model.get('feedback'));
                }
                
                return this;
            },
            
            validationSelectors : function() {
                var selectors = PropertiesView.prototype.validationSelectors.apply(this);
                selectors['questionFeedback'] = '.feedback';
                selectors['responseWordLength'] = '.responseWordLength';
                return selectors;
            },
            
            updateUseResponseWordLength : function(evt) {                
                this.model.set({useResponseWordLength:$(evt.target).is(':checked')}, {forceUpdate:true, silent:true});
                if(this.model.get('useResponseWordLength')) {
                    this.model.set({responseWordLength:parseInt(this.$('.responseWordLength').val())}, {forceUpdate:true, silent:true});
                } else {
                    this.model.set({responseWordLength:0}, {forceUpdate:true, silent:true});
                }                    
                //log(this.model.get('responseWordLength'));
            },
            updateUseFeedback : function(evt) {
                this.model.set({useFeedback:$(evt.target).is(':checked')}, {forceUpdate:true, silent:true});
                if(this.model.get('useFeedback')) {
                    this.model.set({questionFeedback:Longtext.getData(this.$('.feedback'))}, {forceUpdate:true, silent:true});
                } else {
                    this.model.set({questionFeedback:""}, {forceUpdate:true, silent:true});
                }
                //log(this.model.get('questionFeedback'));
            },
            updateResponseWordLength : function(evt) {
                if(this.model.get('useResponseWordLength')) {
                    this.model.set({responseWordLength:parseInt($(evt.target).val())}, {forceUpdate:true});
                }
                //log(this.model.get('responseWordLength'));
            },
            updateFeedback : function(evt) {
                if(this.model.get('useFeedback')) {
                    this.model.set({questionFeedback:Longtext.getData($(evt.target))}, {forceUpdate:true});
                }
                //log(this.model.get('questionFeedback'));
            }
        });
        
        return OpenResponsePropertiesView;
});