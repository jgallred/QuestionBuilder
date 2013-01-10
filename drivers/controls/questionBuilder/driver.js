/**
 * QuestionBuilderDialog Driver
 * 
 * Provides an API for using the instance of questionBuilder on the page.
 */
define(['views/controls/questionBuilder/dialog',
        'views/shared/alert',
        'models/exam/questions/question',
        'drivers/exam/questions/datastore'],
    
    function(QuestionBuilderDialog, Alert, Question, Datastore){
        
        var questionBuilder = new QuestionBuilderDialog({collection:Datastore.questions.get()}); // Only one instance on a page, so init it here
        
        return {
            /**
             * @return The instance of QuestionBuilderDialog
             */
            getInstance : function() {
                return questionBuilder;
            },
            /**
             * Opens the questionBuilder dialog with the given rubric model or a new Rubric
             * model.
             * @param question Optional. An existing instance of models/exam/questions/question
             * @param options Optional. See views/controls/questionBuilder/dialog for details
             */
            open : function(question, options) {
                try {
                    if( question && question instanceof Question ) {
                        questionBuilder.open(question, options);
                    } else {
                        questionBuilder.open(options);
                    }
                } catch(e) {
                    var msg = e instanceof Error ? e.message : e;                          
                    log("Error in QuestionBuilderDialog driver.open(): "+msg);
                    log("Arguments:");
                    log(arguments);
                    Alert.showAlert("error",{txt:"An error occured while opening the question.<br/><code>"+msg+"</code>"});
                }
            },
            /**
             * Fetches the rubric model data, if a id or model is given, and then opens the 
             * questionBuilder dialog with the retrieved rubric model or a new Rubric model.
             * Displays a user alert if the fetch fails.
             * @param id An existing instance of models/assignments/rubric OR a UID string
             * for an instance.
             */
            fetchAndOpen : function(id) {
                /*if(id){
                    if( id instanceof Rubric ) {
                        id.fetch({success:function(model){
                            questionBuilder.open(model);
                        }, error : function(model, resp){
                            log('Error loading the Rubric');
                            log(resp);
                            Alert.showAlert("error", {txt:'An error occurred while retrieving the Rubric data for "'+model.escape('title')+'".'});
                        }});
                    } else if( typeof(id) === 'string' ) {
                        (new Rubric({id:id})).fetch({success:function(model){
                            questionBuilder.open(model);
                        }, error : function(model, resp){
                            log('Error loading the Rubric from id = '+id);
                            log(resp);
                            Alert.showAlert("error", {txt:'An error occurred while retrieving the Rubric data for "'+model.escape('title')+'".'});
                        }});
                    } else {
                        questionBuilder.open();
                    }
                } else {
                    questionBuilder.open();
                }*/
            },
            /**
             * Closes the questionBuilder dialog
             */
            close : function() {
                questionBuilder.close();
            }
        }  
    }
)