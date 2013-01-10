/**
 * TrueFalseResponse
 * 
 * Exists client side only. Represents a response for a TrueFalse question. Contains
 * both the model and the collection as properties with those names.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone'], 

    function(Backbone){
        
        /**
         * Model
         */
        var TrueFalseResponse = Backbone.LSModel.extend({
            initialize : function() {
                // Set the text based on the value
                function uc_first(str) {
                    return str.charAt(0).toUpperCase() + str.substr(1);
                }
                this.set({'text': uc_first(this.get('value'))},{silent:true});
            },
            validation : {
                value : {
                    oneOf: ['true', 'false'],
                    msg: "A TrueFalseResponse value can be either 'true' or 'false'."
                },
                feedback : {
                    //TODO need feedback max 
                    maxLength: 50,
                    msg: "The feedback cannot exceed {1} characters."
                }
            },
            defaults : function(){
                return {
                    value : "true", // string - can be "true" or "false" //TODO should I dump this?
                    text : "True", //string - TODO unused?
                    points : null, //int - The point value of the response
                    feedback : "", //string - The instructors feedback to the response
                    correct : false //bool - simply whether this answer is the correct one
                }
            }
        });
        
        /**
         * Formats the raw data regarding a truefalse choice and the hash needed to initialize
         * a TrueFalseResponse instance
         * @param data The raw choice data from the server TrueFalse object
         * @param value The "true" or "false" string
         * @param correctAnswer The TrueFalse questions correctAnswer value
         * @return An object literal that can be used to initialize a TrueFalseResponse instance
         */
        TrueFalseResponse.formatDataFromQuestion = function(data, value, correctAnswer) {
            var formattedData = data;
            formattedData['value'] = value;
            formattedData['correct'] = correctAnswer === value;
            return formattedData;
        }
        
        /**
         * Collection
         */
        var TrueFalseResponses = Backbone.LSCollection.extend({
            model:TrueFalseResponse,
            comparator : function(model1, model2) {
                // Sort reverse alphabetical, true before false
                return (model1.get('value') > model2.get('value')) ? -1 : 1;
            }
        });
        
        return {
            model: TrueFalseResponse,
            collection: TrueFalseResponses
        };
});