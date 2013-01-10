/**
 * AnswersView
 * 
 * Base View class for QuestionBuilder's propterties controls. These are the checkboxes
 * below the responses.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone', 
    'handlebars', 
    'text!tpl/controls/questionBuilder/responseProperties.html'], 

    function(Backbone, Handlebars, PropertiesTpl){
        
        var PropertiesView = Backbone.View.extend({
            tagName : 'div',
            className : 'questionDetails form',
            _propertyTemplate : Handlebars.compile(PropertiesTpl),
            initialize : function() {
                
            },
            events : function() {
                var events = {};
                var props = this.questionProperties();
                for(var i in props) {
                    if(props[i].render) {
                        var attrName = props[i].attrName;
                        events["change input."+attrName] = "update"+attrName.charAt(0).toUpperCase()+attrName.substr(1);
                    }
                }
                return events;
            },
            
            questionProperties : function(){
                return [
                    {id:"extraCredit", attrName:"extraCredit", label:"Extra Credit", render:true},
                    {id:"anyAnswerIsCorrect", attrName:"anyAnswerIsCorrect", label:"Any response gets full credit", render:true},
                    {id:"explainAnswer", attrName:"explainYourAnswer", label:"Add 'Explain your answer' box for this question", render:true},
                    {id:"linkToLearningOutcomes", attrName:"linkToLearningOutcomes", label:"Link this question to course outcomes", render:true}
                ];
            },
            
            render : function() {
                var props = this.questionProperties();
                for(var i in props) {
                    props[i].modelValue = this.model.get(props[i].attrName);
                }
                
                // Prevent inputs from changing checkbox state
                this.$el.delegate('label > input, label > div', 'click', function(evt){
                    evt.stopPropagation();
                    evt.preventDefault();
                });
                
                this.$el.html(this._propertyTemplate({properties:props}));
                
                Backbone.Validation.bind(this, {selector : this.validationSelectors()});
                
                return this;
            },

            validationSelectors : function() {
                return {
                    "extraCredit" : "#extraCredit",
                    "anyAnswerIsCorrect" : "#anyAnswerIsCorrect",
                    "explainAnswer" : "#explainAnswer",
                    "linkToLearningOutcomes" : "#linkToLearningOutcomes"                    
                }
            },
            
            updateExtraCredit : function(evt) {
                this.model.set("extraCredit", $(evt.target).is(':checked'), {forceUpdate:true});
            },
            updateAnyAnswerIsCorrect : function(evt) {
                this.model.set("anyAnswerIsCorrect", $(evt.target).is(':checked'), {forceUpdate:true});
            },
            updateExplainYourAnswer : function(evt) {
                this.model.set("explainYourAnswer", $(evt.target).is(':checked'), {forceUpdate:true});
            },
            updateLinkToLearningOutcomes : function(evt) {
                this.model.set("linkToLearningOutcomes", $(evt.target).is(':checked'), {forceUpdate:true});
            }
        });
        
        return PropertiesView;
});