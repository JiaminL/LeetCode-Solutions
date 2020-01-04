# LeetCode-Solutions-Crawler

Flexible Assignment 2 of course « Web Information Processing and Application »

## Install

This project depends on `requests`, which you can install from either PyPI or your distro's package repository (the package is usually named `python3-requests`).

## Run

You need to log in to LeetCode before their GraphQL endpoint is accessible.

There are two ways to provide your login credentials to the script: Either give them in environment variables `LEETCODE_USERNAME` and `LEETCODE_PASSWORD`, or run the script directly and let it prompt you to enter them.

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
