/**
 * BasicResponsesTableView
 * TODO Make separate table view for multipleAnswer
 * 
 * This view is a table with rows for each answer. 
 * 
 * Properties:
 *      headers : Hash. An object contained the table header data. You can specify specific
 *              elements to change and they will be merged with the default data.
 *              Schema:
 *                  {
 *                      "reference index" : {id:"", name:"", className:"", subtext:"", helpId:""}
 *                  }
 *                  name : The header title to display
 *                  className : A CSS class string to apply to the <th>. Optional.
 *                  subtext : A subtitle to display below the name. It will be wrapped in (). Optional.
 *                  helpId : Prefix to "_label_label" for help icon. Legacy support.
 *              Default:
 *                  {
                        "correct" : {name:"Correct", className:"correct"},
                        "text" : {name:"Choices", className:"options"},
                        "points" : {name:"Points", className:"points"},
                        "feedback" : {name:"Feedback", className:"feedback"},
                        "delete" : {name:"Delete", className:"delete"}
                    }
 *               
 *      canDelete : bool. Whether table rows can be removed. Default = true.
 *      canAdd : bool. Whether table rows can be added. Default = true.
 *      multipleCorrect : bool. Whether multiple rows are allowed to be marked correct. Default = false.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone', 
    'handlebars',
    'views/controls/questionBuilder/responses/basicResponseRow',
    'text!tpl/controls/questionBuilder/basicResponsesTable.html',
    'views/shared/alert'], 

    function(Backbone, Handlebars, BasicResponseView, TableTpl, Alert){
        
        var defaultHeaders = {
            "correct" : {name:"Correct", className:"correct", helpId:"basicResponseCorrect"},
            "text" : {name:"Choices", className:"options", helpId:"basicResponseText"},
            "points" : {name:"Points", className:"points", helpId:"basicResponsePoints"},
            "feedback" : {name:"Feedback", className:"feedback", helpId:"basicResponseFeedback"},
            "delete" : {name:"Delete", className:"delete"}
        }
        
        var BasicResponsesTableView = Backbone.View.extend({
            tagName : 'table',
            template : Handlebars.compile(TableTpl),
            initialize : function(options) {                
                this.headers = $.extend(true, {}, defaultHeaders);
                if(options.headers) {
                    this.headers = $.extend(true, this.headers, options.headers);
                }
                
                if(options.canDelete !== undefined && options.canDelete === false) {
                    delete this.headers['delete']; // Remove table header
                }                
                if(options.canDelete !== undefined) {
                    this.canDelete = options.canDelete;
                }
                if(options.canAdd !== undefined) {
                    this.canAdd = options.canAdd;
                }
                if(options.multipleCorrect !== undefined) {
                    this.multipleCorrect = options.multipleCorrect;
                }
                
                this.collection.on('change:points', this.refreshPointsPossible, this);
                this.collection.on('change:points', this.selectCorrectAnswerFromPoints, this);
                this.collection.on('change:points', this.checkPartialCredit, this);
                
                if(!options.multipleCorrect) {
                    this.collection.on('change:correct', this.manageCorrectness, this);
                } else {
                    // Adding and removing correct answers affect total points
                    this.collection.on('change:correct', this.refreshPointsPossible, this);
                }
            },
            events : function(){
                return {
                    'click .bAdd-new' : 'addNewRow'
                }
            },
            canDelete : true,
            canAdd : true,
            multipleCorrect: false,
            render : function() {
                
                for(var i in this.headers) {
                    if(this.headers[i].helpId) {
                        // For some reason they have 2 "_label", so we add one here and another in the template
                        this.headers[i].helpId += "_label";
                    }
                }
                
                var data = {headers: this.headers, canAdd:this.canAdd}
                this.$el.html(this.template(data));
                var view = this;
                var lastRow = this.$('tbody > tr:first');
                this.collection.forEach(function(model) {
                    var row = (new BasicResponseView({model:model, canDelete:view.canDelete, multipleCorrect:view.multipleCorrect})).render().$el;
                    row.insertBefore(lastRow);
                });                
                this.refreshPointsPossible();                
                return this;
            },
            /**
             * Sets the Points Possible label with the value of the model with the maximum points
             */
            refreshPointsPossible : function(model) {
                if(!this.multipleCorrect) {
                    // Only the answer with the most points is set as points possible
                    var maxPointsModel = this.collection.max(function(model){return model.get('points');});
                    if(maxPointsModel) {
                        this.$('.totalPoints label').html(maxPointsModel.get('points'));
                    } else {
                        this.$('.totalPoints label').html("0");
                    }
                } else {
                    // Add all correct answers together
                    var pointsPossible = this.collection.reduce(function(total, model){
                            return total + (model.get('correct') ? model.get('points') : 0);
                        }, 0);
                    this.$('.totalPoints label').html(pointsPossible);
                }
            },
            /**
             * Ensures that answer with most points is selected as correct
             */
            selectCorrectAnswerFromPoints : function(model) {
                if(!this.multipleCorrect) {
                    var maxPointsModel = this.collection.max(function(model){return model.get('points');});
                    if(maxPointsModel && model.cid == maxPointsModel.cid && !maxPointsModel.get('correct')) {
                        // Case: Have at least 3 answers, two answers with the same max point value, 
                        // changing value of a third.  Max would always select the last answer. 
                        // Prevent this case by ensuring that we only change the correct answer 
                        // if we're editing the answer that should now be correct
                        maxPointsModel.set({'correct': true}, {forceUpdate:true});                            
                    }
                } else {
                    //TODO Make separate view for multipleAnswer
//                    if(model.get('points') > 0) {
//                        
//                    } else if(model.get('correct')) {
//                        // Can't have correct answers with
//                        model.set({'correct':false}, {forceUpdate:true});
//                    }
                }
            },
            /**
             * Sets the questionViewModel's partialCredit property based on how many answers have positive points
             */
            checkPartialCredit : function(model) {
                var valuedAnswers = this.collection.filter(function(model){return model.get('points') > 0});
                if(valuedAnswers.length > 1 && !this.model.get('partialCredit')) {
                    this.model.set({'partialCredit':true}, {forceUpdate:true});
                } else if(valuedAnswers.length <= 1 && this.model.get('partialCredit')) {
                    this.model.set({'partialCredit':false}, {forceUpdate:true});
                }
            },
            /**
             * In responses where only one correct answer is allowed, this method marks the
             * previous correct response as incorrect
             * @param model The model that the user has just marked as correct
             */
            manageCorrectness : function(model) {
                if(model.get('correct')) { // Prevent setter events within from re-executing this method.
                    var models = this.collection.where({correct:true});
                    for(var i in models) {
                        if(models[i].cid != model.cid) { // Use cid since the AnswerViewModel has no ID
                            models[i].set({'correct':false}, {forceUpdate:true});
                        }
                    }
                }
            },
            /**
             * Adds a new response row to the end of the table. Alerts the user if they've
             * reached the maximum responses.
             */
            addNewRow : function() {
                if(this.canAdd) {
                    if(this.collection.length <= 25) {
                        var model = this.collection.create();
                        var rowView = (new BasicResponseView({model:model, canDelete:this.canDelete, multipleCorrect:this.multipleCorrect}));
                        rowView.render().$el.insertBefore(this.$('tbody > tr.new'));
                    } else {
                        //TODO Should we hide the add row in this circumstance
                        log('TODO Should we hide the add row in this circumstance');
                        Alert.showAlert("error", {txt:'You are limited to a maximum of 26 responses.'});                        
                    }
                }
            }
        });
        
        return BasicResponsesTableView;
});