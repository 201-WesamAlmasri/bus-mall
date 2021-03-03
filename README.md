# bus-mall

## How it work

It's a voting app so the user can votes for a different type of product and the result will appear to the user after ending the session.

The app will generate a random products images to the user to vote and it will still generate products until the session end

## Functionalies

- The app will work on any number of products (you can specify them by inserting the product's images inside productsImages array)
- You can put any images urls (relative or obsolute)
- You can select how many product to be appeared at same time (by setting numberOfProductsPerPage variable **by default 3 images**)
- You can specify the session time (number of time to votes before the result's button appear(by changing the numberOfRounds variable **by default 25 rounds**)
- The result's button will show the number of clickes for each product and how many times it shown, inaddition the percentage of votes.
- When the voting's session end a bar and pie chart will appear to visualize the results.
- The results will be stored, so that each time you do a voting session the results will accumulated.
