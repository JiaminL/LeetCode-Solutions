(function (window) {
  "use strict";

  // Setup "globals"
  const document = window.document;
  const console = window.console;
  const $ = window.jQuery;

  // LeetCode page writes to URL, have to restore it with trick
  // http://perrymitchell.net/article/restoring-overridden-window-and-document-methods-with-archetype/
  const URL = (function (document) {
    let iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    let URL = iframe.contentWindow.URL;
    return URL;
  })(document);

  // Load dependencies
  if (typeof saveAs === "undefined") {
    $.getScript("https://cdn.jsdelivr.net/g/filesaver.js");
  }

  const URL_GraphQL = "https://leetcode.com/graphql"

  const queryGraphQL = function (operationName, variables, query) {
    return $.post({
      url: URL_GraphQL,
      data: JSON.stringify({
        operationName: operationName,
        variables: variables,
        query: query
      }),
      contentType: "application/json",
      dataType: "json"
    });
  };

  const saveResult = function (data) {
    let blob = new Blob([JSON.stringify(data)], {type: "application/json"});
    saveAs(blob, "result.json");
  };

  const getQuestion = function (titleSlug) {
    // questionId, titleSlug, solutions
    return queryGraphQL("questionData", {titleSlug: titleSlug}, "query questionData($titleSlug: String!) { question(titleSlug: $titleSlug) { questionId titleSlug solution { id content } } }");
  };

  getQuestion("two-sum").then(function (data) {
    window.item = data;
  });
})(window);
