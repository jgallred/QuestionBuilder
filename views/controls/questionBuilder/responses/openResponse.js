/**
 * OpenResponseView
 * 
 * View for the QuestionBuilder's Open Response.
 * 
 * @author Jason Allred <jgallred86@gmail.com>
 */
define(['backbone',
    'handlebars',
    'views/controls/questionBuilder/responses/response',
    'views/controls/questionBuilder/viewModel/responses/openResponse'], 

    function(Backbone, Handlebars, ResponsesView, OpenResponseViewModel){
        
        var viewTpl = 
            '<div class="form">'
                +'<table id="openResponseDetail">'
                    +'<tbody>'
                        +'<tr>'
                            +'<td><b>Response box height</b></td>'
                            +'<td><input type="number" class="boxHeight" value="{{boxHeight}}" size="3" step="1" value="5" min="5"> lines.{{{helpIcon "or_height_label" appendSuffix=true}}}</td>'
                        +'</tr>'
                        +'<tr>'
                            +'<td><b>Points Possible</b></td>'
                            +'<td><input type="number" class="points-incrementor" value="{{totalPoints}}" size="3" step="any" value="0"></td>'
                        +'</tr>'
                    +'</tbody>'
                +'</table>'
            +'</div>';
        
        var OpenResponseView = ResponsesView.extend({
            template : Handlebars.compile(viewTpl),
            /** Overrides parent */
            verifyResponseCollection : function(model) {
                if(!model.get('openResponseData')) {
                    model.set({"openResponseData":new OpenResponseViewModel()}, {silent:true});
                }
            },
            initialize : function() {
                ResponsesView.prototype.initialize.apply(this, arguments);
                this.model = this.model.get('openResponseData');
            },
            events : function() {
                return {
                    'change .points-incrementor' : 'updatePoints',
                    'change .boxHeight' : 'updateBoxHeight'
                }
            },
            render : function() {
                this.$el.append(this.template(this.model.toJSON()));  
                Backbone.Validation.bind(this, {selector:{
                        "totalPoints" : ".points-incrementor",
                        "boxHeight" : ".boxHeight"
                }});
                return this;
            },
            /**
             * Updates the model with the UI point value
             */
            updatePoints : function() {
                this.model.set({'totalPoints': parseFloat(this.$('.points-incrementor').val())}, {forceUpdate:true, silent:true});
            },
            /**
             * Updates the model with the UI box height value
             */
            updateBoxHeight : function() {
                this.model.set({'boxHeight': parseInt(this.$('.boxHeight').val())}, {forceUpdate:true, silent:true});
            }
        });
        
        return OpenResponseView;
});