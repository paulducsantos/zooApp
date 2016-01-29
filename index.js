var mysql = require('mysql');
var prompt = require('prompt');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'zoo_db'
});

connection.connect(function(err) {
  if(err) {
    console.error('err connection ' + err.stack);
    return;
  }
});

prompt.start();
prompt.message = '';

var zoo = {
  welcome: function() {
    console.log('Welcome to the Zoo And Friends App~!');
  },
  menu: function() {
    console.log('Enter (A): ------> to Add a new animal to the Zoo! \n');
    console.log('Enter (U): ------> to Update info on an animal in the Zoo! \n');
    console.log('Enter (V): ------> to Visit the animals in the Zoo! \n');
    console.log('Enter (D): ------> to Adopt an animal from the Zoo! \n');
    console.log('Enter (Q): ------> to Quit and exit the Zoo! \n');
  },

  add: function(input_scope) {
    var currentScope = input_scope;
    console.log('To add an animal to the zoo, please fill out the following form for us!');
    prompt.get(['->', 'name', 'type', 'age'], function (err, result){
      connection.query();//take the prompt results and put into the database
      currentScope.menu();
      currentScope.promptUser();
    });
  },

  visit: function() {
    console.log('Enter (I): -------> do you know the animal by its id? We will visit that animal!');
    console.log('Enter (N): -------> do you know the animal by its name? We will visit that animal!');
    console.log('Enter (A): -------> here\'s the count for all animals in all locations');
    console.log('Enter (C): -------> here\'s the count for all animals in this one city!');
    console.log('Enter (O): -------> here\'s the count for all the animals in all locations by the type you specified!');
    console.log('Enter (Q): -------> Quits to the main menu!');
    currentScope.visit();
    currentScope.view(currentScope);
  },

  view: function() {
    //get this done when they fix the homework
  },

  type: function(input_scope) {
    var currentScope = input_scope;
    console.log('Enter animal type to find out how many animals we have of that type');
    prompt.get(['->', 'animal_type'], function(err, result) {
      connection.query(); //give the count of animals of this type
      currentScope.menu();
      currentScope.promptUser();
    });
  },

  care: function(input_scope) {
    var currentScope = input_scope;
    console.log('Enter city name NY/SF');
    prompt.get(['->', 'city_name'], function(err, result) {
      connection.query(); //select the number of animals that all the caretakers from the specific user inputed city
      currentScope.visit();
      currentScope.view(currentScope);
    });
  },

  animId: function(input_scope) {
    var currentScope = input_scope;
    console.log('Enter ID of the animal you want to visit');
    prompt.get(['->', 'animal_id'], function(err, result) {
      connection.query(); // get the data for the particular animal of that id that the user typed in
      currentScope.visit();
      currentScope.view(currentScope);
    });
  },

  name: function(input_scope) {
    var currentScope = input_scope;
    console.log('Enter name of the animal you want to visit');
    prompt.get(['->', 'animal_name'], function(err, result) {
      connection.query(); // get the data for the particular animal of that name that the user typed in
      currentScope.visit();
      currentScope.view(currentScope);
    });
  },

  all: function(input_scope) {
    connection.query();//get total animals
  },

  update: function(input_scope) {
    var currentScope = input_scope;
    prompt.get(['--->', 'id', 'new_name', 'new_age', 'new_type', 'new_caretaker_id'], function(err, result) {
      connection.query(); //update that particular animal with the input the user provided
      currentScope.menu();
      currentScope.promptUser();
    });
  }
}