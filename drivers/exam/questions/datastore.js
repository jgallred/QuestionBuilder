/**
 * Questions page Datastore
 * 
 * Provides a centralized location for storing models needed by the Questions page
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone', 
    'models/exam/exam',
    'models/exam/questions/factory',
    'views/shared/alert'],

    function(Backbone, Exam, QuestionModelFactory, Alert) {
        
        // The single Exam instance being edited by the questions page
        var exam = new Exam();
        
        // A single collection to maintain all questions included in the exam
        var examQuestions = new Backbone.LSCollection();
        examQuestions.comparator = function(model) {return model.get('displayOrder')};
                
        var Datastore = {
            /**
             * API for accessing the Exam model
             */
            exam : {
                /**
                 * @return The current Exam instance
                 */
                get : function() {
                    return exam;
                },
                /**
                 * @param An instance of models/exam/exam
                 */
                set : function(anExam) {
                    if(!(anExam instanceof Exam)) {
                        throw new Error("Datastore.exam.set only accepts object of type models/exam/exam. Given "+(typeof anExam)+".");
                    }
                    exam = anExam;
                }
            },
            /**
             * API for accessing all questions included in this Exam
             */
            questions : {
                /**
                 * @return The collection of exam questions
                 */
                get : function() {
                    return examQuestions;
                },
                /**
                 * Sets the Collection of questions given an array of javascript objects
                 * @param arrOfData An array of javascript objects with the properties of the question objects
                 */
                setFromRawData : function(arrOfData) {
                    try {
                        examQuestions.reset(QuestionModelFactory.createModels(arrOfData));                    
                    } catch(e) {                        
                        var msg = e instanceof Error ? e.message : e;                          
                        log("Error in Datastore.setFromRawData: "+msg);
                        log("Arguments:");
                        log(arguments);
                        Alert.showAlert("error",{txt:"An error occured while loading your questions.<br/><code>"+msg+"</code>"});
                    }
                }
            }
        }
        
        return Datastore;
    }
)