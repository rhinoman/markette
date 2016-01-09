(function (root, factory){
    //AMD module if available
    if (typeof define === 'function' && define.amd){
        define(['jQuery', 'underscore', 'backbone', 'marionette', 'commonmark'], factory);
    } else {
        // Browser globals
        root.Markette = factory(root, root.jQuery, root._, root.Backbone, root.Marionette, root.commonmark );
    }


}( this, function (root, $, _, Backbone, Marionette, Commonmark){
    'use strict';

    var Markette = {};
    Markette.VERSION = '0.1.0';

    Markette.View = Marionette.LayoutView.extend({

    });

    //The Editor View
    Markette.EditorView = Marionette.ItemView.extend({
        template: _.template('<div class="row markette-button-bar"></div><textarea class="row" id="marketteInput"></textarea>'),
        initialize: function(options){
            options = options || {};
        },
        events: {
            'click #boldButton': 'doBold',
            'click #italicButton': 'doItalic',
            'click #linkButton': 'doLink',
            'click #blockQuoteButton': 'doBlockQuote'
        },

        /**
         * These functions create basic buttons for the toolbar
         */
        buttonTemplate: function(){
            return _.template("<button id='<%= btnId %>' type='button' class='btn btn-default'><%= glyph %></button>");
        },
        boldButton: function(){
            return this.buttonTemplate()({btnId: "boldButton", glyph: "<span class='glyphicon glyphicon-bold'></span>"});
        },
        italicButton: function(){
            return this.buttonTemplate()({btnId: "italicButton", glyph: "<span class='glyphicon glyphicon-italic'></span>"});
        },
        linkButton: function(){
            return this.buttonTemplate()({btnId: "linkButton", glyph: "<span class='glyphicon glyphicon-link'></span>"});
        },
        blockQuoteButton: function(){
            return this.buttonTemplate()({btnId: "quoteButton", glyph: "<span class='glyphicon glyphicon-comment'></span>"});
        },
        codeBlockButton: function(){
            return this.buttonTemplate()({btnId: "codeBlockButton", glyph: "{ }"});
        },

        // Renders the editor and toolbar
        onRender: function(){
            this.$(".markette-button-bar").append("<div class='btn-group' role='group' aria-label='...'></div>")
            this.$(".btn-group").append(this.boldButton());
            this.$(".btn-group").append(this.italicButton());
            this.$(".btn-group").append(this.linkButton());
            this.$(".btn-group").append(this.blockQuoteButton());
            this.$(".btn-group").append(this.codeBlockButton());
        },

        // Returns the contents of the input textarea
        getText: function(){
            return this.$("textarea#marketteInput").val();
        },

        /**
         * Event handlers
         */

        // Make selected text bold
        doBold: function(event){
            this.doMarkupSelection({
                before: '**',
                after: '**'
            });
        },

        // Make selected text italic
        doItalic: function(event){
            this.doMarkupSelection({
                before: '*',
                after: '*'
            });
        },

        // Insert Hyperlink
        doLink: function(event){
            this.doMarkupSelection({
                before: '[',
                after: '](http://)'
            });
        },

        // Insert a block quote
        doBlockQuote: function(event){
            this.doMarkupSelection({
                before: '\n> ',
                after: '\n'
            })
        },

        doMarkupSelection: function(tokens){
            var ta = this.$("textarea#marketteInput");
            var position = getInputSelection(ta.get(0));
            var allText = ta.val();
            var textBefore = allText.substring(0, position.start);
            var textAfter = allText.substring(position.end, allText.length);
            var selection = allText.substring(position.start, position.end);

            var prevBefore = allText.substring(position.start - tokens.before.length, position.start);
            var prevAfter = allText.substring(position.end,  position.end + tokens.after.length);
            console.log("BEFORE: " + prevBefore);
            console.log("AFTER: " + prevAfter);
            // Make sure this text isn't already marked up
            if(prevBefore === tokens.before && prevAfter === tokens.after){
                return false;
            } else {
                ta.val(textBefore + tokens.before + selection + tokens.after + textAfter);
                return true;
            }
        }

    });

    //The Preview... view
    Markette.Preview = Marionette.ItemView.extend({

    });

    //Returns the start and end position (or caret position) in the text area
    //Code shamelessly taken from this answer on Stack Overflow: http://stackoverflow.com/a/3373056/1090568
    function getInputSelection(el) {
        var start = 0, end = 0, normalizedValue, range,
            textInputRange, len, endRange;

        if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
            start = el.selectionStart;
            end = el.selectionEnd;
        } else {
            range = document.selection.createRange();

            if (range && range.parentElement() == el) {
                len = el.value.length;
                normalizedValue = el.value.replace(/\r\n/g, "\n");

                // Create a working TextRange that lives only in the input
                textInputRange = el.createTextRange();
                textInputRange.moveToBookmark(range.getBookmark());

                // Check if the start and end of the selection are at the very end
                // of the input, since moveStart/moveEnd doesn't return what we want
                // in those cases
                endRange = el.createTextRange();
                endRange.collapse(false);

                if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                    start = end = len;
                } else {
                    start = -textInputRange.moveStart("character", -len);
                    start += normalizedValue.slice(0, start).split("\n").length - 1;

                    if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                        end = len;
                    } else {
                        end = -textInputRange.moveEnd("character", -len);
                        end += normalizedValue.slice(0, end).split("\n").length - 1;
                    }
                }
            }
        }

        return {
            start: start,
            end: end
        };
    }


    return Markette;
}));