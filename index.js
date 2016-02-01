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
      var randCaretaker = Math.floor(Math.random() * 10) + 1;
      var new_animal = {caretaker_id: randCaretaker, name: result.name, type: result.type, age: result.age};
      var query = connection.query('INSERT INTO animals SET ?', new_animal, function(err, result) {
        if(err) {throw err}
        });
      console.log(query.sql);
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
    // currentScope.visit();
    // currentScope.view();
  },

  view: function() {
    // var currentScope = input_scope;
    console.log('Please choose what you like to visit!');
    prompt.get(['->', 'visit'], (err, result) => {
      if (result.visit == 'Q') {
        this.menu();
      } else if (result.visit == 'O') {
        this.type();
      } else if (result.visit =='I') {
        this.animId();
      } else if (result.visit == 'N') {
        this.name();
      } else if (result.visit == 'A') {
        this.all();
      } else if (result.visit == 'C') {
        this.care();
      } else {
        console.log('Sorry didn\'t get that, come again?');
        this.visit();
        this.view();
      }
    });
  },

  type: function() {
    // var currentScope = input_scope;
    console.log('Enter animal type to find out how many animals we have of that type');
    prompt.get(['->', 'animal_type'], (err, result) => {
      connection.query('SELECT COUNT(*) AS total FROM `animals` WHERE `type` = ?', [result.animal_type], function(err, results, fields) {
        if (err) throw err;
        console.log('Total animals of that type: ' + results[0].total);
      });
      this.menu();
      this.promptUser();
    });
  },

  care: function(input_scope) {
    var currentScope = input_scope;
    console.log('Enter city name NY/SF');
    prompt.get(['->', 'city_name'], function(err, result) {
      connection.query('SELECT COUNT(*) AS total FROM animals, caretakers WHERE animals.caretaker_id = caretakers.id AND caretakers.city = ?', [result.city_name], function(err, results, fields) {
        if (err) throw err;
        console.log('Total animals in that location: ' + results[0].total);
      });
      currentScope.visit();
      currentScope.view(currentScope);
    });
  },

  animId: function() {
    // var currentScope = input_scope;
    console.log('Enter ID of the animal you want to visit');
    prompt.get(['->', 'animal_id'], (err, result) => {
      connection.query('SELECT * FROM animals WHERE id = ?', [result.animal_id], function(err, results, fields) {
        if (err) throw err;
        else {
          console.log('Animal ID: ' + results[0].id);
          console.log('Caretaker ID: ' + results[0].caretaker_id);
          console.log('Name: ' + results[0].name);
          console.log('Animal Type: ' + results[0].type);
          console.log('Age: ' + results[0].age);
        }
      });
      this.visit();
      this.view();
    });
  },

  name: function() {
    // var currentScope = input_scope;
    console.log('Enter name of the animal you want to visit');
    prompt.get(['->', 'animal_name'], (err, result) => {
      connection.query('SELECT * FROM animals WHERE name = ?', [result.animal_name], function(err, results, fields) {
        if (err) throw err;
        else {
          console.log('Animal ID: ' + results[0].id);
          console.log('Caretaker ID: ' + results[0].caretaker_id);
          console.log('Name: ' + results[0].name);
          console.log('Animal Type: ' + results[0].type);
          console.log('Age: ' + results[0].age);
        }
      }); // get the data for the particular animal of that name that the user typed in
      this.visit();
      this.view();
    });
  },

  all: function() {
    connection.query('SELECT COUNT(*) AS total FROM animals', function(err, results, fields) {
      if (err) throw err;
      else {
        console.log('Total number of animals: ' + JSON.stringify(results[0].total));
      }
    });//get total animals
  },

  preUpdate: function() {
    // var currentScope = input_scope;
    console.log('Update by ID or name?');
    var userChoice;
    prompt.get(['IdOrName'], (err, result) => {
      userChoice = result.IdOrName;
      this.update(userChoice);
    });
  },

  update: function(IdOrName) {
    // var currentScope = input_scope;
    if(IdOrName == 'name') {
      prompt.get(['--->', 'old_name', 'new_name', 'new_age', 'new_type', 'new_caretaker_id'], (err, result) => {
        var update_animal = {name: result.new_name, age: result.new_age, type: result.new_type, caretaker_id: result.new_caretaker_id};
        var query = connection.query('UPDATE animals SET ? WHERE name = ?', [update_animal, result.old_name], function(err, results) {
          if (err) throw err;
        }); //update that particular animal with the input the user provided
        console.log(query.sql);
        this.menu();
        this.promptUser();
      });
    } else {
      prompt.get(['--->', 'animal_id', 'new_name', 'new_age', 'new_type', 'new_caretaker_id'], (err, result) => {
        var update_animal = {name: result.new_name, age: result.new_age, type: result.new_type, caretaker_id: result.new_caretaker_id};
        var query = connection.query('UPDATE animals SET ? WHERE id = ?', [update_animal, result.animal_id], function(err, results) {
          if (err) throw err;
        }); //update that particular animal with the input the user provided
        console.log(query.sql);
        this.menu();
        this.promptUser();
      });
    }
  },

  adopt: function() {
    prompt.get(['->', 'animal_id'], (err, result) => {
      connection.query('DELETE FROM animals WHERE id = ?', result.animal_id, function(err, results, fields) {
        if (err) throw err;
      }); //update that particular animal with the input the user provided
      this.menu();
      this.promptUser();
    });
  },

  promptUser: function() {
    prompt.get(['input'], (err, result) => {
      console.log(result);
      if (result.input == 'Q') {
        this.exit();
      } else if (result.input == 'A') {
        this.add();
      } else if (result.input =='V') {
        this.visit();
        this.view();
      } else if (result.input == 'D') {
        this.adopt();
      } else if (result.input == 'U') {
        this.preUpdate();
      } else {
        console.log('Sorry didn\'t get that, come again?');
      }
    });
  },

  exit: function() {
    console.log('Thank you for visiting us, good bye~!');
    process.exit();
  },

  open: function() {
    this.welcome();
    this.menu();
    this.promptUser();
  }
}

zoo.open();