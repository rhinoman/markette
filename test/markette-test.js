/**
 * Created by jcadam on 1/9/16.
 */

phantom.injectJs('../bower_components/jquery/dist/jquery.js');

casper.test.begin('Markette editor renders correctly', 4, function(test){

    casper.start('../index.html', function(){
        test.assertExists('#editorContainer');
        test.assertExists('.markette-button-bar');
        test.assertExists('.btn-group');
        test.assertExists('textarea#marketteInput');
    }).run(function(){
        setTimeout(function(){
            test.done();
        }, 0);
    });
});


casper.test.begin('Bold function works', 1, function(test){

    casper.start('../index.html', function(){
        this.click('button#boldButton');
        var text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, "****");

    }).run(function(){
        setTimeout(function(){
            test.done();
        }, 0);
    })

});

casper.test.begin('Italic function works', 1, function(test){

    casper.start('../index.html', function(){
        this.click('button#italicButton');
        var text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, "**");

    }).run(function(){
        setTimeout(function(){
            test.done();
        }, 0);
    })

});

casper.test.begin('Link function works', 1, function(test){

    casper.start('../index.html', function(){
        this.click('button#linkButton');
        var text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, "[](http://)");

    }).run(function(){
        setTimeout(function(){
            test.done();
        }, 0);
    })

});

casper.test.begin('Blockquote function works', 2, function(test){

    casper.start('../index.html', function(){
        this.click('button#quoteButton');
        var text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, "> Blockquote");
        casper.evaluate(function(){
            return $("textarea#marketteInput").val("");
        });
        this.sendKeys('textarea#marketteInput', "This is some text");
        this.click('button#quoteButton');
        text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, "This is some text\n\n> Blockquote");

    }).run(function(){
        setTimeout(function(){
            test.done();
        }, 0);
    })

});

casper.test.begin('Codeblock function works', 2, function(test){

    casper.start('../index.html', function(){
        this.click('button#codeBlockButton');
        var text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, "```\ncode goes here\n```");
        casper.evaluate(function(){
            return $("textarea#marketteInput").val("");
        });
        this.sendKeys('textarea#marketteInput', "This is some text");
        this.click('button#codeBlockButton');
        text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, "This is some text\n\n```\ncode goes here\n```");

    }).run(function(){
        setTimeout(function(){
            test.done();
        }, 0);
    })

});

casper.test.begin('Image function works', 1, function(test){

    casper.start('../index.html', function(){
        this.click('button#imageButton');
        var text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, "![](http://)");

    }).run(function(){
        setTimeout(function(){
            test.done();
        }, 0);
    })

});

casper.test.begin('Ordered List function works', 2, function(test){
    casper.start('../index.html', function(){
        this.click('button#numberedListButton');
        var text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, " 1. List item");
        casper.evaluate(function(){
            return $("textarea#marketteInput").val("");
        });
        this.sendKeys('textarea#marketteInput', "This is some text");
        this.click('button#numberedListButton');
        text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, "This is some text\n\n 1. List item");

    }).run(function(){
        setTimeout(function(){
            test.done();
        }, 0);
    })
});

casper.test.begin('Unordered List function works', 2, function(test){
    casper.start('../index.html', function(){
        this.click('button#bulletListButton');
        var text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, " - List item");
        casper.evaluate(function(){
            return $("textarea#marketteInput").val("");
        });
        this.sendKeys('textarea#marketteInput', "This is some text");
        this.click('button#bulletListButton');
        text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, "This is some text\n\n - List item");

    }).run(function(){
        setTimeout(function(){
            test.done();
        }, 0);
    })
});

//Heading 1 Test
casper.test.begin('Heading1 function works', 2, function(test){
    casper.start('../index.html', function(){
        this.click('button#heading1Button');
        var text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, "Heading\n=======");
        casper.evaluate(function(){
            return $("textarea#marketteInput").val("");
        });
        this.sendKeys('textarea#marketteInput', "Text!");
        this.click('button#heading1Button');
        text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, "Text!\n\nHeading\n=======");

    }).run(function(){
        setTimeout(function(){
            test.done();
        }, 0);
    })
});

//Heading 2 Test
casper.test.begin('Heading2 function works', 2, function(test){
    casper.start('../index.html', function(){
        this.click('button#heading2Button');
        var text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, "Heading\n-------");
        casper.evaluate(function(){
            return $("textarea#marketteInput").val("");
        });
        this.sendKeys('textarea#marketteInput', "Text!");
        this.click('button#heading2Button');
        text = casper.evaluate(function(){
            return $("textarea#marketteInput").val();
        });
        test.assertEquals(text, "Text!\n\nHeading\n-------");

    }).run(function(){
        setTimeout(function(){
            test.done();
            phantom.exit();
        }, 0);
    })
});
