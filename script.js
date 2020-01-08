(function (window) {
  "use strict";

  // Setup "globals"
  const document = window.document;
  const console = window.console;
  const $ = window.jQuery;
  var results;

  // LeetCode page writes to URL, have to restore it with trick
  // http://perrymitchell.net/article/restoring-overridden-window-and-document-methods-with-archetype/
  const URL = (function (document) {
    let iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    let URL = iframe.contentWindow.URL;
    return URL;
  })(document);
  window.URL = URL;

  // Load dependencies
  if (typeof saveAs === "undefined") {
    $.getScript("https://cdn.jsdelivr.net/g/filesaver.js");
  }

  const queryGraphQL = function (operationName, variables, query) {
    return $.post({
      url: "https://leetcode.com/graphql",
      data: JSON.stringify({
        operationName: operationName,
        variables: variables,
        query: query
      }),
      contentType: "application/json",
      dataType: "json"
    });
  };

  const filterResult = function () {
    results = results.filter(item => item['solutions'].length !== 0);
  };

  const saveResult = function () {
    let blob = new Blob([JSON.stringify(results)], {type: "application/json"});
    window.saveAs(blob, "result.json");
  };

  const getAllQuestions = function () {
    return $.get("https://leetcode.com/api/problems/all/").then(
      data => JSON.parse(data)['stat_status_pairs'].map(x => x['stat']['question__title_slug']));
  };

  const getQuestion = function (titleSlug) {
    // questionId, titleSlug, solutions
    return queryGraphQL("questionData", {titleSlug: titleSlug}, "query questionData($titleSlug: String!) { question(titleSlug: $titleSlug) { questionId titleSlug solution { id content } } }");
  };

  const parseSolutionURLs = function (text) {
    if (text == undefined)
      return [];
    let result = text.match(/(?<=https:\/\/leetcode\.com\/playground\/)\w+(?=\/shared)/g);
    if (result === null)
      return [];
    return result;
  };

  const getSolution = function (uuid) {
    return queryGraphQL("fetchPlayground", {uuid: uuid}, "query fetchPlayground($uuid: String!) { allPlaygroundCodes(uuid: $uuid) { code langSlug } }");
  };

  // Start crawling!
  results = [];
  let promises = [];
  let p = getAllQuestions().then(questions => questions.forEach(function (question) {
    let p = getQuestion(question)
      .then(function (data) {
        let solutions = [];
        if (data['data']['question']['solution'] != null) {
          for (let uuid of parseSolutionURLs(data['data']['question']['solution']['content'])) {
            let p = getSolution(uuid).then(function (data) {
              if (data['data']['allPlaygroundCodes'] != null) {
                data['data']['allPlaygroundCodes'].forEach(code =>
                  solutions.push({code: code['code'], language: code['langSlug'], source: "official"}));
              }
            });
            promises.push(p);
          }
        }
        results.push({
          questionId: data['data']['question']['questionId'],
          titleSlug: data['data']['question']['titleSlug'],
          solutions: solutions
        });
      });
    promises.push(p);
  }));
  promises.push(p)
  window.results = results;

  // Save after all has been fetched
  /* Broken
  Promise.all(promises).then(function () {
    filterResult();
    saveResult();
  });
  */

  window.saveResult = function () {
    filterResult();
    saveResult();
  };
})(window);
