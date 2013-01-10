/**
 * TrueFalse
 * 
 * Client counterpart to LearningSuite_ExamBuilder_TrueFalse.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['models/exam/questions/question', 
    'models/exam/questions/responses/trueFalseResponse'], 

    function(Question, TrueFalseResponse){
        
        var TrueFalse = Question.extend({
            initialize : function(options) {
                Question.prototype.initialize.apply(this);
                if(arguments.length === 0 || !options.choices) {
                    // Can't set this as a default or all instances will share the same instances
                    this.set({choices : new TrueFalseResponse.collection([{value:"true", correct:true}, {value:"false"}])}, {silent:true});
                }
                
                this.get('choices').on('change:correct', this.updateCorrectAnswer, this);
                this.get('choices').on('change:points', this.updateTotalPoints, this);
            },
            validation : {
                correctAnswer : {
                    oneOf: ['true', 'false'],
                    msg: "You must select either true or false as the correct answer."
                }
            },
            updateCorrectAnswer:function(model) {
                if(model.get('correct') && model.get('value') !== this.get('correctAnswer')) {
                    this.set('correctAnswer', model.get('value'));
                }
            },
            updateTotalPoints:function() {
                var maxPointsModel = this.get('choices').max(function(model){return model.get('points');});
                this.set({"totalPoints" : maxPointsModel ? maxPointsModel.get('totalPoints') : 0},{forceUpdate:true});
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
                var def = Question.prototype.defaults();
                return $.extend(true, def, {                    
                    correctAnswer : "true",
                    itemType: Question.types.TRUE_FALSE// Overrides Question default
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
                        // Format data for response models                        
                        data.choices = new TrueFalseResponse.collection([
                            TrueFalseResponse.model.formatDataFromQuestion(data.choices["true"], "true", data.correctAnswer), 
                            TrueFalseResponse.model.formatDataFromQuestion(data.choices["false"], "false", data.correctAnswer)
                        ], {parse:true});
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
        TrueFalse.prototype.validation = $.extend(true, {}, Question.prototype.validation, TrueFalse.prototype.validation);
        
        return TrueFalse;
});