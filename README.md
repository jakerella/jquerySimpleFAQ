jquerySimpleFAQ
===============

Simple jQuery plugin for creating FAQ interfaces

Features
--------

* __Simple to use.__ Use existing HTML data (ul > li) for source or use a JSON data array
* __Lots of options, but none required.__
* __Fast live searching using Quicksilver, including relevancy sorting (optionally).__
* __Add tags to FAQs to increase relevancy of searching.__
* __Events triggered for extra preocess handling if necessary.__


Basic Usage
-----------

With an HTML data source:
```html
<ul id='faqs'>
  <li>
    <!-- Note that you MUST have the "question", "answer", and "tags" classes on these nodes -->
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

When using the 'data' option (JSON) and searching:

```html
<div><input type='text' id='faqSearch' /></div>
<ul id='faqs'></ul>
```

```javascript
$('#faqs').simpleFAQ({
  data: [
    {
      question: "This is a question?",
      answer: "This is the answer.",
      tags: "tags, help, searching" // OPTIONAL, useful for search scoring (and displaying if you wish)
    },
    ...
  ],
  allowSearch: true,
  searchNode: '#faqSearch'
});
```

See more examples at: http://jordankasper.com/jquery/faq/examples.php

Events
------

* _init.simpleFAQ_: The basic UI container and event handlers have been added to the document (or have been updated). You should only ever receive ONE of these events per page load. _(Arguments: event, `$.jk.SimpleFAQ` object)_
* _show.simpleFAQ_: Fired when an individual FAQ answer is shown. (Note: when searching for results, this will NOT fire when the FAQ is shown, only when the ANSWER is shown.) _(Arguments: event, `HTMLElement` faq)_
* _hide.simpleFAQ_: Fired when an individual FAQ answer is hidden (either explicitly by the user, or because another FAQ was shown and the `showOnlyOne` option is `true`. (Note: when searching for results, this will NOT fire when the FAQ is hidden because it is not in the result set, only when the ANSWER is hidden after being shown.) _(Arguments: event, `HTMLElement` faq)_
* _searchStart.simpleFAQ_: Fires when the user initiates a search. _(Arguments: event)_
* _searchEnd.simpleFAQ_: Fired after a search sction is complete (all results will be showing at this point). _(Arguments: event, array scores (NOTE: format will be: [ [score, faqNode], ...] ))_
* _sort.simpleFAQ_: Fired when the results of a search are sorted. _(Arguments: event, array scores (NOTE: format will be: [ [score, faqNode], ...] ))_


Event Example
-------------

```javascript
$('#faqs').bind('searchEnd.simpleFAQ', function(jQEvent, results) {
  if (results.length < 1) {
    // do something when there are no results?
  }
});
```

Options
-------

* _node_: `selector | HTMLElement | jQuery object` The node (or selector) to use for the FAQ UI. If not set, the current node selected by $(...).simpleFAQ(); will be used. _(default: `null`)_
* _data_: `array` The JSON data to use for the FAQs (will be added to any HTML FAQs). Format: `[ { question: "...", answer: "...", tags: "multiple, tags" /* OPTIONAL */ } ]` _(default: `null`)_
* _ns_: `string` Used before all assigned classes and as an event namespace. _(default: `"simpleFAQ"`)_
* _nodeType_: `string` The type of node to look for (or use with JSON data) for FAQs. _(default: `"li"`)_
* _questionClass_: `string` The class that all questions will have (either you have to give them this class, or use the plugin to build the list). _(default: `"question"`)_
* _answerClass_: `string` The class that all answers will have (either you have to give them this class, or use the plugin to build the list). _(default: `"answer"`)_
* _tagClass_: `string` The class for a node in the answer that contains tags specific to each answer. If this exists, it boosts the score for search terms that are in the tags. _(default: `"tags"`)_
* _showOnlyOne_: `boolean` If true, only one answer will be visible at a time (accordion style). _(default: `false`)_
* _changeHash_: `boolean` If true, the URL hash will be changed on each FAQ toggle, thus allowing for linking directly to a specific FAQ. _(default: `true`)_
* _slideSpeed_: `number | string` The speed to open and close FAQ answers. String values must be one of the three predefined speeds: "slow", "normal", or "fast"; numeric values are the number of milliseconds to run the animation (e.g. 1000). _(default: `500`)_

_Search Options_

* _allowSearch_: `boolean` If true, adds searching ability (must provide searchNode) _(default: `false`)_
* _searchNode_: `selector | HTMLElement | jQuery object` Only required if `allowSearch` is `true`; it is the element used for search input. NOTE: we use the `keyup` event, so this should be something that will emit that event correctly and can have a `value`! (Can be a node, jQuery object, or selector.) _(default: `null`)_
* _minSearchScore_: `number` The minimum score a FAQ must have in order to appear in search results. Depends on what search function youa re using, but quicksilver returns scores between 0 and 1 (although the final score can be more than 1 based on tag scoring). _(default: `0.5`)_
* _sortSearch_: `boolean` Whether or not to sort search results by score (descending). _(default: `false`)_
* _showAllOnEmpty_: `boolean` Should the plugin show all FAQs when there is no search input? _(default: `true`)_
* _caseSensitive_: `boolean` Whether or not the search is case sensitive. _(default: `false`)_
* _keyTimeout_: `number` A number of milliseconds to wait after a keyup event before initiating a search. Allows for better efficiency as a person is typing (live search principle). _(default: `400`)_
* _partialTagScore_: `number` What to increase the match score by when partial tags are matched (such as "sim" -> "simple") _(default: `0.1`)_
* _exactTagScore_: `number` What to increase the match score by when an exact tag is matched (such as "simple" -> "simple") _(default: `0.2`)_
* _score_: `function` A function used to score FAQ question and answer text (not tags). Should accept the full text and a single search token and return the score (generally a decimal number between 0 and 1, but this is up to you). _(default: `$.score` (Quicksilver scoring function))_
