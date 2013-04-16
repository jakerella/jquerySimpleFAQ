jquerySimpleFAQ
===============

Simple jQuery plugin for creating FAQ interfaces

Features
--------

TODO: add the real ones

* __Simple to Use:__ This CAPTCHA implementation is easy to use by both the developer and the user!


Basic Usage
-----------

With an HTML data source:
```html
<div id='faqSearch'></div>
<ul id='faqs'>
  <li>
    <p class='question'>This is a question?</p>
    <div class='answer'>This is the answer.</div>
    <p class='tags'>tags, help, searching</p>
  </li>
  ...
</ul>
```

```javascript
$('#faqs').simpleFAQ(); // Most simple form (all default options)
```

When using the 'data' option:

```html
<div id='faqSearch'></div>
<ul id='faqs'></ul>
```

```javascript
$('#faqs').simpleFAQ({
  data: [
    {
      question: "This is a question?",
      answer: "This is the answer",
      tags: "tags, help, searching" // OPTIONAL
    },
    ...
  ]
});
```

Events
------

TODO: reformat these (and add more?)

* _init.simpleCaptcha_: The basic UI container, form element and event handlers have been added to the page. Note that at this point the captcha images, hashes, and answer text will NOT have been laoded, see the "dataload" and ready" events below. You should only ever receive ONE of these events per page load. _(Arguments: `captcha` (`SimpleCaptcha` object))_

If you want to know when the results are sorted, bind to the "sort.simpleFAQ" event on the list. The second argument to the handler will be an array of the (sorted) result nodes.
If you want to know when a result is shown (expanded), bind to the "show.simpleFAQ" event on the list. The second argument to the handler will be the node that was shown (expanded).
If you want to know when a search is initiated, bind to the "searchStart.simpleFAQ" event on the list.
You can also bind to the "searchEnd.simpleFAQ" event to be notified when the search is completed. This event is fired in parallel with "sort.simpleFAQ", so you will get both events. The second argument to the handler will be an array of the (sorted) result nodes.

Event Example
-------------

```javascript
$('#faqs').bind('sort.simpleFAQ', function(jQEvent, results) {
  if (results.length > 0) {
    // do something
  }
});
```

Options
-------

TODO: reformat these

* _allowRefresh_: Whether the user should see a UI element allowing them to refresh the captcha choices _(default: `true`)_

data: null,                // Array If provided, this data is used as the FAQ data with each array entry being an object with 'question', 'answer', and 'tags' properties, this will be used to build the list
nodeType: 'li',            // String The type of node to look for (and use) for FAQs
questionClass: 'question', // String The class that all questions will have (either you have to give them this class, or use the plugin to build the list)
answerClass: 'answer',     // String The class that all answers will have (either you have to give them this class, or use the plugin to build the list)
tagClass: 'tags',          // String The class for a node in the answer that contains tags specific to each answer. If this exists, it boosts the score for search terms that are in the tags
showOnlyOne: true,         // Boolean If true, only one answer will be visible at a time
allowSearch: true,         // Boolean If true, adds a search box (must provide searchNode)
searchNode: '#faqSearch',  // jQ Node  Only required if allowSearch is true; it is the container for the search box (should be a node, the jQuery object, or a selector)
minSearchScore: 0.5,       // Number The minimum score a FAQ must have in order to appear in search results. Should be a number between 0 and 1 (Quicksilver score)
sortSearch: true,          // Boolean Whether or not to sort search results
speed: 500                 // Number or String The speed to open and close FAQ answers. String values must be one of the three predefined speeds: "slow", "normal", or "fast"; numeric values are the number of milliseconds to run the animation (e.g. 1000).
ignore: ['the', 'a', ...]  // Array A list of words to ignore when searching

