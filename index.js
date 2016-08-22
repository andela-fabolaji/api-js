var readline = require('readline');
var agent = require('superagent');

const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Welcome
console.log('---------------------------------------------')
console.log('Welcome to Medium api consumer');
console.log('---------------------------------------------')

// Authenticate user
console.log('Authentication: Please enter your api-key');

read.question('Api token: ', function(apiToken) {
    
    agent
        .get('https://api.medium.com/v1/me')
        .set('Authorization', 'Bearer ' + apiToken)
        .end(function(err, res){
            
            var body = res.body;
            var name = body.data.name;
            var id = body.data.id;
            
            console.log('---------------------------------------------');
            console.log('Name: ', name);
            console.log('id:   ', id);
            console.log('---------------------------------------------');
            console.log('What would you like to do?');
            console.log('1. Post Data');

            read.question('', (option) => {
                console.log('You chose ', option);
                read.close();
            });

        });    
    

    read.close();
});



