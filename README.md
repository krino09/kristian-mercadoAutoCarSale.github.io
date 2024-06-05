PROJECT OF KRISTIAN NOWELL MERCADO FOR FULL STACK DESIGN

********************************************************

3 General Steps to run the code

1. Once downloaded, make sure to run Git terminal and run node seeds/index.js to inject DB
2. You can change the author to own the existing DBs by following the instructions below:
    2.1 Register your own account
    2.2 Make sure to change the .env file information to your cloudinary account 
    2.3 Open terminal
    2.4 Type mongosh
    2.5 Type use autoCarSale
    2.6 Type db.users.find()
    2.7 Copy the ObjectID
    2.8 Paste it to seeds - index.js then replace the current author: '6656a4e0c584e89053823318'
    2.9 Run the code nodemon app.js
    2.10 Add a listing
    2.11 Copy the images db in console erasing the Object ID and paste to index.js under Seeds ex: 
    images: [
    {
      url: 'https://res.cloudinary.com/dk0dr0gtw/image/upload/v1717415114/car_images/ag5enguhsfebdvoaejuq.jpg',
      filename: 'car_images/ag5enguhsfebdvoaejuq',
    }
  ]
3. Run the code nodemon app.js



Comments or suggestions, please email me at 13923182@aias.edu.au