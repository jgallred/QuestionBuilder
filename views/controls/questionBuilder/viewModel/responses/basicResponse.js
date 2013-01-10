/**
 * BasicResponseViewModel
 * 
 * This ViewModel represents the common interface for many of the question types: Symbol, 
 * Text, Points, Feedback. 
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone'], 

    function(Backbone){
        
        var BasicResponseViewModel = Backbone.LSModel.extend({
            validation : {
                text : [
                    {richTextRequired:true, msg:"The description field for a row is empty."},
                    {
                        //TODO need text max 
                        maxLength: 50,
                        msg: "The description field cannot exceed 50 characters."
                    }
                ],
                feedback : [
                    {richTextRequired:false},
                    {
                        //TODO need feedback max 
                        maxLength: 50,
                        msg: "The feedback cannot exceed 50 characters."
                    }
                ]
            },
            defaults : function(){
                return {
                    symbol : "A", // string - The symbol to identifies the answer, label of radio button
                    text : "", //string - The text answer displayed to students
                    points : 0, //int - The point value of the response
                    feedback : "", //string - The instructor's feedback to the response
                    correct : false, //bool - simply whether this answer is the correct one

                    name : "basic-answer" //string - common string amoung all related answers, used for radio buttons
                }
            }
        });
        
        return BasicResponseViewModel;
});