# Instructions

This needs node and npm to run. I used node 6.2.0, but it should work on 4.0.0 and above.

To clone from github:
```
git clone https://github.com/snarisi/oscars-api
cd oscars-api
```

To run:
```
npm install
node main
```

# Approach

This app has three main parts:

1. A parsing utility that takes a string and returns all of the numbers, words, and special symbols, which are used to interpret the information in the string and convert it into the right format. There were several ways I thought of to do this, but I tried to do it in a way that would be easy to adjust as new edge cases appear. For instance, it handles the common cases like '$500,000' and '$2 million', but also other possibilities I can imagine like 'Approx. $12 million' and '8.2 million US$'.

2. A main routine that makes the API calls and uses the parsing utility to format and print the data. This function is written so if any of the calls fail, it will try again some number of times, with some interval in between.

3. A logger utility that saves a message to logfile whenever something unexpected happens that shouldn't kill the whole process (for example, when a null value is returned for one of the fields).

For the app itself, the only external library I used was the node-fetch package (version 1.5.3), which provides a nicer way of making http requests than node's built-in module. For testing, I used mocha (version 2.5.3) and chai (version 3.5.0). The tests I wrote were for the parsing utility. To run them, use `npm test`

# Result

The average budget, according to how I calculated it, was $17,234,025.
