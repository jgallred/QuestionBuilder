define(['underscore', 'backbone'], 
    function(_, Backbone){
        
        var Exam = Backbone.LSModel.extend({
            validation : {
                title : [
                    {
                        required : true,
                        msg: 'The exam title cannot be empty.'
                    },{
                        maxLength : 30,
                        msg: 'The exam title cannot exceed 30 characters.'
                    }
                ],
                description : [
                    {
                        required : true,
                        msg: 'The exam description cannot be empty.'
                    },{
                        maxLength : 1000,
                        msg: 'The exam description cannot exceed 1000 characters.'
                    }
                ],
                instructions : {
                    maxLength : 1500,
                    msg: 'The exam instructions cannot exceed 1500 characters.'
                }
            }
        });
        
        return Exam;
});