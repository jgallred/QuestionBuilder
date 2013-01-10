/**
 * OpenResponseData
 * 
 * This model exists only for the QuestionBuilderDialog. It provides a model for the Open
 * Response properties displayed in the answers view.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone'], 
    function(Backbone){
        
        var OpenResponseData = Backbone.LSModel.extend({
            validation : {
                boxHeight : {
                    required : true,
                    min : 5
                },
                totalPoints : {
                    required : true
                }
            },
            defaults : function(){
                return {
                    totalPoints : 0, //float - total value of the question           
                    boxHeight : 5 //int - the size of the response area in number of lines
                }
            }
        });
        
        return OpenResponseData;
});