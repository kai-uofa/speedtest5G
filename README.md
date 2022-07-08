# speedtest5G
My 5G home network speed test


Requirement:
https://www.speedtest.net/apps/cli
NodeJS call command line: https://stackabuse.com/executing-shell-commands-with-node-js/
Selenium: https://blog.testproject.io/2020/06/17/selenium-javascript-automation-testing-tutorial-for-beginners/
Slack: https://slack.dev/bolt-js/tutorial/getting-started

command: speedtest --format=json-pretty --progress=no

What this does:
1. regularly query speedtest (3 hours interval)
2. store the result into json file (maybe a noSQL database)?
3. if the speed is low (< 50 Mbps for example) -> send notification to Slack
4. Chat with bot to perform router restarting -> call Selenium
5. Chat with bot to perform speedtest at any point