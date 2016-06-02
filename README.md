# Approach

My first step was to check the quality of the data. That included steps such as making sure each year only had one winner and that all the fields were spelled the same. That just took some printing of the results I was getting during each step of the script. Then when I had a script that was returning the year, title, and budget of each winner, I checked to make sure each entry had all three fields. The only problem was that some didn't have a budget. Apparently, some of that information wasn't available from wikipedia so I marked it as null, and made sure not to include those when calculating the average.


TODO: SOMETIMES THE REQUEST DOESN'T WORK... IT SHOULD TRY AGAIN?
