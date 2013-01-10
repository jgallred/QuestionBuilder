/**
 * QuestionModelFactory
 * 
 * A model factory for questions and question blocks. Returns the correct model for a given javascript object.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['models/exam/questions/question', 
    'models/exam/questions/trueFalse', 
    'models/exam/questions/multipleChoice', 
    'models/exam/questions/multipleAnswer',
    'models/exam/questions/openResponse',
    'views/shared/alert'],

    function(Question, TrueFalse, MultipleChoice, MultipleAnswer, OpenResponse, Alert){      
        
        var QuestionModelFactory = {
            /**
             * Given raw data for a question or question block, generates the appropriate model
             * @param data A javascript object with the properties of the question object
             * @return The intialized model
             * @throws Error if the model data is unrecognized
             */
            createModel : function(data) {
                if(data.itemType === Question.types.TRUE_FALSE) {
                    return new TrueFalse(data, {parse:true});
                } else if(data.itemType === Question.types.MULTIPLE_CHOICE) {
                    return new MultipleChoice(data, {parse:true});
                } else if(data.itemType === Question.types.MULTIPLE_ANSWER) {
                    return new MultipleAnswer(data, {parse:true});
                } else if(data.itemType === Question.types.OPEN_RESPONSE) {
                    return new OpenResponse(data, {parse:true});
                } else {
                    throw new Error("QuestionModelFactory.createModel: model data has unrecognized type "+data.itemType);
                }
            },
            /**
             * Convienence method. Given an array of raw data for questions or question blocks, 
             * generates the appropriate models
             * @param arrOfData An array of javascript objects with the properties of the question objects
             * @return An array of intialized models
             * @throws Error if any of the model data is unrecognized
             */
            createModels : function(arrOfData) {
                var arrOfModels = [];
                var errMsgs = [];
                for(var i in arrOfData) {                    
                    try {
                        arrOfModels.push(this.createModel(arrOfData[i]));       
                    } catch(e) {                        
                        var msg = e instanceof Error ? e.message : e;                          
                        log("Error in QuestionModelFactory.createModels: "+msg);
                        log("Model Data:");
                        log(arrOfData[i]);
                        errMsgs.push(msg);
                    }
                }
                if(errMsgs.length > 0) {
                    Alert.showAlert("error",{txt:"One or more errors occured and we were "
                            +"unable to load all of your questions.<br/><code>"+errMsgs.join("<br/>")+"</code>"});
                }
                return arrOfModels;
            }
        };
        return QuestionModelFactory;
});