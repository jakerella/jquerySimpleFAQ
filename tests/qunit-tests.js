
// ---------------- Test Data --------------- //

var              ns = 'simpleFAQ';
    faqItemTemplate = "<li id='faq-{{Num}}'><p class='question'>Question {{Num}} - {{NumWord}} - Ques{{NumWord}}</p><p class='answer'>Answer {{Num}} - {{NumWord}} - Ans{{NumWord}}</p>";
        tagTemplate = "<p class='tags'>faq{{Num}}, tag, {{NumWord}}</p>",
         htmlOneFAQ = "",
  htmlManyFAQNoTags = "",
        htmlManyFAQ = "",
           jsonData = [],
     jsonDataNoTags = [],
            numFaqs = 10,
           numWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

// fill JSON and HTML data for use later
var i, fi, ft;
for (i=0; i<numFaqs; ++i) {
  fi = faqItemTemplate.replace(/\{\{Num\}\}/g, ""+(i+1));
  ft = tagTemplate.replace(/\{\{Num\}\}/g, ""+(i+1));
  fi = fi.replace(/\{\{NumWord\}\}/g, ""+numWords[(i+1)]);
  ft = ft.replace(/\{\{NumWord\}\}/g, ""+numWords[(i+1)]);
  
  if (i===0) {
    htmlOneFAQ += fi+ft+"</li>";
  }
  htmlManyFAQ += fi+ft+"</li>";
  htmlManyFAQNoTags += fi+"</li>";

  jsonData.push({
    question: "Question "+(i+1),
    answer: "Answer "+(i+1),
    tags: "q"+(i+1)+", tag"
  });
  jsonDataNoTags.push({
    question: "Question "+(i+1),
    answer: "Answer "+(i+1)
  });
}


// ---------------- Test Modules --------------- //


// ------------------------------------------------- //
    module("Initialize & Default Options Tests", {
// ------------------------------------------------- //
      setup: function() {
        document.location.hash = "";
      },
      teardown: function() {
        document.location.hash = "";  
      }
    });

test("Can create object", function(a) {
  var sf = new $.jk.SimpleFAQ();
  a.ok(sf, "SimpleFAQ object created");
});

test("Default options set", function(a) {
  var sf = new $.jk.SimpleFAQ();

  a.equal(sf.data, null, "data has correct default");
  a.equal(sf.nodeType, 'li', "nodeType has correct default");
  a.equal(sf.questionClass, 'question', "questionClass has correct default");
  a.equal(sf.answerClass, 'answer', "answerClass has correct default");
  a.equal(sf.tagClass, 'tags', "tagClass has correct default");

  a.equal(sf.showOnlyOne, false, "showOnlyOne has correct default");
  a.equal(sf.allowSearch, false, "allowSearch has correct default");
  a.equal(sf.searchNode, null, "searchNode has correct default");
  a.equal(sf.minSearchScore, 0.5, "minSearchScore has correct default");
  a.equal(sf.sortSearch, false, "sortSearch has correct default");
  a.equal(sf.caseSensitive, false, "caseSensitive has correct default");
  a.equal(sf.slideSpeed, 500, "slideSpeed has correct default");
  a.equal(sf.keyTimeout, 400, "keyTimeout has correct default");
  a.equal(sf.partialTagScore, 0.1, "partialTagScore has correct default");
  a.equal(sf.exactTagScore, 0.2, "exactTagScore has correct default");

  a.equal(sf.node, null, "node has correct default");
});

test("Node selected correctly by selector", function(a) {
  var sf = new $.jk.SimpleFAQ({node: '#faq'});
  a.equal(sf.node.get(0), $('#faq').get(0), "Node is correct");
});

test("Node selected correctly by html element", function(a) {
  var sf = new $.jk.SimpleFAQ({node: $('#faq').get(0)});
  a.equal(sf.node.get(0), $('#faq').get(0), "Node is correct");
});

test("Node selected correctly by jQuery element", function(a) {
  var sf = new $.jk.SimpleFAQ({node: $('#faq')});
  a.equal(sf.node.get(0), $('#faq').get(0), "Node is correct");
});

test("Node is given correct class", function(a) {
  var sf = new $.jk.SimpleFAQ({node: '#faq'});
  a.ok($('#faq').hasClass(ns+'_list'), "Node has correct class");
});

test("Custom namespace changes class names", function(a) {
  var sf = new $.jk.SimpleFAQ({node: '#faq', ns: 'foobar'});
  a.ok(sf.node.hasClass('foobar_list'), "Node has correct (custom) class namespace");
});

test("Bad node selector results in empty object", function(a) {
  var sf = new $.jk.SimpleFAQ({node: '#faqWRONG'});
  a.equal(sf.node, null, "Node is null");
});

asyncTest("Init event fires", function(a) {
  $('#faq').bind('init.'+$.jk.SimpleFAQ.prototype.ns, function() {
    a.ok(true, 'Init event was fired');
    var obj = $(this).data($.jk.SimpleFAQ.prototype.ns);
    a.ok((obj instanceof $.jk.SimpleFAQ), "Data object is SimpleFAQ instance");
    a.equal(obj.node.get(0), this, "SimpleFAQ object node is correct");
    start();
  });

  var sf = new $.jk.SimpleFAQ({node: '#faq'});
});

asyncTest("Default Item is showing from hash", function(a) {
  document.location.hash = "faq-1";
  $('#faq').html(htmlManyFAQ);

  $('#faq').bind('show.'+$.jk.SimpleFAQ.prototype.ns, function(e, fn) {
    a.equal($(fn).length, 1, 'FAQ node passed into event handler');
    a.equal($(fn).attr('id'), 'faq-1', 'Correct FAQ node passed into event handler');
    a.ok($(fn).find('.'+$.jk.SimpleFAQ.prototype.answerClass).is(':visible'), "Default FAQ answer is visible");
    start();
  });

  var sf = new $.jk.SimpleFAQ({node: '#faq'});
});

asyncTest("Test jQuery chain node initialization", function(a) {
  
  var fNode = $('#faq');
  fNode.bind('init.'+$.jk.SimpleFAQ.prototype.ns, function(e, obj) {
    a.ok(true, "init event fired");
    a.ok((obj instanceof $.jk.SimpleFAQ), "Object in event data is SimpleFAQ");
    start();
  });

  var chain = fNode.simpleFAQ();
  a.ok(/[0-9]+\.[0-9]+\.[0-9]+/.test(chain.jquery), "Returned value is jQuery wrapper");
  a.equal(chain.length, 1, "jQuery chain has correct number of items in selected elements");
  a.equal(chain.prop('id'), 'faq', "jQuery chain has correct element in selected set");
});


// ------------------------------------------------- //
          module("JSON Data Source Tests", {
// ------------------------------------------------- //
            setup: function() {
              document.location.hash = "";
            },
            teardown: function() {
              document.location.hash = "";  
            }
          });

test("HTML content is added using JSON data", function(a) {
  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    data: jsonData
  });

  var fn = $('#faq');
  var faqs = fn.find(sf.nodeType+'.'+ns+'_item');

  a.equal(faqs.length, jsonData.length, "Correct number of FAQ elements added");
  a.equal(faqs.find('.'+sf.questionClass).length, jsonData.length, "All FAQs have a question");
  a.equal(faqs.find('.'+sf.answerClass).length, jsonData.length, "All FAQs have an answer");
  a.equal(faqs.find('.'+sf.tagClass).length, jsonData.length, "All FAQs have tags");

  for(var i=0, l=faqs.length; i<l; ++i) {
    a.equal($(faqs.get(i)).find('.'+sf.questionClass).text(), jsonData[i].question, "Question "+i+" text correct");
    a.equal($(faqs.get(i)).find('.'+sf.answerClass).text(), jsonData[i].answer, "Answer "+i+" text correct");
    a.equal($(faqs.get(i)).find('.'+sf.tagClass).text(), jsonData[i].tags, "Tag "+i+" text correct");
  }
});

test("HTML content is added using JSON data (one entry)", function(a) {
  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    data: [jsonData[0]]
  });

  var fn = $('#faq');
  var faqs = fn.find(sf.nodeType+'.'+ns+'_item');

  a.equal(faqs.length, 1, "Correct number of FAQ elements added (1)");
  a.equal(faqs.find('.'+sf.questionClass).length, 1, "All FAQs have a question");
  a.equal(faqs.find('.'+sf.answerClass).length, 1, "All FAQs have an answer");
  a.equal(faqs.find('.'+sf.tagClass).length, 1, "All FAQs have tags");

  a.equal($(faqs.get(0)).find('.'+sf.questionClass).text(), jsonData[0].question, "Question 1 text correct");
  a.equal($(faqs.get(0)).find('.'+sf.answerClass).text(), jsonData[0].answer, "Answer 1 text correct");
  a.equal($(faqs.get(0)).find('.'+sf.tagClass).text(), jsonData[0].tags, "Tag 1 text correct");
});

test("HTML content is added using JSON data (no tags)", function(a) {
  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    data: jsonDataNoTags
  });

  var fn = $('#faq');
  var faqs = fn.find(sf.nodeType+'.'+ns+'_item');

  a.equal(faqs.length, jsonDataNoTags.length, "Correct number of FAQ elements added");
  a.equal(faqs.find('.'+sf.tagClass).length, jsonDataNoTags.length, "All FAQs have tags node");

  for(var i=0, l=faqs.length; i<l; ++i) {
    a.equal($(faqs.get(i)).find('.'+sf.tagClass).text(), "", "Tag "+i+" text correct (blank)");
  }
});

test("Change FAQ nodeType with JSON data", function(a) {
  var sf = new $.jk.SimpleFAQ({
    node: '#divFaq',
    data: jsonData,
    nodeType: "div"
  });

  a.equal($('#divFaq div.'+ns+'_item').length, jsonData.length, "Correct number of FAQ elements added");
});

test("Change FAQ questionClass with JSON data", function(a) {
  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    data: jsonData,
    questionClass: 'faqqle'
  });

  a.equal($('#faq').find('.faqqle').length, jsonData.length, "All FAQs have a question with correct class");
});

test("Change FAQ answerClass with JSON data", function(a) {
  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    data: jsonData,
    answerClass: 'fanswer'
  });

  a.equal($('#faq').find('.fanswer').length, jsonData.length, "All FAQs have an answer with correct class");
});

test("Change FAQ tagClass with JSON data", function(a) {
  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    data: jsonData,
    tagClass: 'taggle'
  });

  a.equal($('#faq').find('.taggle').length, jsonData.length, "All FAQs have tags with correct class");
});


// ------------------------------------------------- //
        module("FAQ UI Tests (HTML Source)", {
// ------------------------------------------------- //
          setup: function() {
            document.location.hash = "";
          },
          teardown: function() {
            document.location.hash = "";  
          }
        });

test("FAQ nodes cached", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({node: '#faq'});

  a.ok(sf.faqNodes, "FAQ nodes cached");
  a.equal(sf.faqNodes.length, numFaqs, "Correct number of FAQs cached");
  a.equal(sf.node.find('.'+sf.answerClass+':visible').length, 0, "No answers showing at start");
});

test("Hover events", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({node: '#faq'});

  var f1 = sf.node.find(sf.nodeType+':first .'+sf.questionClass);
  f1.trigger('mouseover');
  a.ok(f1.hasClass(sf.ns+'Hover'), "Hovered FAQ node has correct class");
  f1.trigger('mouseout');
  a.ok(!f1.hasClass(sf.ns+'Hover'), "Unhovered FAQ node does not have hover class");
});

asyncTest("Toggling of FAQ", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({node: '#faq'});

  var f1 = sf.node.find(sf.nodeType+':first');
  var eventFired = false;
  sf.node.bind('show.'+sf.ns, function(e, n) {
    eventFired = true;
    a.equal(n, f1.get(0));
  });
  sf.toggleFaq(f1, function() {
    a.ok(f1.hasClass(sf.ns+'Showing'), "Toggled FAQ node has correct class");
    a.ok(f1.find('.'+sf.answerClass).is(':visible'), "Toggled FAQ node is visible");
    a.equal('#'+f1[0].id, document.location.hash, "document hash has been changed");
    a.ok(eventFired, "show event was fired correctly");
    start();
  });
});

asyncTest("Toggling of FAQ - no change hash", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    changeHash: false
  });

  sf.toggleFaq(sf.node.find(sf.nodeType+':first'), function() {
    a.equal(document.location.hash, '', "document hash has NOT been changed (correct)");
    start();
  });
});

asyncTest("Toggling of FAQ - none provided", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({node: '#faq'});

  var f1 = sf.node.find(sf.nodeType+':first');
  var eventFired = false;
  sf.node.bind('show.'+sf.ns, function(e, n) {
    eventFired = true;
    a.equal(n, f1.get(0));
  });
  sf.toggleFaq(null, function() {
    a.ok(f1.hasClass(sf.ns+'Showing'), "Toggled FAQ node has correct class");
    a.ok(f1.find('.'+sf.answerClass).is(':visible'), "Toggled FAQ node is visible");
    a.equal('#'+f1[0].id, document.location.hash, "document hash has been changed");
    a.ok(eventFired, "show event was fired correctly");
    start();
  });
});

asyncTest("Hide All - one showing - no exceptions", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({node: '#faq'});

  sf.node.find(sf.nodeType+':last .'+sf.answerClass).show();

  sf.hideAll(null, function() {
    a.equal(sf.node.find('.'+sf.answerClass+':visible').length, 0, "All answers are hidden");
    start();
  });
});

asyncTest("Hide All - all showing - no exceptions", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({node: '#faq'});

  // setup
  var hideEvents = 0;
  sf.node
    .bind('hide.'+sf.ns, function(e, faq) {
      if ($(faq).hasClass(sf.ns+'_item')) {
        hideEvents++;
      }
    })
    // manually show all answers
    .find(sf.nodeType)
      .addClass(sf.ns+'Showing')
        .find('.'+sf.answerClass)
          .show();

  sf.hideAll(null, function() {
    a.equal(sf.node.find('.'+sf.answerClass+':visible').length, 0, "All answers are hidden");
    sf.faqNodes.each(function() {
      a.ok(!$(this).hasClass(sf.ns+'Showing'), "No FAQs have Showing class");
    });
    a.equal(hideEvents, sf.faqNodes.length, "Hide event fired for all FAQs");
    start();
  });
});

asyncTest("Hide All - all showing - with exception", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({node: '#faq'});

  sf.node.find(sf.nodeType+' .'+sf.answerClass).show();

  sf.hideAll(sf.node.find(sf.nodeType+':first'), function() {
    a.equal(sf.node.find('.'+sf.answerClass+':visible').length, 1, "All answers are hidden but exception");
    a.equal(sf.node.find('.'+sf.answerClass+':visible').get(0), sf.node.find(sf.nodeType+':first .'+sf.answerClass).get(0), "Exception answer is NOT hidden");
    start();
  });
});

asyncTest("Click event - none showing", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({node: '#faq'});

  // setup
  sf.node
    .bind('hide.'+sf.ns, function(e, faq) {
      a.ok(false, "No hide events should fire!");
    })
    .bind('show.'+sf.ns, function(e, faq) {
      a.equal(sf.faqNodes.get(1), faq, "Correct FAQ node passed to show event");
      var vis = sf.node.find('.'+sf.answerClass+':visible');
      a.equal(vis.length, 1, "Only one FAQ visible");
      a.equal(vis.get(0), $(faq).find('.'+sf.answerClass).get(0), "Correct FAQ node is visible");
      start();
    });

  sf.faqNodes.filter(':eq(1)').find('.'+sf.questionClass).click();
});

asyncTest("Click event - one already showing (show one)", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    showOnlyOne: true
  });

  sf.faqNodes.filter(':first').addClass(sf.ns+'Showing').find('.'+sf.answerClass).show();

  // setup
  sf.node
    .bind('hide.'+sf.ns, function(e, faq) {
      a.equal(sf.faqNodes.get(0), faq, "Correct FAQ node passed to hide event");
      a.ok(!sf.faqNodes.filter(':first').hasClass(sf.ns+'Showing'), "Showing class removed from previous node");
      a.ok(!sf.faqNodes.filter(':first').find('.'+sf.answerClass).is(':visible'), "Showing class removed from previous node");
    })
    .bind('show.'+sf.ns, function(e, faq) {
      a.equal(sf.faqNodes.get(1), faq, "Correct FAQ node passed to show event");
      var vis = sf.node.find('.'+sf.answerClass+':visible');
      a.equal(vis.length, 1, "Only one FAQ visible");
      a.equal(vis.get(0), $(faq).find('.'+sf.answerClass).get(0), "Correct FAQ node is visible");
      start();
    });

  sf.faqNodes.filter(':eq(1)').find('.'+sf.questionClass).click();
});

asyncTest("Click event - one already showing (show more than one)", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    showOnlyOne: false
  });

  sf.faqNodes.filter(':first').addClass(sf.ns+'Showing').find('.'+sf.answerClass).show();

  // setup
  sf.node
    .bind('hide.'+sf.ns, function(e, faq) {
      a.ok(false, "No hide events should fire!");
    })
    .bind('show.'+sf.ns, function(e, faq) {
      a.equal(sf.faqNodes.get(1), faq, "Correct FAQ node passed to show event");
      var vis = sf.node.find('.'+sf.answerClass+':visible');
      a.equal(vis.length, 2, "Two FAQs visible");
      a.equal(vis.get(0), sf.faqNodes.filter(':first').find('.'+sf.answerClass).get(0), "Previous shown FAQ node is visible");
      a.equal(vis.get(1), $(faq).find('.'+sf.answerClass).get(0), "Newly shown FAQ node is visible");
      start();
    });

  sf.faqNodes.filter(':eq(1)').find('.'+sf.questionClass).click();
});


// ------------------------------------------------- //
        module("Search Tests", {
// ------------------------------------------------- //
          setup: function() {
            document.location.hash = "";
          },
          teardown: function() {
            document.location.hash = "";  
          }
        });

test("Search UI added", function(a) {
  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    allowSearch: true,
    searchNode: '#faqSearch'
  });

  a.ok($('#faqSearch').hasClass(sf.ns+'Search'), "Search input has correct class");
  a.equal(sf.score, $.score, "Score function is set to Quicksilver");
});

test("Search UI - no node given", function(a) {
  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    allowSearch: true
  });

  a.equal(sf.allowSearch, false, "allowSearch is reset to false");
  a.equal(sf.searchNode, null, "searchNode is set to null");
  a.ok(!$('#faqSearch').hasClass(sf.ns+'Search'), "Search input not used");
});

test("Search UI - bad node given", function(a) {
  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    allowSearch: true,
    searchNode: '#foobarbatbaz'
  });

  a.equal(sf.allowSearch, false, "allowSearch is reset to false");
  a.equal(sf.searchNode, null, "searchNode is set to null");
  a.ok(!$('#faqSearch').hasClass(sf.ns+'Search'), "Search input not used");
});

test("ScoreTags tests - basic", function(a) {
  var sf = new $.jk.SimpleFAQ();

  a.equal(sf.scoreTags("", ["search"]), 0, "score for no tags is zero");
  a.equal(sf.scoreTags("foobar search", []), 0, "score for no search is zero");
  a.equal(sf.scoreTags("foo, bar,batzy", ["search"]), 0, "score for none matching tags is zero");
  a.equal(sf.scoreTags("search", ["search"]), sf.exactTagScore, "exact match score correct");
  a.equal(sf.scoreTags("  search  ", ["search"]), sf.exactTagScore, "exact match score correct - whitespace");
  a.equal(sf.scoreTags(",search,", ["search"]), sf.exactTagScore, "exact match score correct - punctuation");
  a.equal(sf.scoreTags(";search,", ["search"]), sf.exactTagScore, "exact match score correct - mixed punctuation");
  a.equal(sf.scoreTags("search,search", ["search"]), sf.exactTagScore, "exact match score correct - double - punctuation");
  a.equal(sf.scoreTags("search , search ", ["search"]), sf.exactTagScore, "exact match score correct - double - punctuation - whitespace");
  a.equal(sf.scoreTags("search,foobar", ["search"]), sf.exactTagScore, "exact match score correct - extra tags after");
  a.equal(sf.scoreTags("foobar, search", ["search"]), sf.exactTagScore, "exact match score correct - extra tags before");
  a.equal(sf.scoreTags("foobar, search,foobar", ["search"]), sf.exactTagScore, "exact match score correct - extra tags around");
  a.equal(sf.scoreTags("search,foobar", ["search", "foobar"]), (sf.exactTagScore * 2), "exact match score correct - multiple");
  a.equal(sf.scoreTags("batz,search,google,foobar, ", ["search", "foobar"]), (sf.exactTagScore * 2), "exact match score correct - multiple - extra tags");
  a.equal(sf.scoreTags("search", ["sea"]), sf.partialTagScore, "partial match score correct");
  a.equal(sf.scoreTags(" , ,search , ", ["sea"]), sf.partialTagScore, "partial match score correct - punctuation - whitespace");
  a.equal(sf.scoreTags("foobar search batzy", ["sea"]), sf.partialTagScore, "partial match score correct - extra tags");
  a.equal(sf.scoreTags("foobar , search, batzy,", ["sea"]), sf.partialTagScore, "partial match score correct - extra tags - punctuation - whitespace");
  a.equal(sf.scoreTags("foobar , search, batzy,", ["bat", "sea"]), (sf.partialTagScore * 2), "double partial match score correct - extra tags - punctuation - whitespace");
  a.equal(sf.scoreTags("batzy, foobar, google search, bloop", ["google", "sea"]), (sf.exactTagScore + sf.partialTagScore), "exact and partial match score correct (mixed)");
});

test("ScoreTags tests - score value change", function(a) {
  var sf = new $.jk.SimpleFAQ({exactTagScore: 0.5, partialTagScore: 0.3});

  a.equal(sf.scoreTags("search", ["search"]), 0.5, "custom exactTagScore is correct");
  a.equal(sf.scoreTags("search", ["sea"]), 0.3, "custom partialTagScore is correct");
});

test("ScoreTags tests - case sensitive", function(a) {
  var sf = new $.jk.SimpleFAQ({caseSensitive: true});

  a.equal(sf.scoreTags("Search", ["search"]), 0, "case sensitive mismatch gives zero score");
  a.equal(sf.scoreTags("Search", ["Search"]), sf.exactTagScore, "case sensitive match gives correct score");
  a.equal(sf.scoreTags("seaRch", ["seaRch"]), sf.exactTagScore, "case sensitive match gives correct score - middle letter case");
});

test("doScoring - basic", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    allowSearch: true,
    searchNode: '#faqSearch'
  });
  
  var getScoreForNode = function(res, nodeId) {
    var s = null;
    for (var i=0, l=res.length; i<l; ++i) {
      if (res[i][1].prop('id') == nodeId) {
        s = res[i][0];
      }
    }
    return s;
  };
  
  a.deepEqual(sf.doScoring(""), [], "Empty search string returns no results");
  a.deepEqual(sf.doScoring("faq1"), [], "Tag only search below threshold is not returned");

  a.equal(getScoreForNode(sf.doScoring("one"), "faq-1"), 1.0619999999999998, "Single word search returns correct score");
  a.equal(getScoreForNode(sf.doScoring("one faq1"), "faq-1"), 1.262, "Multi word search returns correct score");
});

test("doScoring - minSearchScore", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    allowSearch: true,
    searchNode: '#faqSearch',
    minSearchScore: 1.1
  });

  a.equal(sf.doScoring("one faq1").length, 1, "Specific search yields correct number of results");
  a.equal(sf.doScoring("one").length, 0, "Good search below threshold yields no results");
});

test("doScoring - case sensitive", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    allowSearch: true,
    searchNode: '#faqSearch',
    caseSensitive: true,
    minSearchScore: 0.8
  });

  a.equal(sf.doScoring("one").length, 1, "Correct case yields correct results");
  a.equal(sf.doScoring("One").length, 0, "Incorrect case yields no results");
});

test("handleSearchKey - no input", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    allowSearch: true,
    searchNode: '#faqSearch'
  });

  a.deepEqual(sf.handleSearchKey(""), [], "empty result array returned on no input");
  a.equal(sf.faqNodes.filter(':visible').length, 10, "All FAQs showing");
  a.equal($('.'+sf.ns+'Result').length, 0, "No FAQs have Result class");
  a.equal($('.'+sf.ns+'Showing').length, 0, "No FAQs have Showing class");
  a.equal(sf.faqNodes.filter('.'+sf.answerClass+':visible').length, 0, "No FAQ answers showing");
});

asyncTest("handleSearchKey - basic search", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    allowSearch: true,
    searchNode: '#faqSearch',
    minSearchScore: 0.8
  });

  var startFired = 0;
  sf.node.bind('searchStart.'+sf.ns, function() {
    startFired++;
  });
  sf.node.bind('searchEnd.'+sf.ns, function(e, d) {
    a.ok(true, "searchEnd fires correctly");
    a.equal(startFired, 1, "searchStart fired once (and only once)");
    a.deepEqual(d.length, 1, "searchEnd is passed correct result array");
    a.ok($('#faq-1').hasClass(sf.ns+'Result'), "FAQ result has correct class");
    a.ok($('#faq-1').is(':visible'), "correct FAQ result is visible");
    a.equal(sf.faqNodes.filter(':not(:visible)').length, 9, "All other FAQs are hidden");
    start();
  });

  a.notEqual(sf.handleSearchKey("one"), null, "timeout handle returned correctly");
});

test("handleSearchKey - hide previous results", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    allowSearch: true,
    searchNode: '#faqSearch',
    minSearchScore: 0.8
  });

  // set up our "previous results" environment
  sf.faqNodes.hide();
  $('#faq-3').addClass(sf.ns+'Result').show();
  $('#faq-4').addClass(sf.ns+'Result').show();
  $('#faq-5').addClass(sf.ns+'Result').show();

  var res = sf.handleSearchKey("one");

  a.equal(res.length, 1, "result array has correct number of results");
  a.equal($('.'+sf.ns+'Result').length, 1, "only one FAQ has result class");
  a.ok($('#faq-1').hasClass(sf.ns+'Result'), "FAQ result has correct class");
  a.ok($('#faq-1').is(':visible'), "correct FAQ result is visible");
  a.equal(sf.faqNodes.filter(':not(:visible)').length, 9, "All other FAQs are hidden");
});

test("handleSearchKey - show all on empty", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    allowSearch: true,
    searchNode: '#faqSearch',
    showAllOnEmpty: true
  });

  sf.handleSearchKey("");
  a.equal(sf.faqNodes.filter(':visible').length, 10, "All FAQs visible on empty search with setting");
  a.equal(sf.faqNodes.filter('.'+sf.ns+'Showing').length, 0, "No FAQs have 'Showing' class on empty search");
  a.equal(sf.faqNodes.filter('.'+sf.ns+'Result').length, 0, "No FAQs have 'Result' class on empty search");
});


test("handleSearchKey - sorting", function(a) {
  $('#faq').html(htmlManyFAQ);

  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    allowSearch: true,
    searchNode: '#faqSearch',
    sortSearch: true
  });

  var     res = sf.handleSearchKey("one tag"),
      inOrder = true,
         prev = 0;
  for (var i=res.length; i; --i) {
    if (res[i-1][0] < prev) {
      inOrder = false;
      break;
    }
    prev = res[i-1][0];
  }

  a.equal(res.length, 10, "correct numnber of results");
  a.ok(inOrder, "Results are in correct score order");
});

test("handleSearchKey - custom score function", function(a) {
  $('#faq').html(htmlManyFAQ);

  var tokenScore = 0.99;
  var staticScore = function() { return tokenScore; };

  var sf = new $.jk.SimpleFAQ({
    node: '#faq',
    allowSearch: true,
    searchNode: '#faqSearch',
    score: staticScore
  });

  a.equal(sf.score, staticScore, "Score function is correct");

  res = sf.handleSearchKey("foobar bat baz");

  a.equal(res.length, 10, "Correct numner of FAQs in results");

  for (var i=0, l=res.length; i<l; ++i) {
    a.equal(res[i][0], (tokenScore * 3), "FAQ-"+(i+1)+" score is correct");
  }
});
