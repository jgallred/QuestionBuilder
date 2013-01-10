/**
 * BasicResponses
 * 
 * A collection of BasicResponseViewModels. Models are sorted alphabetically by model symbol.
 * When a model is removed, the symbol ordering is updated. Calling create() will create a
 * new model with a symbol incremented from the last element in the collection.
 * 
 * When you call the constructor, if you want to pass options in like the name attribute, you
 * must pass at least an empty array as the first argument or Backbone will create a model from it.
 * 
 * Properties:
 *      name - String - The name property for all models in this collection. It will automatically
 *              be applied to models passed to the constructor or created using create()
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['underscore',
    'backbone', 
    'views/controls/questionBuilder/viewModel/responses/basicResponse'], 

    function(_, Backbone, BasicResponseViewModel){
        
        var BasicResponses = Backbone.LSCollection.extend({
            model:BasicResponseViewModel,
            initialize: function(models, options) {
                if(options && options.name) {
                    this.name = options.name;
                }
                
                // Apply the name attribute to all initial models
                if(models && models.length > 0) {
                    for(var i in models) {
                        models[i].name = this.name;
                    }
                }
                
                this.on('remove', this.renumberSymbols, this);
                this.on('remove', function(){
                    // Keep two in the collection at all times
                    if(this.length == 1) {
                        this.addNew();
                    }
                }, this);                
                this.on('remove', this.ensureOneCorrect, this);
            },
            name : "basic-answer",
            comparator : function(model) {
                return model.get('symbol');
            },
            create : function(attributes, options) {
                var attr = {name:this.name};
                if(attributes) {
                    attr = $.extend(true, attributes, attr);
                }
                var newModel = new this.model(attr);
                newModel.set({name:this.name}, {silent:true});
                if(this.length > 0) {
                    var lastSymbol = this.last().get('symbol');
                    // Increment the symbol
                    newModel.set("symbol", String.fromCharCode(lastSymbol.charCodeAt() + 1), {silent:true});
                } else {
                    newModel.set({"symbol":"A"}, {silent:true});
                }
                this.add(newModel);
                return newModel;
            },
            /**
             * Updates the symbol of all models in the collection. Begins with "A".
             * @param modelBeingDeleted The model that has been removed from the collection
             */
            renumberSymbols : function(modelBeingDeleted) {
                var curSymbol = "A"
                this.forEach(function(model){
                    if(!modelBeingDeleted || modelBeingDeleted.cid != model.cid) {
                        if(model.get("symbol") != curSymbol) {
                            model.set("symbol", curSymbol);
                        }
                        curSymbol = String.fromCharCode(curSymbol.charCodeAt() + 1);
                    }
                });
            },
            /**
             * If the model being deleted was correct, checks that at least one answer 
             * remains correct and if not makes the first answer in the collection correct.
             * @param deletedModel The model that has been removed from the collection
             */
            ensureOneCorrect : function(deletedModel) {
                if(deletedModel.get('correct')) {
                    var anyCorrect = this.where({correct:true});
                    if(anyCorrect.length == 0) {
                        this.first().set('correct', true);
                    }
                }
            },
            isValid : function() {
                var allValid = true;
                var args = arguments;
                this.forEach(function(model){
                    if(!model.isValid(args[0])) {
                        allValid = false;
                    }
                });
                return allValid;
            }
        });
        
        return BasicResponses;
});