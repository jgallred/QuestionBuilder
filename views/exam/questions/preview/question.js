/**
 * QuestionPreview
 * 
 * Parent view for all models/exam/question subclass previews. Handles drag, 
 * number updating, and standard question actions.
 * 
 * In subclass initialize and render functions, make sure you call 
 * <i>ParentClassName</i>.prototype.<i>functionName</i>.apply(this);
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone', 
    'handlebars', 
    'text!tpl/exam/questions/preview/question.html',
    'drivers/controls/questionBuilder/driver',
    'views/shared/alert'], 

    function(Backbone, Handlebars, PreviewTemplate, QuestionBuilder, Alert){
        
        //NOTE: Since these variables are external to the class, they will be common and 
        //available to all instance methods
        
        // A hash map for marking which questions have been fully loaded
        var loadedQuestions = {};
        
        // Simply switch to prevent certain events from occurring while some server requests are being made
        var respondToEvents = true;
        
        
        
        var QuestionPreview = Backbone.View.extend({
            tagName:'tr',
            className:'dragable',
            questionTemplate : Handlebars.compile(PreviewTemplate),
            events : function(){
                return {
                    'click .edit-question' : 'editQuestion',
                    'click .remove-question' : 'removeQuestion',
                    'click .copy-question' : 'copyQuestion'
                }
            },
            initialize : function() {
                this.$el.attr('id', this.model.get('id'));
                this.model.on('change', this.render, this);
            },
            render : function(){
                this.$el.html(this.questionTemplate(this.model.toJSON()));
                return this;
            },
            /**
             * Replaces the question subclass specfic content with the given HTML
             * @param html The new HTML to display
             */
            setQuestionContent : function(html) {
                var existingHtml = this.$('> .content').html();
                this.$('> .content').html(html);
                this.$('> .content').append(existingHtml);
            },
            editQuestion : function() {
                if(respondToEvents) {
                    QuestionBuilder.open(this.model);
                }
            },
            removeQuestion : function() {
                if(respondToEvents) {
                    log('delete question');
                }
            },
            copyQuestion : function() {
                if(respondToEvents) {
                    QuestionBuilder.open(this.model, {copy:true});
                }
            },
            /**
             * Provides a visual cue that the data is loading. Deleting is not permitted.
             */
            disable : function() {
                //TODO implement disable
                log('disable question');
            },
            /**
             * Returns the disabled row to its original state
             */
            enable : function() {
                //TODO implement enable
                log('enable question');
            }
        });
        
        return QuestionPreview;
});