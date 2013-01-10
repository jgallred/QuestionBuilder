/**
 * MultipleChoiceResponse
 * 
 * Exists client side only. Represents a response for a MultipleChoice question. Contains
 * both the model and the collection as properties with those names.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone'], 

    function(Backbone){
        
        /**
         * Model
         */
        var MultipleChoiceResponse = Backbone.LSModel.extend({
            initialize : function() {
                
            },
            validation : {
                feedback : {
                    //TODO need feedback max 
                    maxLength: 50,
                    msg: "The feedback cannot exceed 50 characters."
                }
            },
            defaults : function(){
                return {
                    value : "A", // string - can be "true" or "false" //TODO should I dump this?
                    text : "", //string - 
                    points : 0, //int - The point value of the response
                    feedback : "", //string - The instructors feedback to the response
                    correct : false //bool - simply whether this answer is the correct one
                }
            }
        });
        
        /**
         * Formats the raw data regarding a multiple choice answer and the hash needed to initialize
         * a MultipleChoiceResponse instance
         * @param data The raw choice data from the server MultipleChoice object
         * @param value The choice value "A", "B", etc
         * @param correctAnswer The MultipleChoice question's correctAnswer value
         * @return An object literal that can be used to initialize a MultipleChoiceResponse instance
         */
        MultipleChoiceResponse.formatDataFromQuestion = function(data, value, correctAnswer) {
            var formattedData = data;
            formattedData['value'] = value;
            formattedData['correct'] = correctAnswer === value;
            return formattedData;
        }
        
        
        /**
         * Collection
         */
        var MultipleChoiceResponses = Backbone.LSCollection.extend({
            model:MultipleChoiceResponse,
            comparator : function(model) {
                return model.get('value');
            }
        });
        
        return {
            model: MultipleChoiceResponse,
            collection: MultipleChoiceResponses
        };
});