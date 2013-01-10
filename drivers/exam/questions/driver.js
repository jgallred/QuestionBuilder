/**
 * Questions page Driver
 * 
 * Provides a handle for client functionality of the Questions page
 */
define(['views/exam/questions/exam',
    'drivers/exam/questions/datastore'],

    function(ExamView, Datastore){
        var QuestionsPage = {
            /**
             * Initializes client functionality
             */
            init : function() {
                (new ExamView({model:Datastore.exam.get()})).render();
            },
            datastore : Datastore
        }
        
        return QuestionsPage;
    }
);