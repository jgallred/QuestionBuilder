/**
 * MultipleAnswer
 * 
 * Client counterpart to LearningSuite_ExamBuilder_MultipleAnswer.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['models/exam/questions/question', 
    'models/exam/questions/responses/multipleAnswerResponse'], 

    function(Question, MultipleAnswerResponse){
        
        var MultipleAnswer = Question.extend({
            initialize : function(options) {
                Question.prototype.initialize.apply(this);
                if(arguments.length === 0 || !options.choices) {
                    // Can't set this as a default or all instances will share the same instances
                    this.set({choices : new MultipleAnswerResponse.collection([{value:"true", correct:true}, {value:"false"}])}, {silent:true});
                }
                
                this.get('choices').on('change:correct', this.updateCorrectAnswer, this);
                this.get('choices').on('change:points', this.updateTotalPoints, this);
            },
            validation : {
                //TODO Validate that there is a correct answer
            },
            updateCorrectAnswer:function(model) {
                if(model.get('correct') && model.get('value') !== this.get('correctAnswer')) {
                    this.set('correctAnswer', model.get('value'));
                }
            },
            updateTotalPoints:function() {
                var pointsPossible = this.get('choices').reduce(function(total, model){ 
                        // Assumes that positive points make it correct
                       return total + (model.get('points') > 0 ? model.get('points') : 0);
                    },0);
                this.set({"totalPoints" : pointsPossible},{forceUpdate:true});
            },
            /**
             * Validates not only the question instance, but all responses as well.
             * @param options See isValid
             * @return boolean
             */
            isWholeValid : function(options) {
                var responsesValid = true;
                
                if( this.get('choices') ) {
                    this.get('choices').forEach(function(detail){
                        if(responsesValid) {
                            responsesValid = detail.isValid(options);
                        } else {
                            detail.isValid(options);
                        }
                    });
                }
                
                var iAmValid = this.isValid(options);
                
                return responsesValid && iAmValid;
            },
            defaults : function(){
                var def = Question.prototype.defaults.apply(this);
                return $.extend(true, def, {     
                    allowPartialCredit: false,
                    correctAnswer : "A",
                    itemType: Question.types.MULTIPLE_ANSWER// Overrides Question default
                });
            },
            /**
             * Parses the question data into a question model with response models
             * @return If parse successful, the object literal result, else the server response.
             */
            parse : function(resp) {
                try {
                    var data = Question.prototype.parse(resp);
                    if(data.choices) {  
                        var formattedData = [];
                        for(var val in data.choices) {
                            formattedData.push(MultipleAnswerResponse.model.formatDataFromQuestion(data.choices[val], val, data.correctAnswer));
                        }
                        
                        // Format data for response models                        
                        data.choices = new MultipleAnswerResponse.collection(formattedData, {parse:true});
                    }
                    return data;
                } catch(e){}        
                return resp;
            },
            toJSON : function() {
                var data = Question.prototype.toJSON.apply(this);
                if(data.choices) {
                    // Revert choice data back into server format
                    var choiceArr = data.choices;
                    data.choices = {};
                    for(var i in choiceArr) {
                        data.choices[choiceArr[i]['value']] = choiceArr[i];
                    }
                }
                return data;
            }
        });
        
        // Inherit the validation
        MultipleAnswer.prototype.validation = $.extend(true, {}, Question.prototype.validation, MultipleAnswer.prototype.validation);
        
        return MultipleAnswer;
});