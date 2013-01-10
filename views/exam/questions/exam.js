define(['underscore', 
    'backbone', 
    'drivers/exam/questions/datastore',
    'drivers/controls/questionBuilder/driver',
    'drivers/controls/questionBlockBuilder/driver',
    'views/exam/questions/questions',
    'drivers/controls/longtext/driver'], 

    function(_, Backbone, Datastore, QuestionBuilder, QuestionBlockBuilder, QuestionsView, Longtext){
        
        var ExamView = Backbone.View.extend({
            el : "#examContent",
            initialize : function() {                
                Backbone.Validation.bind(this, {selector : {
                    instructions : '#examInstructions'
                }});
            
                Datastore.questions.get().on('add remove change:totalPoints', this.renderExamStats, this);
            },
            events : function(){
                return {
                    'click .examActions .newQuestion' : 'addQuestion',                
                    'click .examActions .newQuestionBlock' : 'addQuestionBlock',
                    'click .examActions .copyQuestionFromBank' : 'copyQuestion',
                    'change #examInstructions' : 'updateInstructions'
                }
            },
            render : function() {
                // Populate the instructions
                Longtext.create(this.$('#examInstructions'));
                Longtext.setData(this.$('#examInstructions'), this.model.get('instructions'));
                
                // Add exam title to page header
                $('.desc').find('h2').html($('.desc').find('h2').text()+':&nbsp;<span class="pageExamTitle">'+this.model.get('title')+'</span>');
                $('.desc').append('<span class="examStats"></span>');
                this.renderExamStats();
                
                // Render questions
                var questions = Datastore.questions.get();
                if(questions.length == 0) {
                    this.$('> #questions').html('<p class="no-content">No questions yet</p>');
                } else {
                    this.$('> #questions').html((new QuestionsView({collection:questions})).render().$el);
                }
            },
            renderExamStats : function() {
                var questions = Datastore.questions.get();
                if(questions.length > 0) {
                    var sumPoints = questions.reduce(function(total, model){
                        return total+model.get('totalPoints');
                    },0);
                    
                    $('.desc .examStats').text(questions.length+" questions "+sumPoints+" points");
                } else {
                    $('.desc .examStats').text('');
                }
            },
            updateInstructions : function(evt) {
                this.model.set({'instructions':Longtext.getData($(evt.target))}, {forceUpdate:true});
            },
            addQuestion : function() {
                QuestionBuilder.open();
            },
            addQuestionBlock : function() {
                QuestionBlockBuilder.open();
            },
            copyQuestion : function() {
                //TODO
                log('Open Question Bank Dialog');
            }
        });
        
        return ExamView;
});