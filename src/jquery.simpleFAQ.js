/* Copyright (c) 2008 Jordan Kasper
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * Copyright notice and license must remain intact for legal use
 * Requires: jQuery 1.2+
 *           jQuery.quicksilver
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS 
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * For more usage documentation and examples, visit:
 *  https://github.com/jakerella/jquerySimpleFAQ
 *  
 */
;(function($) {
  
  // ----------- Public methods ----------- //
  
  $.fn.simpleFAQ = function(o) {
    var n = this;
    if (n.length != 1) { return n; }
    n.addClass('simpleFAQList');
    
    // Set up options (and defaults)
    o = (o)?o:{};
    o = audit($.extend({}, $.fn.simpleFAQ.defaults, o));
    
    // Make sure node has an ID
    if (n.attr('id').length < 1) {
      n.attr('id', 'simpleFAQ_'+Math.floor(Math.random() * 1000));
    }
    
    var qc = o.questionClass;
    var ac = o.answerClass;
    var nt = o.nodeType;
    
    // Are we building the FAQs from data? (audited above)
    if (o.data != null) {
      var d = o.data;
      n.html('');
      for (var i=0, l=d.length; i<l; ++i) {
        n.append(
          "<"+nt+" class='simpleFAQ'>"+
          " <p class='"+qc+"'>"+d[i].question+"</p>"+
          " <div class='"+ac+"'>"+
          d[i].answer+
          "<p class='"+o.tagClass+"'>"+d[i].tags+"</p>"+
          "</div>"+
          "</"+nt+">"
        );
      }
    }
    
    // Cache all FAQ nodes (only first children)
    var faqs = $('#'+n.attr('id')+' > '+nt);
    
    // Show answers when question clicked
    faqs
      .find('.'+qc)
        .css('cursor', 'pointer')
        .hover(
          function () { $(this).addClass('simpleFAQHover'); },
          function() { $(this).removeClass('simpleFAQHover'); }
        )
        .bind('click.simpleFAQ', function(e) {
          var f = $(this).parent();
          if (o.showOnlyOne) {
            // Hide all others
            n.find(nt)
              .not(f)
                .find('.'+ac)
                  .slideUp(o.speed, function() {
                    $(this).parent()
                      .removeClass('simpleFAQShowing');
                  });
          }
          $(this)
            .siblings('.'+ac)
              .slideToggle(o.speed, function() {
                if ($(this).is(':visible')) {
                  f.addClass('simpleFAQShowing');
                  var h = f.attr('id');
                  if (h && h.length > 0) {
                    document.location.hash = escape(h);
                  }
                  n.trigger('show.simpleFAQ', [f[0]]);
                } else {
                  f.removeClass('simpleFAQShowing');
                }
              });
        });
    
    // Hide all answers by default
    faqs.find('.'+ac).hide();
    
    // Searching is enabled
    if (o.allowSearch) {
      // Helper for hiding FAQs when not in search results
      var hideFAQ = function(node) {
        $(node)
          .hide()
          .removeClass('simpleFAQResult')
          .find('.'+ac)
            .hide()
            .parent()
              .removeClass('simpleFAQShowing');
      }
      
      // create input node
      var sn = $(o.searchNode);
      if (sn.length > 0 && typeof $.score == 'function') {
        // Hide all FAQs, they'll be shown when found in a search
        hideFAQ(n.find(nt));
        
        var h;
        sn
          .append("<input type='text' id='simpleFAQSearch' />")
          .find('#simpleFAQSearch')
            .keyup(function(e) {
              clearTimeout(h);
              var sn = this;
              if (sn.value.length < 1) {
                hideFAQ(n.find(nt));
                return;
              }
              
              // add a slight delay to wait for more input
              h = setTimeout(function() {
                n.trigger('searchStart.simpleFAQ', []);
                // Score the input
                var sc = [];
                faqs.each(function(i) {
                  var f = $(this);
                  var tg = f.find('.'+o.tagClass).text();
                  tg = (o.caseSensitive)?tg:tg.toLowerCase();
                  var t = f.text();
                  t = (o.caseSensitive)?t:t.toLowerCase();
                  var q = getQuery(sn.value, o);
                  var s = 0;
                  
                  if (q.length > 0) {
                    s = $.score(t, q);
                    s += scoreTags(q, tg);
                  }
                  if (s > o.minSearchScore) {
                    sc.push([s, f]);
                  } else {
                    hideFAQ($(this));
                  }
                });
                
                if (o.sortSearch) {
                  // Sort results
                  sc.sort(function(a, b){
                    return b[0] - a[0];
                  });
                }
                
                // Show the relevant questions
                var r = [];
                $.each(sc, function() {
                  n.append(this[1].show().addClass('simpleFAQResult'));
                  r.push(this[1][0]);
                });
                
                n.trigger('sort.simpleFAQ', [r]);
                n.trigger('searchEnd.simpleFAQ', [r]);
                
              }, $.fn.simpleFAQ.keyTimeout);
            });
      }
    }
    
    var scoreTags = function(t, tags) {
      var s = 0;
      if (tags.length < 1) { return s; }
      var w = t.split(' ');
      for (var i=0, l=w.length; i<l; ++i) {
        if (w[i].length < 1) { continue; }
        if (tags.indexOf(w[i]) > -1) {
          s += $.fn.simpleFAQ.tagMatchScore;
        }
      }
      return s;
    }
    
    var getQuery = function(t, o) {
      var q = '';
      t = (o.caseSensitive)?t:t.toLowerCase();
      var ig = o.ignore;
      if (ig.length > 0) {
        var w = t.split(' ');
        for (var i=0; i<w.length; ++i) {
          if (w[i].length > 0) {
            if (typeof ig.indexOf == 'function') {
              if (ig.indexOf(w[i]) < 0) {
                q += w[i] + ' ';
              }
            } else {
              var f = false;
              for (var j=0; j<ig.length; ++j) {
                if (ig[j] == w[i]) {
                  f = true;
                  break;
                }
              }
              if (!f) { q += w[i] + ' '; }
            }
          }
        }
        if (q.length > 0) { q = q.substr(0, q.length-1); }
      } else {
        q = t;
      }
      return q;
    }
    
    // See if we have a starting FAQ and show it
    var h = document.location.hash;
    if (h && h.length > 0) {
      var fn = $(h);
      if (fn && fn.is('.simpleFAQList>*')) {
        fn.find('.'+qc).trigger('click.simpleFAQ');
      }
    }
    
    // Return original chain of nodes to continue jQuery chain
    return n;
  };
  
  // Defined outside simpleFAQ to allow for usage during construction
  var audit = function(o) {
    var d = o.data;
    if (!d || !d.length || typeof d.splice != 'function') {
      o.data = $.fn.simpleFAQ.defaults.data;
    }
    if (typeof o.nodeType != 'string') { o.nodeType = $.fn.simpleFAQ.defaults.nodeType; }
    if (typeof o.questionClass != 'string') { o.questionClass = $.fn.simpleFAQ.defaults.questionClass; }
    if (typeof o.answerClass != 'string') { o.answerClass = $.fn.simpleFAQ.defaults.answerClass; }
    if (typeof o.tagClass != 'string') { o.tagClass = $.fn.simpleFAQ.defaults.tagClass; }
    
    if (typeof o.showOnlyOne != 'boolean') { o.showOnlyOne = $.fn.simpleFAQ.defaults.showOnlyOne; }
    if (typeof o.allowSearch != 'boolean') { o.allowSearch = $.fn.simpleFAQ.defaults.allowSearch; }
    if (typeof o.minSearchScore != 'number') { o.minSearchScore = $.fn.simpleFAQ.defaults.minSearchScore; }
    if (typeof o.sortSearch != 'boolean') { o.sortSearch = $.fn.simpleFAQ.defaults.sortSearch; }
    if (typeof o.caseSensitive != 'boolean') { o.caseSensitive = $.fn.simpleFAQ.defaults.caseSensitive; }
    if (typeof o.speed != 'number') { o.speed = $.fn.simpleFAQ.defaults.speed; }
    
    var ig = o.ignore;
    if (!ig || !ig.length || typeof ig.splice != 'function') {
      o.ignore = $.fn.simpleFAQ.defaults.ignore;
    }
    
    return o;
  }
  
  
  // ----------- Static properties ----------- //
  
  $.fn.simpleFAQ.keyTimeout = 400;
  $.fn.simpleFAQ.tagMatchScore = 0.1;
  
  // options for simpleFAQ instances...
  $.fn.simpleFAQ.defaults = {
    data: null,                // Array If provided, this data is used as the FAQ data with each array entry being an object with 'question', 'answer', and 'tags' properties, this will be used to build the list
    nodeType: 'li',            // String The type of node to look for (and use) for FAQs
    questionClass: 'question', // String The class that all questions will have (either you have to give them this class, or use the plugin to build the list)
    answerClass: 'answer',     // String The class that all answers will have (either you have to give them this class, or use the plugin to build the list)
    tagClass: 'tags',          // String The class for a node in the answer that contains tags specific to each answer. If this exists, it boosts the score for search terms that are in the tags
    showOnlyOne: false,        // Boolean If true, only one answer will be visible at a time
    allowSearch: false,        // Boolean If true, adds a search box (must provide searchNode)
    searchNode: null,          // jQ Node  Only required if allowSearch is true; it is the container for the search box (should be a node, the jQuery object, or a selector)
    minSearchScore: 0,         // Number The minimum score a FAQ must have in order to appear in search results. Should be a number between 0 and 1 (Quicksilver score)
    sortSearch: false,         // Boolean Whether or not to sort search results
    caseSensitive: false,      // boolean Whether or not the search is case sensitive
    speed: 500,                // Number or String The speed to open and close FAQ answers. String values must be one of the three predefined speeds: "slow", "normal", or "fast"; numeric values are the number of milliseconds to run the animation (e.g. 1000).
    ignore: ['the', 'a', 'an', 'i', 'we', 'you', 'it', 'that', 'those', 'these', 'them', 'to', 'and', 'or', 'as', 'at', 'by', 'for', 'of', 'so']
                                // Array A list of words to ignore when searching
  };

})(jQuery);
