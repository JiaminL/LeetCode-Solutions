# LeetCode-Solutions-Crawler

Flexible Assignment 2 of course « Web Information Processing and Application »

## Instructions

Because LeetCode recently added [Google's reCAPTCHA][reCAPTCHA], a spider client can no longer log in to LeetCode and access its GraphQL endpoint. So this spider is written in JavaScript and runs in a browser.

Open a browser (latest Chrome recommended), log in to your LeetCode account manually, and run the following script in Developer Console (usually available after pressing **F12**):

```javascript
$.getScript("https://raw.githubusercontent.com/JiaminL/LeetCode-Solutions/master/script.js")
```

Watch the log closely. When it says "Completed", the crawled result will be automatically downloaded to `result.json`.

## Output format

This is the required format from the TAs.

```javascript
{
  "questionId": "135",
  "titleSlug": "candy",
  "solutions": [
    {
      "language": "Python3",                  // 解答语言
      "code": "class Solution:\n...",         // 解答代码
      "source": "讨论版"                      // 爬取来源，自行填写
    }
  ]
}
```

  [reCAPTCHA]: https://en.wikipedia.org/wiki/ReCAPTCHA
