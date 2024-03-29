module.exports = function(app, fs)
{
    app.get('/',function(req,res){
        res.render('index', {
            title: "MY HOMEPAGE",
            length: 5
        });
    });

    app.get('/list', function (req, res) {
        fs.readFile( __dirname + "/../data/" + "user.json", 'utf8', function(err, data){
           console.log( data );
           res.end( data ); 
        });
    });

    app.get('/getUser/:username', function(req, res) {
        fs.readFile( __dirname + "/../data/user.json", 'utf8', function(err, data) {
            var users = JSON.parse(data);
            res.json(users[req.params.username]);
        });
    });

    app.post('/addUser/:username', function(req, res) {
        var result = { };
        var username = req.params.username;

        // 
        console.log(req.body["password"]);
        if(!req.body["password"] || !req.body["name"]) {
            result['success'] = 0; // 실패
            result['error'] = "invaild request";
            res.json(result);
            return;
        }

        fs.readFile( __dirname + "/../data/user.json", 'utf8', function(err, data){
            var users = JSON.parse(data); // JSON.parse: 데이터를 오브젝트나 값으로 리턴
            if(users[username]) {
                // duplication found
                result['success'] = 0;
                result['error'] = 'duplicate';
                res.json(result);
                return;
            }

            // add to data
            users[username] = req.body;

            // save data
            fs.writeFile(__dirname + "/../data/user.json", 
                    JSON.stringify(users, null, '\t'), "utf8", function(err, data) { // json의 pretty-print 를 위한 작업
                result = {"success": 1};
                res.json(result);
            })
        });
    })

    app.put('/updateUser/:username', function(req, res){

        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            // ADD/MODIFY DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });

    app.delete('/deleteUser/:username', function(req, res) {
        var result = { };
        //load data
        fs.readFile(__dirname + "/../data/user.json", 'utf8', function(err, data) {
            var users = JSON.pasrse(data);

            // if not found
            if(!users[req.params.username]) {
                result['success'] = 0;
                result['error'] = 'not found';
                res.json(result);
                return;
            }

            // delete from data
            delete users[req.params.username];

            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), 'utf', function(err,data) {
                result['success'] = 1;
                res.json(result);
                return;
            });
        })
    })
}