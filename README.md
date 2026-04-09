 HEAD
test

EXAMPLE ENDPOINTS

app.get("/", (req, res) => {
    console.log(req);
    // res.send("<h1>TEST</h1>");
    return res.json({
        message: "API endpoint is working!"
    });
});

app.post("/test", (req, res) => {
    console.log(req);
    return res.json({
        message: "API endpoint /test is working!",
        data: {
            ok: true,
            tip: "Data json test endpoint!"
        }
    });
});


START APP:

// app.listen(5000, ()=>{
//     console.log("Server is running...");
// });
# tt4-2930-be
 7527e7db6b66ddcc8cb776c65562ec2bb5aeaeb2
