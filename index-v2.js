var readline = require('readline');
var agent = require('superagent');
var Key = require('./key');
var token = new Key().key;

var read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Welcome
console.log('---------------------------------------------')
console.log('Welcome to Medium api consumer');
console.log('---------------------------------------------')
    
agent
    .get('https://api.medium.com/v1/me')
    .set('Authorization', 'Bearer ' + token)
    .end(function(err, res){
        
        var body = res.body;
        var name = body.data.name;
        var id = body.data.id;
        
        console.log('---------------------------------------------');
        console.log('Name: ', name);
        console.log('id:   ', id);
        console.log('---------------------------------------------');
        console.log('What would you like to do?\n1. View Publications\n2. Write a story\n3. Post a random Story\n');

        read.question('Enter your answer: ', function(answer) {
            console.log(answer);
            if (answer == 1) {
                console.log('---------------------------------------------');
                console.log('VIEW PUBLICATIONS');
                console.log('---------------------------------------------');

                var medium = new MediumConsume();
                medium.viewPublications(id, token);
            } else if (answer == 2) {
                console.log('---------------------------------------------');
                console.log('Write A STORY');
                console.log('---------------------------------------------');                    

                read.question('What\'s the title of your story? ', function(title) {
                    read.question('What\'s the content of your story? ', function(content) {
                        
                        var medium = new MediumConsume();
                        medium.postAStory(title, content, id, token);

                    });
           
                });
            } else if (answer == 3) {
                console.log('---------------------------------------------');
                console.log('POST A RANDOM STORY STORY');
                console.log('---------------------------------------------'); 
                
                agent
                    .get('https://got-quotes.herokuapp.com/quotes')
                    .end(function(err, res) {
                        var body = res.body;
                        var title = body.character;
                        var content = body.quote;

                        var medium = new MediumConsume();
                        medium.postAStory(title, content, id, token);
                    });

            } else {
                console.log('This is not a jolking sturv - Falz the Bad Guy');
            }
        });
});    


function MediumConsume() {

    this.viewPublications  = function(id, token) {
        agent
            .get('https://api.medium.com/v1/users/'+id+'/publications')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                var data = res.body.data;
                var count = 0;
                for (var i = 0; i < data.length; i++) {
                    console.log(data[i].name);
                    console.log(data[i].description + '\n');
                    count++;
                }
                console.log('\nYou have '+count+' publications');
            });
    };

    this.postAStory = function(title, content, id, token) {
        agent
            .post('https://api.medium.com/v1/users/'+id+'/posts')
            .set('Authorization', 'Bearer ' + token)
            .send({
                        'title': title,
                        'contentFormat':'html',
                        'content': content,
                        'publishStatus':'draft'
                    })
            .end(function(err, res) {
                if(res.body.data) {
                    console.log('Story posted successfully');
                }
            });
    };
}

