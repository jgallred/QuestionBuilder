/**
 * BasicResponseView
 * 
 * This view represents one answer the user can define. It includes the letter symbol,
 * answer text, point value, and feedback.
 * 
 * Properties:               
 *      canDelete : bool. Whether table rows can be removed. Default = true.
 *      multipleCorrect : bool. Whether multiple rows are allowed to be marked correct. Default = false.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone', 
    'handlebars', 
    'text!tpl/controls/questionBuilder/basicResponseRow.html',
    'views/shared/alert',
    'drivers/controls/longtext/driver'], 

    function(Backbone, Handlebars, ResponseTpl, Alert, Longtext){
        
        var BasicResponseView = Backbone.View.extend({
            tagName : "tr",
            template : Handlebars.compile(ResponseTpl),
            initialize : function(options) {
                
                if(options.canDelete !== undefined) {
                    this.canDelete = options.canDelete;
                }
                if(options.multipleCorrect !== undefined) {
                    this.multipleCorrect = options.multipleCorrect;
                }
                
                this.model.on('change:correct', function(model){
                    if(model.get('correct')) {
                        this.$el.addClass('answer');
                    } else {
                        this.$el.removeClass('answer');
                    }
                }, this);
                
                this.model.on('change:symbol', this.updateSymbol, this);
                
                Backbone.Validation.bind(this, {selector:{
                        'points' : '.points-incrementor',
                        'text' : '.responseText',
                        'feedback' : '.responseFeedback'
                }});
            },
            canDelete : true,
            multipleCorrect : false,
            events : function(){
                return {
                    'click input:radio' : 'markCorrect',
                    'click input:checkbox' : 'markCorrect',
                    'change .points-incrementor' : 'updatePoints',
                    'click .deleteAnswer' : 'deleteAnswer',
                    'change .responseText' : 'updateText',
                    'change .responseFeedback' : 'updateFeedback'
                }
            },
            render : function() {            
                if(this.model.get('correct')) {
                    this.$el.addClass('answer');
                }
                
                this.$el.html(this.template({
                    model:this.model.toJSON(), 
                    canDelete:this.canDelete,
                    multipleCorrect:this.multipleCorrect}));
                
                Longtext.createAny(this.$el);
                return this;
            },
            /**
             * Event handler for checking the radio/checkbox. Marks the answer model as correct
             * if it was not already so. If multiple correct answers are allowed, it will mark the
             * answer as incorrect if needed. If there are no other correct answers, however, an 
             * alert is displayed to the user instead.
             */
            markCorrect : function() {
                if(!this.model.get('correct')) {
                    this.model.set({'correct':true}, {forceUpdate:true});
                } else if(this.multipleCorrect) {
                    // Only allow unchecking if multiple values can be selected
                    
                    // I don't like making the model responsible for checking the collection,
                    // but I'm not sure of a better way to enforce this
                    if(this.model.collection.where({correct:true}).length > 1) {
                        this.model.set('correct', false);
                    } else {
                        Alert.showAlert("error", {txt:'At least 1 response must be correct.'});
                    }
                }
            },
            /**
             * Updates the model with the UI point value
             */
            updatePoints : function() {
                this.model.set({'points': parseFloat(this.$('.points-incrementor').val())}, {forceUpdate:true});
            },
            /**
             * Event handler
             * @parm evt The triggered event
             */
            updateText : function(evt) {
                this.model.set({text:Longtext.getData($(evt.target))}, {forceUpdate:true, silent:true});
            },
            /**
             * Event handler
             * @parm evt The triggered event
             */
            updateFeedback : function(evt) {
                this.model.set({feedback:Longtext.getData($(evt.target))}, {forceUpdate:true, silent:true});
            },
            /**
             * If deleting is allowed, removed the view and model. However, if the removal
             * would decrease the numeber of answers below 2, an alert is displayed instead.
             */
            deleteAnswer : function() {
                // I don't like making the model responsible for checking the collection,
                // but I'm not sure of a better way to enforce this
                if(this.model.collection.length > 2) {
                    this.remove();
                    this.model.destroy();
                } else {
                    Alert.showAlert("error", {txt:'At least 2 responses are required.'});
                }
            },
            /**
             * Updates the view with the model's symbol.
             * @param model The model that has changed
             */
            updateSymbol: function(model) {
                this.$('.question-choices label').text(model.get('symbol'));
                this.$('.question-choices input').attr('value', model.get('symbol'));
            }
        });
        
        return BasicResponseView;
});