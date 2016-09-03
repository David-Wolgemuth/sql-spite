
// This will be highly inspired by Active Record, Mongoose, and Chai


// ------ RETRIEVE ------ //

User.all();

User.find(id);

User.find.by.id(id);

User.find({ id: id });

User.first(); 

User.find.where({ name: name });

User.find.where.not({ name: name });

User.find.where.any({ name: name, email: email });

User.find.where.not.any({ name: name, email: email });

User.find.where.all({ name: name, email: email });

User.select("email", "password").all();

u.messages();

u.select("content").messages();

User.select("email", "password").first().select("content").messages.where.not({ title: title });

// ----- CREATE ------ //

var u = User.new({ email: email });
u.save()
.then(function (user) {})
.catch(function (err) {});

User.create({ email: email });

// ----- UPDATE ------ //

var u = User.find(id);
u.email = "changed@stuff.com";
u.save();

// ----- DELETE ------ //

var count = User.delete({ email: email }, { multi: true });

User.destroy();
