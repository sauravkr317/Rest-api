function initRoutes(app){

    app.get("/", (req, res) =>{
        res.status(200).send("hello");
    })

    app.post("/", (req, res) =>{
        const body = req.body;
        console.log(body)
        res.status(201).send(body)
    })
}

module.exports = initRoutes