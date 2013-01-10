/**
 * QuestionsView
 * 
 * Displays all questions belonging to the exam.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['underscore',
    'models/exam/questions/question',     
    'models/exam/questions/trueFalse', 
    'models/exam/questions/responses/trueFalseResponse', 
    'models/exam/questions/multipleChoice', 
    'models/exam/questions/responses/multipleChoiceResponse',
    'models/exam/questions/multipleAnswer', 
    'models/exam/questions/responses/multipleAnswerResponse',
    'models/exam/questions/openResponse',
    'views/controls/questionBuilder/viewModel/responses/openResponse',

    'views/controls/questionBuilder/viewModel/question',
    'views/controls/questionBuilder/viewModel/responses/basicResponses'], 

    function(_, QuestionModel, TrueFalseModel, TrueFalseResponse, 
            MultipleChoiceModel, MultipleChoiceResponse,
            MultipleAnswerModel, MultipleAnswerResponse,
            OpenResponseModel, OpenResponseDataViewModel,
            QuestionViewModel, BasicResponseCollection) {
                
        /**************************************************************/
        /* Question Mappers                                           */
        /* They handle the translation of Model to ViewModel and back */
        /**************************************************************/
        
        var Mapper = {
            modelToViewModel : function(aQuestion, viewModel) {
                this._preModelToViewModel(aQuestion, viewModel);
                this._mapSrcToDest(aQuestion, viewModel, this._modelToViewModelProperties);
                this._postModelToViewModel(aQuestion, viewModel);
            },
            viewModelToModel : function(viewModel, aQuestion) {
                this._preViewModelToModel(viewModel, aQuestion);
                this._mapSrcToDest(viewModel, aQuestion, this._viewModelToModelProperties);
                this._postViewModelToModel(viewModel, aQuestion);
            },
            
            /**
             * Sets properties on destModel with values from srcModel based on the 
             * mapping of srcModel property names to destModel property names given by propMap.
             */
            _mapSrcToDest : function(srcModel, destModel, propMap) {
                for(var i in propMap) {
                    if(_.isString(propMap[i])) {
                        destModel.set(propMap[i], srcModel.get(i),{silent:true, forceUpdate:true});
                    } else if(_.isObject(propMap[i]) && propMap[i].callback && propMap[i].property) {
                        destModel.set(propMap[i].property, propMap[i].callback(srcModel.get(i)),{silent:true, forceUpdate:true});
                    }
                }
            },
            _preModelToViewModel : function(aQuestion, viewModel) {},            
            _postModelToViewModel : function(aQuestion, viewModel) {},           
            _preViewModelToModel : function(viewModel, aQuestion) {},             
            _postViewModelToModel : function(viewModel, aQuestion) {}
        }
        
        var QuestionMapper = $.extend({}, Mapper, {
            _modelToViewModelProperties : {
                id : "id",
                displayOrder : 'displayOrder',
                question : 'question', 
                examID : 'examID',
                linkToLearningOutcomes : 'linkToLearningOutcomes',
                learningOutcomes : 'learningOutcomes',
                explainYourAnswer : 'explainYourAnswer',
                extraCredit : 'extraCredit',
                explanation : 'explanation',
                questionFeedback : 'questionFeedback',
                totalPoints : 'totalPoints',
                anyAnswerIsCorrect : 'anyAnswerIsCorrect',
                partialCredit : 'partialCredit',
                itemType : {
                    property : "itemType",
                    callback : function(modelType) {
                        var map = {}
                        map[QuestionModel.types.TRUE_FALSE] = QuestionViewModel.types.TRUE_FALSE;
                        map[QuestionModel.types.MULTIPLE_CHOICE] = QuestionViewModel.types.MULTIPLE_CHOICE;
                        map[QuestionModel.types.MULTIPLE_ANSWER] = QuestionViewModel.types.MULTIPLE_ANSWER;
                        map[QuestionModel.types.OPEN_RESPONSE] = QuestionViewModel.types.OPEN_RESPONSE;
                        map[QuestionModel.types.FILL_IN_THE_BLANK] = QuestionViewModel.types.FILL_IN_THE_BLANK;
                        map[QuestionModel.types.MATCHING] = QuestionViewModel.types.MATCHING;
                        return map[modelType];
                    }
                }
            },            
            _viewModelToModelProperties : {
                id : "id",
                displayOrder : 'displayOrder',
                question : 'question', 
                examID : 'examID',
                linkToLearningOutcomes : 'linkToLearningOutcomes',
                learningOutcomes : 'learningOutcomes',
                explainYourAnswer : 'explainYourAnswer',
                extraCredit : 'extraCredit',
                explanation : 'explanation',
                questionFeedback : 'questionFeedback',
                totalPoints : 'totalPoints',
                anyAnswerIsCorrect : 'anyAnswerIsCorrect',
                partialCredit : 'partialCredit',
                itemType : {
                    property : "itemType",
                    callback : function(viewModelType) {
                        var map = {}
                        map[QuestionViewModel.types.TRUE_FALSE] = QuestionModel.types.TRUE_FALSE;
                        map[QuestionViewModel.types.MULTIPLE_CHOICE] = QuestionModel.types.MULTIPLE_CHOICE;
                        map[QuestionViewModel.types.MULTIPLE_ANSWER] = QuestionModel.types.MULTIPLE_ANSWER;
                        map[QuestionViewModel.types.OPEN_RESPONSE] = QuestionModel.types.OPEN_RESPONSE;
                        map[QuestionViewModel.types.FILL_IN_THE_BLANK] = QuestionModel.types.FILL_IN_THE_BLANK;
                        map[QuestionViewModel.types.MATCHING] = QuestionModel.types.MATCHING;
                        return map[viewModelType];
                    }
                }
            }
        });
                
        var TrueFalseMapper = $.extend({}, Mapper, {
            _modelToViewModelProperties : {
                choices : {
                    property : "trueFalseResponses",
                    callback : function(trResponses) {
                        /* @var trResponses Collection of TrueFalseResponse */
                        var responses = trResponses.toJSON();
                        for(var i in responses) {
                            // TRResponse stores true|false in value, we change it to symbol T|F
                            responses[i].symbol = responses[i].value.charAt(0).toUpperCase();
                            delete responses[i].value;
                        }
                        
                        var basicResponses = new BasicResponseCollection(responses,{name:QuestionViewModel.types.TRUE_FALSE});
                        basicResponses.comparator = function(model1, model2) {
                            // Sort reverse alphabetical, T before F
                            return (model1.get('symbol') > model2.get('symbol')) ? -1 : 1;
                        }
                        basicResponses.sort();
                        
                        return basicResponses;
                    }
                }
            },           
            _viewModelToModelProperties : {
                trueFalseResponses : {
                    property : "choices",
                    callback : function(basicResponses) {
                        /* @var basicAnswerResponses Collection of BasicResponseViewModel */
                        var responses = basicResponses.toJSON();
                        for(var i in responses) {
                            // TRResponse stores values that are the whole word, true|false, so we set that
                            responses[i].value = responses[i].symbol == "T" ? "true" : "false";
                            delete responses[i].symbol;
                            delete responses[i].name;
                        }
                        return new TrueFalseResponse.collection(responses);
                    }
                }
            },                      
            _postViewModelToModel : function(viewModel, aQuestion) {              
                aQuestion.updateTotalPoints();
            }
        });       
        
        var MulitpleChoiceMapper = $.extend({}, Mapper, {
            _modelToViewModelProperties : {
                choices : {
                    property : "multipleChoiceResponses",
                    callback : function(mcResponses) {
                        /* @var mcResponses Collection of MultipleChoiceResponse */
                        var responses = mcResponses.toJSON();
                        for(var i in responses) {
                            responses[i].symbol = responses[i].value.toUpperCase();
                            delete responses[i].value;
                        }
                        
                        return new BasicResponseCollection(responses,{name:QuestionViewModel.types.MULTIPLE_CHOICE});
                    }
                }
            },           
            _viewModelToModelProperties : {
                multipleChoiceResponses : {
                    property : "choices",
                    callback : function(basicResponses) {
                        /* @var basicAnswerResponses Collection of BasicResponseViewModel */
                        var responses = basicResponses.toJSON();
                        for(var i in responses) {
                            responses[i].value = responses[i].symbol;
                            delete responses[i].symbol;
                            delete responses[i].name;
                        }
                        return new MultipleChoiceResponse.collection(responses);
                    }
                }
            },                      
            _postViewModelToModel : function(viewModel, aQuestion) {              
                aQuestion.updateTotalPoints();
            }
        });       
        
        var MulitpleAnswerMapper = $.extend({}, Mapper, {
            _modelToViewModelProperties : {
                promptForNumberOfAnswers : "promptForNumberOfAnswers",
                choices : {
                    property : "multipleAnswerResponses",
                    callback : function(maResponses) {
                        /* @var maResponses Collection of MultipleAnswerResponse */
                        var responses = maResponses.toJSON();
                        for(var i in responses) {
                            responses[i].symbol = responses[i].value.toUpperCase();
                            delete responses[i].value;
                        }
                        
                        return new BasicResponseCollection(responses,{name:QuestionViewModel.types.MULTIPLE_ANSWER});
                    }
                }
            },           
            _viewModelToModelProperties : {
                promptForNumberOfAnswers : "promptForNumberOfAnswers",
                multipleAnswerResponses : {
                    property : "choices",
                    callback : function(basicResponses) {
                        /* @var basicAnswerResponses Collection of BasicResponseViewModel */
                        var responses = basicResponses.toJSON();
                        for(var i in responses) {
                            responses[i].value = responses[i].symbol;
                            delete responses[i].symbol;
                            delete responses[i].name;
                        }
                        return new MultipleAnswerResponse.collection(responses);
                    }
                }
            },
            _postViewModelToModel : function(viewModel, aQuestion) {             
                aQuestion.updateTotalPoints();
            },
            _postModelToViewModel : function(aQuestion, viewModel) {
                viewModel.set({"shouldPromptForNumberOfAnswers":aQuestion.get("promptForNumberOfAnswers") > 0}, {silent:true});
            }
        });
        
        var OpenResponseMapper = $.extend({}, Mapper, {
            _modelToViewModelProperties : {
                responseWordLength : "responseWordLength",
                boxHeight : "boxHeight",
                questionFeedback : {
                    property : "useFeedback",
                    callback : function(questionFeedback) {                        
                        return questionFeedback != "";
                    }
                }
            },           
            _viewModelToModelProperties : {
                responseWordLength : "responseWordLength",
                boxHeight : "boxHeight"
            },
            _postModelToViewModel : function(aQuestion, viewModel) {
                viewModel.set({"useResponseWordLength":aQuestion.get("responseWordLength") > 0}, {silent:true});
                
                // A view model for the answer view to validate. For convienence with working with Backbone.Validation
                viewModel.set(
                    {"openResponseData": new OpenResponseDataViewModel(
                        {"boxHeight":aQuestion.get('boxHeight'),"totalPoints":aQuestion.get('totalPoints')}, 
                        {silent:true, forceUpdate:true})
                    }, 
                    {silent:true, forceUpdate:true});
            },
            _postViewModelToModel : function(viewModel, aQuestion) {  
                aQuestion.set({
                    "boxHeight":viewModel.get("openResponseData").get('boxHeight'),
                    "totalPoints":viewModel.get("openResponseData").get('totalPoints')},
                    {silent:true, forceUpdate:true});
            }
        });
        
        
        
        /*********************************************************/
        /* Translator API                                        */
        /* Methods for translating Model to ViewModels and back. */
        /* The actual work is delegated to the Mappers           */
        /*********************************************************/        
        
        var QuestionViewModelTanslator = {
            /**
             * Creates a ViewModel instance representing the given Question instance.
             * @param aQuestion An instance of models/exam/questions/question
             * @return An instance of views/controls/questionBuilder/viewModel/question
             */
            modelToViewModel : function(aQuestion) {
                if(!aQuestion) {
                    throw new Error('QuestionViewModelTanslator.modelToViewModel: A Question instance must be provided.');
                } else if(!(aQuestion instanceof QuestionModel)) {
                    throw new Error('QuestionViewModelTanslator.modelToViewModel: aQuestion must be an instance of models/exam/questions/question.');
                }
                
                var viewModel = new QuestionViewModel();
                
                QuestionMapper.modelToViewModel(aQuestion, viewModel);
                
                if(aQuestion instanceof TrueFalseModel) {
                    TrueFalseMapper.modelToViewModel(aQuestion, viewModel);                    
                } else if(aQuestion instanceof MultipleChoiceModel) {
                    MulitpleChoiceMapper.modelToViewModel(aQuestion, viewModel);                    
                } else if(aQuestion instanceof MultipleAnswerModel) {
                    MulitpleAnswerMapper.modelToViewModel(aQuestion, viewModel);                    
                } else if(aQuestion instanceof OpenResponseModel) { 
                    OpenResponseMapper.modelToViewModel(aQuestion, viewModel);
                }  else {
                    throw new Error("ViewModelTranslator.modelToViewModel: Unrecognized question instance with itemType="+aQuestion.get('itemType'));
                }
                //TODO fill in for other classes
                
                return viewModel;
            },
            /**
             * Updates the properties of aQuestion from the properties of viewModel
             * @param viewModel An instance of views/controls/questionBuilder/viewModel/question
             * @param aQuestion An instance of models/exam/questions/question
             */
            updateModelFromViewModel : function(viewModel, aQuestion) {
                if(!viewModel) {
                    throw new Error('QuestionViewModelTanslator.updateModelFromViewModel: A QuestionViewModel instance must be provided.');
                } else if(!(viewModel instanceof QuestionViewModel)) {
                    throw new Error('QuestionViewModelTanslator.updateModelFromViewModel: viewModel must be an instance of views/controls/questionBuilder/viewModel/question.');
                }
                if(!aQuestion) {
                    throw new Error('QuestionViewModelTanslator.updateModelFromViewModel: A Question instance must be provided.');
                } else if(!(aQuestion instanceof QuestionModel)) {
                    throw new Error('QuestionViewModelTanslator.updateModelFromViewModel: aQuestion must be an instance of models/exam/questions/question.');
                }
                
                
                QuestionMapper.viewModelToModel(viewModel, aQuestion);
                
                if(aQuestion instanceof TrueFalseModel 
                    && viewModel.get('itemType') == QuestionViewModel.types.TRUE_FALSE) {
                    
                    TrueFalseMapper.viewModelToModel(viewModel, aQuestion);                    
                } else if(aQuestion instanceof MultipleChoiceModel 
                    && viewModel.get('itemType') == QuestionViewModel.types.MULTIPLE_CHOICE) {
                    
                    MulitpleChoiceMapper.viewModelToModel(viewModel, aQuestion);                    
                } else if(aQuestion instanceof MultipleAnswerModel 
                    && viewModel.get('itemType') == QuestionViewModel.types.MULTIPLE_ANSWER) {
                    
                    MulitpleAnswerMapper.viewModelToModel(viewModel, aQuestion); 
                } else if(aQuestion instanceof OpenResponseModel 
                    && viewModel.get('itemType') == QuestionViewModel.types.OPEN_RESPONSE) { 
                    
                    OpenResponseMapper.viewModelToModel(viewModel, aQuestion);     
                }  else {
                    throw new Error("ViewModelTranslator.updateModelFromViewModel: "
                        +"Model and ViewModel do not align. Model instance with itemType="
                        +aQuestion.get('itemType')+" and ViewModel instance with itemType="+viewModel.get('itemType'));
                }
            },
            /**
             * Creates a Question instance from the given ViewModel instance.
             * @param viewModel An instance of views/controls/questionBuilder/viewModel/question
             * @return An instance of models/exam/questions/question
             */
            viewModelToModel : function(viewModel) {
                if(!viewModel) {
                    throw new Error('QuestionViewModelTanslator.viewModelToModel: A QuestionViewModel instance must be provided.');
                } else if(!(viewModel instanceof QuestionViewModel)) {
                    throw new Error('QuestionViewModelTanslator.viewModelToModel: viewModel must be an instance of views/controls/questionBuilder/viewModel/question.');
                }
                
                var model;
                
                switch(viewModel.get('itemType')) {
                    case QuestionViewModel.types.TRUE_FALSE:
                        model = new TrueFalseModel();
                        break;
                    case QuestionViewModel.types.MULTIPLE_CHOICE:
                        model = new MultipleChoiceModel();
                        break;
                    case QuestionViewModel.types.MULTIPLE_ANSWER:
                        model = new MultipleAnswerModel();
                        break;
                    case QuestionViewModel.types.OPEN_RESPONSE:
                        model = new OpenResponseModel();
                        break;
                    default:
                        throw new Error("QuestionViewModelTanslator.viewModelToModel: Unrecognized ViewModel instance with itemType="+viewModel.get('itemType'));
                }        
                
                this.updateModelFromViewModel(viewModel, model);
                
                return model;
            }
        }
        
        return QuestionViewModelTanslator;
});