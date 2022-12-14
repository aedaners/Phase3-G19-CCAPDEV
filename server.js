const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Int32, Decimal128 } = require("mongodb");
const Schema = mongoose.Schema;
const app = express();
const port = 3000

/// --- CONNECT TO MONGODB --- ///
mongoose.connect("mongodb://127.0.0.1:27017/dbShuttleService?directConnection=true", {useNewUrlParser: true});
mongoose.set('strictQuery', true);

//mongodb://127.0.0.1:27017/dbShuttleService?directConnection=true

// --- STATIC FILES --- //
app.use(express.static("public"))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/images',express.static(__dirname + 'public/images'))

// --- SET VIEWS --- //
app.set('views', './views')
app.set('view engine', 'ejs')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(bodyParser.text());

//MODELS
var usersSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
});
const users = mongoose.model("users", usersSchema);

var bookinghistorySchema = new Schema({
    userID: String,
    locationPU: String,
    locationD: String,
    dateRes: String,
    timeStart: String,
    timeEnd: String,
    payment: Decimal128,
    status: String,
});
const bookinghistory = mongoose.model("bookinghistory", bookinghistorySchema);


var activeBookingSchema = new Schema({
    bookingID: String,
    driver: String,
    qty: Number,
    payment: Decimal128,
});
const activeBooking = mongoose.model("activeBooking", activeBookingSchema);


/// --- SHOW MAIN PAGE/LOAD BOOKING HISTORY --- ///
app.get('/',(req, res) => {
    bookinghistory.find({}, function(err, rows) {
        if (err){
            console.log(err);
        } else {
            res.render('index', {
                bookinghistory : rows
            });
        }
    });
});

/// --- SHOW LOGIN PAGE --- ///
app.get('/login', function(req, res) {
    res.render('login');
});


/// --- REGISTER A NEW USER --- ///
app.get('/add',(req, res) => {
    res.redirect('login');
});

app.post('/add',(req, res) => {
    const user = new users({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });
  
    user.save( function(err) {
        if  (err){
            console.log(err);
        } else {
            res.redirect("login");
        }
    });
});

/// --- DASHBOARD TAB --- ///
app.get('/dashbook',(req, res) => {
    res.redirect('/');
});

app.post('/dashbook',(req, res) => {
    const dashbooking = new bookinghistory({
        bookingID: "1",
        driver: req.body.driver,
        contact: req.body.contact,
        qty: req.body.qty,
        amount: req.body.amount,
    });
  
    dashbooking.save( function(err) {
        if  (err){
            console.log(err);
        } else {
            res.redirect("/");
        } 
    });
});

/// --- MAKE A RESERVATION/BOOKING TAB --- ///
app.get('/book',(req, res) => {
    res.redirect('/');
});

app.post('/book',(req, res) => {
    const booking = new bookinghistory({
        userID: "10000001",
        locationPU: req.body.RlocPU,
        locationD: req.body.RlocD,
        dateRes: req.body.Rdate,
        timeStart: req.body.Rtime,
        timeEnd: "--:--",
        payment: 150.00,
        status: "ONGOING",
    });
  
    booking.save( function(err) {
        if  (err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});


// --- DELETE A RESERVATION/BOOKING --- //
app.get('/delete/:_id',(req, res) => {
    const id = req.params._id;

    bookinghistory.findByIdAndRemove(id, function(err){
       if(err){
            console.log(err);
       } else {
            res.redirect("/");
       }
    });
});


// --- UPDATE A RESERVATION/BOOKING --- //
app.get('/complete/:_id',(req, res) => {
    const id = req.params._id;

    var cTime = getCurrentTime();
    
    bookinghistory.findByIdAndUpdate(id, { status: 'COMPLETE', timeEnd: cTime }, function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
            console.log("Updated User : ", docs);
            res.redirect("/");
        }
    });
});

// --- FUNCTION FOR GETTING CURRENT TIME --- //
function getCurrentTime() {
    var cDate = new Date();
    var cHour = cDate.getHours();
    var cMinute = cDate.getMinutes().toString();
    var cLabel;

    if (cHour >= 13) { 
        cHour = cHour-12;
        cHour = cHour.toString();
        cLabel = "PM"; 
        var cTime = cHour.concat(":", cMinute, cLabel);
        return cTime;
    }
    else { 
        cHour = cHour.toString();
        cLabel = "AM"; 
        var cTime = cHour.concat(":", cMinute, cLabel);
        return cTime;
    }
};


/// --- LISTEN ON PORT 3000 --- ///
app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000");
});