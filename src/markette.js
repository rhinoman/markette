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
        template: _.template('<div class="row markette-button-bar"></div><textarea class="row" id="marketteInput" rows="12"></textarea>'),
        initialize: function(options){
            options = options || {};
            this.showImageButton = options.hasOwnProperty("showImageButton") ? options.showImageButton : true;
        },
        events: {
            'click #boldButton': 'doBold',
            'click #italicButton': 'doItalic',
            'click #linkButton': 'doLink',
            'click #imageButton': 'doImage',
            'click #quoteButton': 'doBlockQuote',
            'click #codeBlockButton': 'doCodeBlock',
            'click #numberedListButton': 'doNumberedList',
            'click #bulletListButton': 'doBulletList'
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
        imageButton: function(){
            return this.buttonTemplate()({btnId: "imageButton", glyph: "<span class='glyphicon glyphicon-picture'></span>"});
        },
        numberedListButton: function(){
            return this.buttonTemplate()({btnId: "numberedListButton", glyph: "<p class='li-num'>1.<br/>2.<br/>3.</p>" +
            "<span class='glyphicon glyphicon-menu-hamburger'></span>"});
        },
        bulletListButton: function(){
            return this.buttonTemplate()({btnId: "bulletListButton", glyph: "<span class='glyphicon glyphicon-list'></span>"})
        },


        // Renders the editor and toolbar
        onRender: function(){
            this.$(".markette-button-bar").append("<div class='btn-group' role='group' aria-label='...'></div>")
            this.$(".btn-group").append(this.boldButton());
            this.$(".btn-group").append(this.italicButton());
            this.$(".btn-group").append(this.linkButton());
            this.$(".btn-group").append(this.blockQuoteButton());
            this.$(".btn-group").append(this.codeBlockButton());
            if(this.showImageButton) {
                this.$(".btn-group").append(this.imageButton());
            }
            this.$(".btn-group").append(this.numberedListButton());
            this.$(".btn-group").append(this.bulletListButton());
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
            this.doInlineMarkup({
                before: '**',
                after: '**'
            });
        },

        // Make selected text italic
        doItalic: function(event){
            this.doInlineMarkup({
                before: '*',
                after: '*'
            });
        },

        // Insert Hyperlink
        doLink: function(event){
            this.doInlineMarkup({
                before: '[',
                after: '](http://)'
            });
        },

        // Insert Image link
        doImage: function(event){
            this.doInlineMarkup({
                before: '![',
                after: '](http://)'
            })
        },

        // Insert a block quote
        doBlockQuote: function(event){
            this.doBlockMarkup({
                before: '> ',
                after: ''
            }, "Blockquote");
        },

        doCodeBlock: function(event){
            this.doBlockMarkup({
                before: '```\n',
                after: '\n```'
            }, "code goes here");
        },

        doNumberedList: function(event){
            this.doBlockMarkup({
                before: ' 1. ',
                after: ''
            }, "List item")
        },

        doBulletList: function(event){
            this.doBlockMarkup({
                before: ' - ',
                after: ''
            }, "List item")
        },

        doBlockMarkup: function(tokens, placeholder){
            var ta = this.$("textarea#marketteInput");
            var selectionStrings = this._getSelectionStrings(ta);
            if (selectionStrings.selection === ""){
                selectionStrings.selection = placeholder;
            }
            if(!this._alreadyMarked(ta, tokens)){
                if (selectionStrings.before === "" && selectionStrings.after !== ""){
                    tokens.after += '\n\n';
                } else if (selectionStrings.before !== "" && selectionStrings.after === ""){
                    tokens.before = '\n\n' + tokens.before;
                } else if (selectionStrings.before !== "" && selectionStrings.after !== ""){
                    tokens.before = '\n\n' + tokens.before;
                    tokens.after += '\n\n';
                }
                this._replaceSelection(ta, tokens, selectionStrings);
            }
        },

        doInlineMarkup: function(tokens){
            var ta = this.$("textarea#marketteInput");
            var selectionStrings = this._getSelectionStrings(ta);
            // Make sure this text isn't already marked up
            if(this._alreadyMarked(ta, tokens)){
                return false;
            } else {
                this._replaceSelection(ta, tokens, selectionStrings);
                return true;
            }
        },

        _alreadyMarked: function(textarea, tokens){
            var allText = textarea.val();
            var position = getInputSelection(textarea.get(0));
            var prevBefore = allText.substring(position.start - tokens.before.length, position.start);
            var prevAfter = allText.substring(position.end,  position.end + tokens.after.length);
            if(prevBefore === tokens.before && prevAfter === tokens.after){
                return true;
            } else {
                return false;
            }
        },

        _getSelectionStrings: function(textarea){
            var position = getInputSelection(textarea.get(0));
            var allText = textarea.val();
            var textBefore = allText.substring(0, position.start);
            var textAfter = allText.substring(position.end, allText.length);
            var selection = allText.substring(position.start, position.end);
            return {
                before: textBefore,
                after: textAfter,
                selection: selection
            };
        },

        _replaceSelection: function(textarea, tokens, selectionStrings){
            textarea.val(selectionStrings.before +
                tokens.before +
                selectionStrings.selection +
                tokens.after +
                selectionStrings.after);
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