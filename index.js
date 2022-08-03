const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
//const URL = process.env.DB;
//const DB = "bms";
const bcrypt = require("bcryptjs");
const jwt =require("jsonwebtoken");
const URL = "mongodb+srv://shivakumark:Test1234@cluster0.kot9grj.mongodb.net/?retryWrites=true&w=majority";
//const URL = "mongodb+srv://shivakumark:Test1234@cluster0.kot9grj.mongodb.net/bookmyshow";
//const URL = "mongodb+srv://shivakumark:Test1234@cluster6.pzdxs.mongodb.net/test";
//const URL = "mongodb+srv://shivakumark:Test1234@cluster6.pzdxs.mongodb.net/?retryWrites=true&w=majority";
//const URL = "mongodb://127.0.0.1:27017/bookmyshow"
const DB = "bookmyshow";


app.use(cors())
app.use(express.json());



app.post("/register", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        let uniqueEmail = await db.collection("users").findOne({ email: req.body.email });

        if (uniqueEmail) {
            res.status(401).json({
                message: "email already exist"
            })
        } else {
            let salt = await bcrypt.genSalt(10);

            let hash = await bcrypt.hash(req.body.password, salt);

            req.body.password = hash;

            let users = await db.collection("users").insertOne(req.body);

            await connection.close();
            res.json({
                message: "User Registerd"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

app.post("/login", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        let user = await db.collection("users").findOne({ email: req.body.email })

        if (user) {
            let isPassword = await bcrypt.compare(req.body.password, user.password);
            if (isPassword) {

               // let token=jwt.sign({_id:user._id},process.env.secret)
               let token = jwt.sign({ _id: user._id }, "qwertyuiop")
                res.json({
                    message: "allow",
                    token,
                    id:user._id
                })
            } else {
                res.status(404).json({
                    message: "Email or password is incorrect"
                })
            }
        } else {
            res.status(404).json({
                message: "Email or password is incorrect"
            })
        }
    } catch (error) {
        console.log(error)
    }
})


app.post("/aregister", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        let uniqueEmail = await db.collection("admin").findOne({ email: req.body.email });

        if (uniqueEmail) {
            res.status(401).json({
                message: "email already exist"
            })
        } else {
            let salt = await bcrypt.genSalt(10);

            let hash = await bcrypt.hash(req.body.password, salt);

            req.body.password = hash;

            let users = await db.collection("admin").insertOne(req.body);

            await connection.close();
            res.json({
                message: "admin Registerd"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

app.post("/alogin", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        let user = await db.collection("admin").findOne({ email: req.body.email })

        if (user) {
            let isPassword = await bcrypt.compare(req.body.password, user.password);
            if (isPassword) {

              //  let token=jwt.sign({_id:user._id},process.env.secret)
              let token = jwt.sign({ _id: user._id }, "qwertyuiop")
                res.json({
                    message: "allow",
                    token,
                    id:user._id
                })
            } else {
                res.status(404).json({
                    message: "Email or password is incorrect"
                })
            }
        } else {
            res.status(404).json({
                message: "Email or password is incorrect"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

app.post("/movies", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        await db.collection("movies").insertOne(req.body);
        await connection.close();
        res.json({
            message: "movie created"
        })
    } catch (error) {
        console.log(error)
    }
})

app.post("/ticket", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        await db.collection("ticket").insertOne(req.body);
        await connection.close();
        res.json({
            message: "ticket created"
        })
    } catch (error) {
        console.log(error)
    }
})

app.get("/movies", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let movies = await db.collection("movies").find().toArray();
        res.json(movies)
        await connection.close();
    } catch (error) {
        console.log(error)
    }
})

app.get("/movies/:id", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let movies = await db.collection("movies").findOne({ _id: mongodb.ObjectID(req.params.id) })
        res.json(movies)
        await connection.close();
    } catch (error) {
        console.log(error)
    }
})

app.get("/users/:id", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let user = await db.collection("users").findOne({email:req.params.id})
        res.json(user)
        await connection.close();
    } catch (error) {
        console.log(error)
      
    }
})

app.put("/movies/:id", async function (req, res) {

    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        await db.collection("movies").updateOne({ _id: mongodb.ObjectID(req.params.id) }, { $set: req.body })
        res.json({
            message: "Updated"
        })
        await connection.close();
    } catch (error) {
        console.log(error)
    }

})

app.get("/ticket/:id", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let movies =await db.collection("ticket").find({username:req.params.id}).toArray();
        res.json(movies)
        await connection.close();
    } catch (error) {
        console.log(error)
    }
})

app.get("/tickets", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let movies =await db.collection("ticket").find().toArray();
        res.json(movies)
        await connection.close();
    } catch (error) {
        console.log(error)
    }
})

app.delete("/movies/:id", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        await db.collection("movies").deleteOne({ _id: mongodb.ObjectID(req.params.id)})
        await connection.close()
        res.json({
            message: "Deleted"
        })
    } catch (error) {
        console.log(error)
    }
})


app.listen(5001)
//app.listen(process.env.PORT|| 5000)