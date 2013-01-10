/**
 * QuestionBuilderDialog
 * 
 * A dialog for creating and editing exam questions. 
 * 
 * this.collection is a repo for adding new questions.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['underscore', 
    'backbone',
    'views/shared/popups/savingDialog', 
    'handlebars', 
    'text!tpl/controls/questionBuilder/dialog.html',
    'views/shared/alert',
    'models/exam/questions/question',
    'views/controls/questionBuilder/viewModel/question',
    'views/controls/questionBuilder/viewModel/translator',
    'views/controls/questionBuilder/responses/factory',
    'views/controls/questionBuilder/properties/factory',
    'drivers/controls/longtext/driver'], 

    function(_, Backbone, SavingDialog, Handlebars, SharedViewTpl, Alert, QuestionModel, 
        QuestionViewModel, ViewModelTranslator, ResponseViewFactory, PropertiesViewFactory, 
        Longtext){
        
        var QuestionBuilderDialog = SavingDialog.extend({
            id : "questionBuilder",
            title : "New Question",
            persist:true,
            template: Handlebars.compile(SharedViewTpl),
            events : function(){
                // Inherit parent events
                var evts = _.isFunction(SavingDialog.prototype.events) ? 
                    SavingDialog.prototype.events.apply(this) : SavingDialog.prototype.events;
                evts['change #questionType'] = 'changeType';
                evts['change #questionText'] = 'updateQuestion';
                return evts;
            },
            render : function() {                
                this.setPopupTitle((this.originalModel) ? 'Edit Question' : 'New Question');
                    
                this.setPopupContent(this.template(this.model.toJSON()));
                Longtext.createAny(this.$el);
                
                // Set the Type <select> 
                this.$('#questionType option[value="'+this.model.get('itemType')+'"]').prop('selected', true);
                this._showResponseType(this.model.get('itemType'));
                
                // Less important binding site.  I'll let the properties view do the binding and flag the longtext manually
                /*Backbone.Validation.bind(this, {selector:{
                    "question" : "#questionText"
                }});*/
                
                return this;
            },
            /**
             * Opens this dialog. Creates an EditQuestionViewModel from aQuestion, if given.
             * @param aQuestion Optional. An instance of models/exam/questions/question to display in the view, if desired.
             * @param options Optional. A map of configuration parameters for the dialog. Currently supports {copy:true|false}
             *      The "copy" property is only valid if a model is passed for aQuestion.
             */
            open : function(aQuestion, options) {
                var srcQuestion, opts = {};
                // Validate arguments
                if(options) { // Caller passed both args
                    opts = _.isObject(options) ? $.extend(true, opts, options) : {};
                    srcQuestion = aQuestion;
                } else if(aQuestion) { // Caller passed one arg
                    if(aQuestion instanceof QuestionModel) { // only arg is a model
                        srcQuestion = aQuestion;
                    } else if(_.isObject(aQuestion)) { // only arg is configuration
                        opts = $.extend(true, opts, aQuestion);
                    }
                } // Else caller passed no args
                
                // Prepare a ViewModel
                var editViewQuestion = new QuestionViewModel();
                
                if(srcQuestion) {                    
                    editViewQuestion = ViewModelTranslator.modelToViewModel(srcQuestion);
                    
                    if(!opts.copy) {
                        this.originalModel = srcQuestion;
                    } else {
                        // Remove the id so we don't save an edit instead
                        editViewQuestion.set('id', undefined, {forceUpdate:true, silent:true});
                        editViewQuestion.set('displayOrder', undefined, {forceUpdate:true, silent:true});
                    }
                }
                
                this._setModel(editViewQuestion);
                
                SavingDialog.prototype.open.apply(this);
            },
            /**
             * Overridable function for saving a model. It should trigger a "saved" event
             * when the server persistance completes successfully.
             */
            save : function(){  
                this.$('#questionText').removeClass('invalid').removeAttr('data-error');
                
                if(this.model.isWholeValid(true)) {
                    this.hidePrimaryButton(); 
                    var view = this;
                    
                    try {
                        // Create a real model from the view model
                        var realModel = ViewModelTranslator.viewModelToModel(this.model);
                        log("ViewModel produced following model:");
                        log(realModel);
                        
                        if(this.originalModel) {
                            // Editing                            
//                            realModel.save(null, 
//                                {success:function(model, jqXhr){
                                    if(this.originalModel.constructor != realModel.constructor) {
                                        // Type changed
                                        view.originalModel.destroy({sync:false});
                                        view.collection.add(realModel);
                                        view.originalModel = realModel;
                                    } else {
                                        // copy attributes to originalModel
                                        view.originalModel.set(view.originalModel.parse(realModel.toJSON()), {forceUpdate:true});
                                    }
                                    view.trigger("saved", view, view.originalModel);
                                    view.showPrimaryButton();                       
                                    view.close();
                                    Alert.showAlert("info",{txt:"Question saved"});  
//                                }, error:function(model, jqXhr){
//                                    view.showPrimaryButton();
//                                    log(jqXhr);
//                                    Alert.showAlert("error",{txt:"An error occured while saving the question.<br/>"+jqXhr.responseText});  
//                                }});
                        } else {    
                            // Copying/New
//                            realModel.save(null, 
//                                {success:function(model, jqXhr){
                                    // Add to exam preview
                                    view.collection.add(realModel);

                                    view.trigger("saved", view, realModel); 
                                    view.showPrimaryButton();                       
                                    view.close();
                                    Alert.showAlert("info",{txt:"Question saved"});  
//                                }, error:function(model, jqXhr){
//                                    view.showPrimaryButton();
//                                    log(jqXhr);
//                                    Alert.showAlert("error",{txt:"An error occured while saving the question.<br/>"+jqXhr.responseText});  
//                                }});
                        }               
                    } catch(e) {
                        var msg = e instanceof Error ? e.message : e;
                        log("Error in QuestionBuilderDialog.save: "+msg);
                        log("ViewModel:");
                        log(this.model);
                        if(e instanceof Error) {
                            log(e.stack);
                        }
                        Alert.showAlert("error",{txt:"An error occured while saving the question.<br/><code>"+msg+"</code>"});                        
                        this.showPrimaryButton();
                    }
                } else {
                    // Flag the question as invalid if needed
                    if(!this.model.isValid('question')) {
                        this.$('#questionText')
                            .addClass('invalid')
                            .attr('data-error', this.model.preValidate('question', this.model.get('question')));
                    }
                    Alert.showValidationErrors();
                }
            },
            /**
             * Closes and resets the dialog
             */
            close : function() {
                this.$('#questionText').removeClass('invalid').removeAttr('data-error');
                Alert.hideAlert();
                this._removeModel();
                SavingDialog.prototype.close.apply(this, arguments);
                this.showPrimaryButton();
            },
            /**
             * Sets the model that this view represents. Prevents us from having 
             * re-init this view.
             * @param question An instance of models/exam/questions/question
             */
            _setModel : function(question){
                this.model = question;
            },
            /**
             * Removes this model from the dialog and cancels any listeners the dialog 
             * attached to it.
             */
            _removeModel : function() {
                delete this.model;
                if(this.originalModel) {
                    delete this.originalModel;
                }
            },
            /**
             * Event handler called when user changes type combobox
             * @parm evt The triggered event
             */
            changeType : function(evt) {
                var targetType = $(evt.target).find(':selected').val();            
                this.model.set({itemType:targetType}, {forceUpdate:true, silent:true});  
                this._showResponseType(targetType);
            },
            /**
             * Event handler called when user enters text in the question text box
             * @parm evt The triggered event
             */
            updateQuestion : function(evt) {
                this.model.set({question:Longtext.getData($(evt.target))}, {forceUpdate:true, silent:true});
            },
            /**
             * Determines if the specifed response view has already been rendered
             * @param id The value of the response option in the question type combobox
             * @return bool
             */
            _doesResponseUIExist : function(id) {
                return this.$('#response > .answersView#'+id).length > 0;
            },
            /**
             * Swaps out the currently visible response view for the specifed one
             * @param type The value of the response option in the question type combobox. 
             *      If not specifed, the combobox will be queried.
             */
            _showResponseType : function(type) {
                if(!type){
                    type = this.$("#questionType").find(':selected').val();
                }
                
                if(!this._doesResponseUIExist(type)) {
                    this.$('#response').append(ResponseViewFactory.createView(type, this.model).render().$el);
                }
                
                this.$('#questionProperties').html(PropertiesViewFactory.createView(type, this.model).render().$el);
                                
                Alert.hideAlert();
                if(this.$('#response > .answersView:visible').length > 0) {
                    // Remove validation errors from old response view
                    this.$('#response > .answersView:visible').find('[data-error],.invalid').removeAttr('data-error').removeClass('invalid');
                }
                
                this.$('#response > .answersView').addClass('hidden');
                this.$('#response > .answersView#'+type).removeClass('hidden');
            }
        });
        
        return QuestionBuilderDialog;
});