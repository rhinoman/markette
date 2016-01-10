/**
 * Created by jcadam on 1/9/16.
 */

phantom.injectJs('../bower_components/jquery/dist/jquery.js');
phantom.injectJs('../bower_components/underscore/underscore.js');
phantom.injectJs('../bower_components/backbone/backbone.js');
phantom.injectJs('../bower_components/marionette/lib/backbone.marionette.js');
phantom.injectJs('../bower_components/commonmark/dist/commonmark.js');
phantom.injectJs('../src/markette.js');

casper.test.begin('Markette editor works', 2, function suite(test){
    casper.start('test.html', function(){
        var editorView = new Markette.EditorView();
        test.assertTitle("Markette Tests");
        test.assertInstanceOf(editorView, Markette.EditorView, "editorView is a Markette EditorView");
    });

    casper.run(function(){
        // Workaround for PhantomJS bug
        setTimeout(function(){
            test.done();
            phantom.exit();
        }, 0);
    })

});
