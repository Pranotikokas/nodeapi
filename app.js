var express = require('express');
var mysql = require('mysql');
var app = express();
// var dateTime = require('node-datetime');
var moment = require('moment');
// var dt = dateTime.create();
// var moment().format();

// var connection = mysql.createConnection({
//   host:'localhost',
//   user:'root',
//   password:'root@123',
//   database:'wa_db'
// });

//
// var connection = mysql.createConnection({
//   host:'aa8xup8v02zdo7.c2jcvaebobvq.us-east-2.rds.amazonaws.com',
//   user:'walinns',
//   password:'Walinns0077',
//   database:'ebdb'
// });
//
var db_config = {
    host:'aa8xup8v02zdo7.c2jcvaebobvq.us-east-2.rds.amazonaws.com',
    user:'walinns',
    password:'Walinns0077',
    database:'ebdb'
};

//
// var db_config = {
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'ebdb'
// };

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }
    else {
      console.log("Connected to Walinns Database");
    }                                // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}



handleDisconnect();

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(function(req, res, next) {
//       if ((req.get('X-Forwarded-Proto') !== 'https')) {
//         res.redirect('https://' + req.get('Host') + req.url);
//       } else
//         next();
//     });
app.listen(8888);


app.get('/',function(req, resp){
      //moment().format() = dt.format('Y-m-d H:M:S');
      console.log(moment().format());
      console.log("-------------------------------------------------------------------------------");
      console.log("                      Welcome to Walinns Analytics                             ");
      console.log("-------------------------------------------------------------------------------");
      resp.send("Welcome to Walinns Analytics");
});

app.get('/devices',function(req, resp){
    connection.query("SELECT * FROM deviceinfodatas", function(error, rows, fields){
      if(!!error){
          console.log('Error in the query');
          resp.send("Error in the query");
      }else{
          console.log('Device get info API');
          resp.status(200).json(rows);
      }
    });
});

// app.post('/devices',function(req, res){
//     console.log("DEVICE INFO API : ",moment().format());
//     console.log("DEVICE API starts---------------------------------------------------------------------------------");
//     const project_token = req.headers['authorization'];
//     const device_id = req.body.device_id;
//     const device_model = req.body.device_model;
//     const os_name = req.body.os_name;
//     const os_version = req.body.os_version;
//     const connectivity = req.body.connectivity;
//     const carrier = req.body.carrier;
//     const email = req.body.email;
//     const play_service = req.body.play_service;
//     const bluetooth = req.body.bluetooth;
//     const screen_dpi = req.body.screen_dpi;
//     const screen_height = req.body.screen_height;
//     const screen_width = req.body.screen_width;
//     const age = req.body.age;
//     const gender = req.body.gender;
//     const language = req.body.language;
//     const app_version = req.body.app_version;
//     const country = req.body.country;
//     const date_time = req.body.date_time;
//
//     var data = {
//         "Data":""
//     };
// 	if(project_token == '' || project_token === undefined){
//
// 			data["Data"] = "Authentication failed!";
//             console.log("Authentication failed!");
//             res.json(data);
//             console.log("DEVICE API ends---------------------------------------------------------------------------------");
//
// 	}
// 	else{
// 			  var sql = 'SELECT * from deviceinfodatas WHERE device_id=? and project_token=(select project_token from project where project_token=?)';
// 		  connection.query(sql,[device_id,project_token ],function(err, rows, fields){
// 			  if(rows.length != 0){
// 				   var post = {
//                                              device_model: device_model,
//                                              os_name: os_name,
//                                              os_version : os_version ,
//                                              connectivty : connectivity,
//                                              carrier : carrier ,
//                                              email : email ,
//                                              play_service: play_service,
//                                              bluetooth : bluetooth,
//                                              screen_dpi : screen_dpi,
//                                              screen_height : screen_height,
//                                              screen_width : screen_width ,
//                                              age : age,
//                                              gender : gender,
//                                              language : language,
//                                              app_version : app_version ,
//                                              country : country,
//                                              project_token : project_token,
//                                              updated_at:date_time
//                                            };
//                                        var condition = {device_id:device_id};
//                                        var query = connection.query('UPDATE deviceinfodatas SET ? WHERE ?', [post, condition] , function(err, result) {});
//                                        console.log(query.sql);
//                                        data["Data"] = "Updated existing device record";
//                                        res.json(data);
//                                        console.log("DEVICE API ends---------------------------------------------------------------------------------");
// 			  }
// 			  else{
// 				   console.log(req.body.device_id);
//                                        var sql = 'INSERT INTO deviceinfodatas SET ?';
//                                        const  values = {
//                                                        device_id: device_id,
//                                                        device_model: device_model,
//                                                        os_name: os_name,
//                                                        os_version : os_version,
//                                                        connectivty : connectivity,
//                                                        carrier : carrier,
//                                                        email : email,
//                                                        play_service: play_service,
//                                                        bluetooth : bluetooth,
//                                                        screen_dpi : screen_dpi,
//                                                        screen_height : screen_height,
//                                                        screen_width : screen_width ,
//                                                        age : age,
//                                                        gender : gender,
//                                                        language : language,
//                                                        app_version : app_version,
//                                                        country : country,
//                                                        project_token:project_token,
//                                                        created_at:date_time
//                                                      };
//                                       console.log(values);
//                                       connection.query(sql, values, function(error, result){
//                                          //console.log(query.sql);
//                                          if(!!error){
//                                              console.log(error);
//                                              console.log('Error in the query');
//                                              res.send("Error in the query");
//                                              console.log("DEVICE API ends---------------------------------------------------------------------------------");
//                                          }else{
//
//                                              console.log('Added new device');
//                                              console.log(result.insertId);
//
//                                              data["Data"] = "Added new device";
//                                              res.json(data);
//                                              console.log("DEVICE API ends---------------------------------------------------------------------------------");
//                                              //res.status(200).json(result.insertId);
//                                          }
//                                        });
// 			  }
// 		  });
// 	}
//
// });
app.post('/devices',function(req, res){
    //moment().format() = dt.format('Y-m-d H:M:S');
    console.log("DEVICE INFO API : ",moment().format());
    console.log("DEVICE API starts---------------------------------------------------------------------------------");
    var project_token = req.headers['authorization'];
    var device_id = req.body.device_id;
  	var First_name = req.body.First_name;
  	var Last_name = req.body.Last_name;
  	var phone_number = req.body.phone_number;
    var device_model = req.body.device_model;
    var os_name = req.body.os_name;
    var os_version = req.body.os_version;
    var connectivty = req.body.connectivity;
    var carrier = req.body.carrier;
    var email = req.body.email;
    var play_service = req.body.play_service;
    var bluetooth = req.body.bluetooth;
    var screen_dpi = req.body.screen_dpi;
    var screen_height = req.body.screen_height;
    var screen_width = req.body.screen_width;
    var age = req.body.age;
    var gender = req.body.gender;
    var language = req.body.language;
    var app_version = req.body.app_version;
	  var sdk_version = req.body.sdk_version;
    var country = req.body.country;
  	var state = req.body.state;
  	var city = req.body.city;
    var date_time = req.body.date_time;
    if (typeof phone_number === 'undefined')
    {
       phone_number = 'NA';
    }
    if (typeof First_name === 'undefined')
    {
       First_name = 'NA';
    }
    if (typeof Last_name === 'undefined')
    {
       Last_name = 'NA';
    }
    if (typeof state === 'undefined')
    {
       state = 'NA';
    }
    if (typeof city === 'undefined')
    {
       city = 'NA';
    }

    var data = {
        "Data":""
    };
    console.log(project_token);
    connection.query('SELECT * from project WHERE project_token=?',[project_token],function(err, rows1, fields){

                if(rows1.length != 0){
                                console.log(rows1.length);
                                var sql = 'SELECT * from deviceinfodatas WHERE device_id=? and project_token=?';
                                //var sql = 'SELECT * from deviceinfodatas WHERE device_id=?';
                                connection.query(sql,[device_id,project_token ],function(err, rows, fields){
                                   if(rows.length != 0){
                                       var post = {
                        										 First_name : First_name,
                        										 Last_name : Last_name,
                        										 phone_number : phone_number,
                                             device_model: device_model,
                                             os_name: os_name,
                                             os_version : os_version,
                                             connectivty : connectivty,
                                             carrier : carrier,
                                             email : email,
                                             play_service: play_service,
                                             bluetooth : bluetooth,
                                             screen_dpi : screen_dpi,
                                             screen_height : screen_height,
                                             screen_width : screen_width,
                                             age : age,
                                             gender : gender,
                                             language : language,
                                             app_version : app_version,
											                       sdk_version : sdk_version,
                                             country : country,
											                       state : state,
											                       city : city,
                                             project_token : project_token,
                                             updated_at: date_time
                                           };
                                      // var condition = {device_id:device_id , project_token:project_token};
                                       var query = connection.query('UPDATE deviceinfodatas SET ? WHERE device_id=? and project_token=?', [post, device_id, project_token] , function(err, result) {});
                                       console.log(query.sql);
                                       data["Data"] = "Updated existing device record";
                                       res.json(data);
                                       console.log("DEVICE API ends---------------------------------------------------------------------------------");
                                   }
                                   else
                                   {

                                       console.log(req.body.device_id);
                                       var sql = 'INSERT INTO deviceinfodatas SET ?';
                                       const  values = {
                                                       device_id: device_id,
													                             First_name : First_name,
                            													 Last_name : Last_name,
                            													 phone_number : phone_number,
                                                       device_model: device_model,
                                                       os_name: os_name,
                                                       os_version : os_version,
                                                       connectivty : connectivty,
                                                       carrier : carrier,
                                                       email : email,
                                                       play_service: play_service,
                                                       bluetooth : bluetooth,
                                                       screen_dpi : screen_dpi,
                                                       screen_height : screen_height,
                                                       screen_width : screen_width ,
                                                       age : age,
                                                       gender : gender,
                                                       language : language,
                                                       app_version : app_version,
													                             sdk_version :sdk_version,
                                                       country : country,
                          													   state : state,
                          													   city : city,
                                                       project_token:project_token,
                                                       created_at:date_time,
                                                       updated_at:date_time
                                                     };
                                      console.log(values);
                                      connection.query(sql, values, function(error, result){
                                         //console.log(query.sql);
                                         if(!!error){
                                             console.log(error);
                                             console.log('Error in the query');
                                             res.send("Error in the query");
                                             console.log("DEVICE API ends---------------------------------------------------------------------------------");
                                         }else{

                                             console.log('Added new device');
                                             console.log(result.insertId);

                                             data["Data"] = "Added new device";
                                             res.json(data);
                                             console.log("DEVICE API ends---------------------------------------------------------------------------------");
                                             //res.status(200).json(result.insertId);
                                         }
                                       });

                                   }
                               });
             }
             else
             {
                                data["Data"] = "Authentication failed!";
                                console.log("Authentication failed!");
                                res.json(data);
                                console.log("DEVICE API ends---------------------------------------------------------------------------------");

              }
 });
});


app.post('/fetchAppUserDetail',function(req, res){
    //moment().format() = dt.format('Y-m-d H:M:S');
    console.log("fetchAppUserDetail API : ",moment().format());
    console.log("fetchAppUserDetail API starts---------------------------------------------------");
		const device_id = req.body.device_id;
		const active_status = req.body.active_status;
		const date_time = req.body.date_time;
    const project_token = req.headers['authorization'];
    var data = {
        "Data":""
    };
    connection.query('SELECT * from deviceinfodatas WHERE device_id=? and project_token=?',[device_id, project_token],function(err, rows1, fields){

    if(rows1.length != 0)
                {

                             if(active_status === "yes"){
                                var sql = 'INSERT INTO activedevicedetails SET ?';
                                const  values = {
                                deviceid: rows1[0].id,
                                date_time: date_time
                                };

                                connection.query(sql, values, function(error, result){
                                  if(!!error){
                                      console.log('Error in the query');
                                      res.send("Error in the query");
                                      console.log("fetchAppUserDetail API ends----------------------------------------------------");
                                  }else{
                                      console.log('Adding values to activedevicedetails when active_status is yes');
                                      data["Data"] = "Adding values to activedevicedetails when active_status is yes ";
                                      res.json(data);
                                      console.log(result.insertId);
                                        // console.log(query.sql);
                                       // data["Data"] = "Token not same. So incrementing the uninstall count by 1 ";

                                      console.log("fetchAppUserDetail API ends----------------------------------------------------");
                                  }
                                });
                             }
                             else{
                               data["Data"] = "active_status is no. No updates. ";
                                 console.log('active_status is no. No updates. ');
                               res.json(data);
                               console.log("fetchAppUserDetail API ends----------------------------------------------------");

                             }

                }
                else
                {
                            data["Data"] = "Authentication failed!";
                            console.log("Authentication failed!");
                            res.json(data);
                            console.log("fetchAppUserDetail API ends----------------------------------------------------");
                }
});
});


app.post('/refferrer',function(req, res){
    //moment().format() = dt.format('Y-m-d H:M:S');
    console.log("refferrer API : ",moment().format());
    console.log("refferrer API starts------------------------------------------------------------------");
    const project_token = req.headers['authorization'];
    const device_id = req.body.device_id;
		const date_time = req.body.date_time;
    const install_refferrer = req.body.install_refferrer;
		const install_refferrer_test = req.body.install_refferrer_test;

    var data = {
        "Data":""
    };
    connection.query("SELECT * FROM deviceinfodatas where device_id=? and project_token=?",[device_id, project_token],function(err, result, fields){  console.log(result.length);
                      if(result.length != 0){
                                  const id = result[0].id;
                                  console.log("Device ID of ", device_id, " is ", id);
                                  var sql_new = 'INSERT INTO refferrer SET ?';
                                  const  values_new = {
                                  deviceid: id,
                                  install_refferrer: install_refferrer,
                                  install_refferrer_test : install_refferrer_test,
                                  date_time: date_time
                                   };

                                  connection.query(sql_new, values_new, function(error_new, out_new){

                                    if(!!error_new){
                                        console.log('Error in the query while adding refferrer data to refferrer table');
                                        data["Data"] = "Error in the query while adding refferrer data to refferrer table ";
                                        //res.json(data);
                                        console.log("refferrer API ends----------------------------------------------------------------");
                                        //res.send("Error in the query");
                                    }else{
                                       console.log(out_new);
                                       console.log(out_new.insertId);

                                        data["Data"] = "refferrer data is pushed ";
                                        res.json(data);
                                        console.log("refferrer API ends----------------------------------------------------------------");
                                    }
                                   });
                               }
                               else {
                                data["Data"] = "Authentication failed!";
                                console.log("Authentication failed!");
                                //data["Data"] = "Device doesn't exist in database. Please contact system administrator!";
                                res.json(data);
                                console.log("refferrer API ends----------------------------------------------------------------");
                               }
   });
});



app.post('/events',function(req, res){
    //moment().format() = dt.format('Y-m-d H:M:S');
    console.log("events API : ",moment().format());
    console.log("Events API starts------------------------------------------------------------------");
    const project_token = req.headers['authorization'];
    const device_id = req.body.device_id;
    const event_type = req.body.event_type;
		const event_name = req.body.event_name;
		const date_time = req.body.date_time;


    var data = {
        "Data":""
    };

    connection.query("SELECT * FROM deviceinfodatas where device_id=? and project_token=?",[device_id, project_token],function(err, result, fields){

                      //console.log(result[0]);
                      console.log(device_id);
                      console.log(event_type);
                      console.log(event_name);

                      //var sql = 'SELECT events.id, events.deviceid from events, deviceinfodatas where  deviceinfodatas.id = events.deviceid and device_id =? and event_type=? and event_name=? ';
                      console.log(result.length);
                      if(result.length != 0){
                                  const id = result[0].id;
                                  console.log("Device ID of ", device_id, " is ", id);
                                  //new code for event_new goes here start
                                  var sql_new = 'INSERT INTO events_new SET ?';
                                  const  values_new = {
                                  deviceid: id,
                                  event_type: event_type,
                                  event_name : event_name,
                                  date_time: date_time
                                   };

                                  connection.query(sql_new, values_new, function(error_new, out_new){

                                    if(!!error_new){
                                        console.log('Error in the query while adding Events_new data to Events_new table');
                                        data["Data"] = "Error in the query while adding Events_new data to Events_new table ";
                                        //res.json(data);
                                        console.log("Events_new API ends----------------------------------------------------------------");
                                        //res.send("Error in the query");
                                    }else{
                                       console.log(out_new);
                                       console.log(out_new.insertId);

                                        data["Data"] = "Event_new data is pushed ";
                                        res.json(data);
                                        console.log("Events_new API ends----------------------------------------------------------------");
                                    }
                                   });
                                   //code ends here
                                  // connection.query(sql,[device_id,event_type,event_name],function(err, rows, fields){
                                  //   console.log("Checking event.....");
                                  // //  console.log(rows.length);
                                  // //  console.log(err);
                                  //   //console.log(fields);
                                  //
                                  //    if(rows.length != 0){
                                  //        console.log(rows[0].deviceid);
                                  //        var sql = 'INSERT INTO eventsdetails SET ?';
                                  //        const  values = {
                                  //        eventsid: rows[0].id,
                                  //        date_time: date_time
                                  //         };
                                  //
                                  //        connection.query(sql, values, function(error, result){
                                  //          if(error){
                                  //              console.log('Error in the query while inserting into eventsdetails table');
                                  //              data["Data"] = "Error in the query while inserting into eventsdetails table ";
                                  //              res.json(data);
                                  //              console.log("Events API ends----------------------------------------------------------------");
                                  //             // res.send("Error in the query");
                                  //          }else{
                                  //              console.log('Device event is present so inserting data into eventsdetail table');
                                  //              data["Data"] = "Device event is present so inserting data into eventsdetail table ";
                                  //              res.json(data);
                                  //              console.log("Events API ends----------------------------------------------------------------");
                                  //              //console.log(result.insertId);
                                  //              //res.status(200).json(result.insertId);
                                  //          }
                                  //
                                  //        });
                                  //
                                  //        //res.json(data);
                                  //    }
                                  //    else
                                  //    {
                                  //                var sql = 'INSERT INTO events SET ?';
                                  //                const  values = {
                                  //                deviceid: id,
                                  //                event_type: event_type,
                                  //                event_name : event_name
                                  //                 };
                                  //
                                  //                connection.query(sql, values, function(error, out){
                                  //
                                  //                  if(!!error){
                                  //                      console.log('Error in the query while adding data to events table');
                                  //                      data["Data"] = "Error in the query while adding data to events table ";
                                  //                      res.json(data);
                                  //                      console.log("Events API ends----------------------------------------------------------------");
                                  //                      //res.send("Error in the query");
                                  //                  }else{
                                  //                     console.log(out);
                                  //                     console.log(out.insertId);
                                  //                     console.log('"Event for this devivce is not present, create new eventname for this device, save');
                                  //
                                  //                      const  val = {
                                  //                              eventsid: out.insertId,
                                  //                              date_time: date_time
                                  //                       };
                                  //                     connection.query('INSERT INTO eventsdetails SET ?', val, function(error, res){});
                                  //                      //res.status(200).json(result.insertId);
                                  //                      data["Data"] = "Event for this devivce is not present, create new eventname for this device, save ";
                                  //                      res.json(data);
                                  //                      console.log("Events API ends----------------------------------------------------------------");
                                  //                  }
                                  //                 });
                                  //               }
                                  //              });
                               }
                               else {
                                data["Data"] = "Authentication failed!";
                                console.log("Authentication failed!");
                                //data["Data"] = "Device doesn't exist in database. Please contact system administrator!";
                                res.json(data);
                                console.log("Events API ends----------------------------------------------------------------");
                               }
   });
});

// app.post('/events',function(req, res){
//     console.log("events API : ",moment().format());
//     console.log("Events API starts------------------------------------------------------------------");
//     const project_token = req.headers['authorization'];
//     const device_id = req.body.device_id;
//     const event_type = req.body.event_type;
// 		const event_name = req.body.event_name;
// 		const date_time = req.body.date_time;
//
//
//     var data = {
//         "Data":""
//     };
//
//     connection.query("SELECT * FROM deviceinfodatas where device_id=? and project_token=?",[device_id, project_token],function(err, result, fields){
//
//                       //console.log(result[0]);
//
//                       console.log(device_id);
//                       console.log(event_type);
//                       console.log(event_name);
//
//
//                       var sql = 'SELECT events.id, events.deviceid from events, deviceinfodatas where  deviceinfodatas.id = events.deviceid and device_id =? and event_type=? and event_name=? ';
//                       console.log(result.length);
//                       if(result.length != 0){
//                                   const id = result[0].id;
//                                   console.log("Device ID of ", device_id, " is ", id);
//                                   //new code for event_new goes here start
//                                   var sql_new = 'INSERT INTO events_new SET ?';
//                                   const  values_new = {
//                                   deviceid: id,
//                                   event_type: event_type,
//                                   event_name : event_name,
//                                   date_time: date_time
//                                    };
//
//                                   connection.query(sql_new, values_new, function(error_new, out_new){
//
//                                     if(!!error_new){
//                                         console.log('Error in the query while adding Events_new data to Events_new table');
//                                         data["Data"] = "Error in the query while adding Events_new data to Events_new table ";
//                                         //res.json(data);
//                                         console.log("Events_new API ends----------------------------------------------------------------");
//                                         //res.send("Error in the query");
//                                     }else{
//                                        console.log(out_new);
//                                        console.log(out_new.insertId);
//
//                                         data["Data"] = "Event_new data is pushed ";
//                                         //res.json(data);
//                                         console.log("Events_new API ends----------------------------------------------------------------");
//                                     }
//                                    });
//                                    //code ends here
//                                   connection.query(sql,[device_id,event_type,event_name],function(err, rows, fields){
//                                     console.log("Checking event.....");
//                                   //  console.log(rows.length);
//                                   //  console.log(err);
//                                     //console.log(fields);
//
//                                      if(rows.length != 0){
//                                          console.log(rows[0].deviceid);
//                                          var sql = 'INSERT INTO eventsdetails SET ?';
//                                          const  values = {
//                                          eventsid: rows[0].id,
//                                          date_time: date_time
//                                           };
//
//                                          connection.query(sql, values, function(error, result){
//                                            if(error){
//                                                console.log('Error in the query while inserting into eventsdetails table');
//                                                data["Data"] = "Error in the query while inserting into eventsdetails table ";
//                                                res.json(data);
//                                                console.log("Events API ends----------------------------------------------------------------");
//                                               // res.send("Error in the query");
//                                            }else{
//                                                console.log('Device event is present so inserting data into eventsdetail table');
//                                                data["Data"] = "Device event is present so inserting data into eventsdetail table ";
//                                                res.json(data);
//                                                console.log("Events API ends----------------------------------------------------------------");
//                                                //console.log(result.insertId);
//                                                //res.status(200).json(result.insertId);
//                                            }
//
//                                          });
//
//                                          //res.json(data);
//                                      }
//                                      else
//                                      {
//                                                  var sql = 'INSERT INTO events SET ?';
//                                                  const  values = {
//                                                  deviceid: id,
//                                                  event_type: event_type,
//                                                  event_name : event_name
//                                                   };
//
//                                                  connection.query(sql, values, function(error, out){
//
//                                                    if(!!error){
//                                                        console.log('Error in the query while adding data to events table');
//                                                        data["Data"] = "Error in the query while adding data to events table ";
//                                                        res.json(data);
//                                                        console.log("Events API ends----------------------------------------------------------------");
//                                                        //res.send("Error in the query");
//                                                    }else{
//                                                       console.log(out);
//                                                       console.log(out.insertId);
//                                                       console.log('"Event for this devivce is not present, create new eventname for this device, save');
//
//                                                        const  val = {
//                                                                eventsid: out.insertId,
//                                                                date_time: date_time
//                                                         };
//                                                       connection.query('INSERT INTO eventsdetails SET ?', val, function(error, res){});
//                                                        //res.status(200).json(result.insertId);
//                                                        data["Data"] = "Event for this devivce is not present, create new eventname for this device, save ";
//                                                        res.json(data);
//                                                        console.log("Events API ends----------------------------------------------------------------");
//                                                    }
//                                                   });
//                                                 }
//                                                });
//                                }
//                                else {
//                                 data["Data"] = "Authentication failed!";
//                                 console.log("Authentication failed!");
//                                 //data["Data"] = "Device doesn't exist in database. Please contact system administrator!";
//                                 res.json(data);
//                                 console.log("Events API ends----------------------------------------------------------------");
//                                }
//    });
// });



app.post('/session',function(req, res){
    //moment().format() = dt.format('Y-m-d H:M:S');
    console.log("sessions API : ",moment().format());
    console.log("SESSION REPORT API START---------------------------------------------------------");
    const project_token = req.headers['authorization'];
    const device_id = req.body.device_id;
    const start_time =  req.body.start_time;
    const end_time =  req.body.end_time;
    const session_duration =  req.body.session_length;

    var data = {
        "Data":""
    };

    connection.query('SELECT * from deviceinfodatas where device_id=? and project_token=?',[device_id, project_token],function(err, rows, fields){

    //console.log(rows[0]);
    if(rows.length !=0)
    {
                const values = {
                  deviceid: rows[0].id,
                  start_time : start_time,
                  end_time: end_time,
                  session_duration:session_duration
                };
                  //console.log(values);

                connection.query('INSERT INTO sessions SET ?', values,function(error, result){
                console.log(result);
                //console.log(error);
                   if(!!error){
                      data["Data"] = error;
                      console.log(data);
                      res.json(data);
                        console.log("SESSION REPORT API ends---------------------------------------------------------");

                   }
                   else {
                      data["Data"] = "Session data pushed to database";
                      console.log(data);
                      res.json(data);
                      console.log("SESSION REPORT API ends---------------------------------------------------------");
                   }
                 });

        }
        else {
              data["Data"] = "Authentication failed!";
              console.log("Authentication failed!");
              console.log("SESSION REPORT API ends---------------------------------------------------------");
              res.json(data);
        }

       });
});


app.post('/crashreport',function(req, res){
    //moment().format() = dt.format('Y-m-d H:M:S');
    console.log("crashreport API : ",moment().format());
    console.log("CRASH REPORT API START-----------------------------------------------------------");
    const project_token = req.headers['authorization'];
    const device_id = req.body.device_id;
		const reason = req.body.reason;
		const date_time = req.body.date_time;
    var data = {
        "Data":""
    };

    connection.query('SELECT * from deviceinfodatas where device_id=? and  project_token=?',[device_id, project_token],function(err, rows, fields){
      if(rows.length !=0)
      {
                      console.log(rows[0]);
                      const values = {
                        deviceid: rows[0].id,
                        reason : reason,
                        created_at:date_time
                      };
                        //console.log(values);

                      connection.query('INSERT INTO crashreports SET ?', values,function(error, result){
                      console.log(result);
                      //console.log(error);
                         if(!!error){
                            data["Data"] = "Crash report not updated. Please check";
                            console.log(data);
                            res.json(data);
                            console.log("CRASH REPORT API ENDS-------------------------------------------------------------");

                         }
                         else {
                            data["Data"] = "Crash report pushed to database";
                            console.log(data);
                            res.json(data);
                            console.log("CRASH REPORT API ENDS-------------------------------------------------------------");
                         }
                       });
              }

   });
});


app.post('/uninstallcount',function(req, res){
    //moment().format() = dt.format('Y-m-d H:M:S');
    console.log("uninstallcount API : ",moment().format());
    console.log("UNINSTALL COUNT API START--------------------------------------------------------");
    const project_token = req.headers['authorization'];
    const device_id = req.body.device_id;
		const push_token = req.body.push_token;
    const package_name = req.body.package_name;
    const date_time = req.body.date_time;
    var data = {
        "Data":""
    };
    console.log(project_token);
      console.log(device_id);
    connection.query('SELECT * from deviceinfodatas where device_id=? and project_token=?',[device_id, project_token],function(err, result, fields){
    if(result.length == 1){
    connection.query('SELECT deviceinfodatas.id, uninstallcounts.push_token, uninstallcounts.uninstall_count  from deviceinfodatas, uninstallcounts where deviceinfodatas.id = uninstallcounts.deviceid and  deviceinfodatas.device_id=? and deviceinfodatas.project_token=?',[device_id, project_token],function(error, rows, fields){
    if(rows.length == 0){
      console.log("No record found");
      const values = {
        deviceid: result[0].id,
        push_token : push_token,
        package_name:package_name,
        created_at:date_time
      };
      connection.query('INSERT INTO uninstallcounts SET ?', values,function(error, result){
      console.log(result);
      //console.log(error);
         if(!!error){
            data["Data"] = "Uninstall Count not updated. Please check";
            console.log(data);
            res.json(data);
             console.log("UNINSTALL COUNT API ENDS----------------------------------------------------------");

         }
         else {

            data["Data"] = "Uninstall Count data pushed to database";
            console.log(data);
            res.json(data);
             console.log("UNINSTALL COUNT API ENDS----------------------------------------------------------");
         }
       });
    }
    else {
      console.log(rows.length);
      console.log(rows[0].push_token);
      var uninstall_count = rows[0].uninstall_count;
      if(rows[0].push_token === req.body.push_token){
        data["Data"] = "No chnage in push_token. ";
        res.json(data);
         console.log("UNINSTALL COUNT API ENDS----------------------------------------------------------");
      }else{
        uninstall_count++;
        var post = {
              push_token:push_token,
              uninstall_count: uninstall_count,
              updated_at:date_time
            };
        var condition = {deviceid: result[0].id};
        var sql = "UPDATE uninstallcounts SET uninstall_count = ?  WHERE address = 'Valley 345'";
        var query = connection.query('UPDATE uninstallcounts SET ? WHERE ?', [post, condition] , function(err, result) {});
        console.log(query.sql);
        data["Data"] = "Token not same. So incrementing the uninstall count by 1 ";
        res.json(data);
         console.log("UNINSTALL COUNT API ENDS----------------------------------------------------------");
      }
    }
   });
 }
 else {
   data["Data"] = "Authentication failed!";
   console.log("Authentication failed!");
   res.json(data);
    console.log("UNINSTALL COUNT API ENDS----------------------------------------------------------");
 }


});
});

app.post('/screenview',function(req, res){
    //moment().format() = dt.format('Y-m-d H:M:S');
    console.log("screenview API : ",moment().format());
    console.log("SCREENVIEW API START-------------------------------------------------------------");
    const project_token = req.headers['authorization'];
    const device_id = req.body.device_id;
		const screen_name = req.body.screen_name;
    const date_time = req.body.date_time;
    var data = {
        "Data":""
    };

    connection.query("SELECT * FROM deviceinfodatas where device_id=? and project_token=?",[device_id, project_token],function(err, result, fields){
      //console.log(result[0]);

      console.log(device_id);
      console.log(screen_name);
      console.log(date_time);
      var sql = 'SELECT screenviews.id, screenviews.deviceid from screenviews, deviceinfodatas where  deviceinfodatas.id = screenviews.deviceid and device_id =? and screen_name =?';
      console.log(result.length);
      if(result.length != 0){
                  const id = result[0].id;
                  console.log("Device ID of ", device_id, " is ", id);
                  connection.query(sql,[device_id, screen_name],function(err, rows, fields){
                    console.log("Checking screenviews.....");
                    console.log(rows.length);
                    console.log(err);
                    //console.log(fields);

                     if(rows.length != 0){
                         console.log(rows[0].id);
                         var sql = 'INSERT INTO screenviewsdetails SET ?';
                         const  values = {
                         screenviewsid: rows[0].id,
                         date_time: date_time
                          };

                         connection.query(sql, values, function(error, result){
                           if(error){
                               console.log(error);
                               console.log('Error in the query while inserting into screenviewsdetails table');
                               console.log("SCREENVIEW API ENDS---------------------------------------------------");
                              // res.send("Error in the query");
                           }else{
                               console.log('Screen view data is present so inserting data into screenviewsdetails table');
                               data["Data"] = "Screen view data is present so inserting data into screenviewsdetails table ";
                               res.json(data);
                               console.log("SCREENVIEW API ENDS---------------------------------------------------");
                               //console.log(result.insertId);
                               //res.status(200).json(result.insertId);
                           }

                         });

                         //res.json(data);
                     }
                     else
                     {
                                 var sql = 'INSERT INTO screenviews SET ?';
                                 const  values = {
                                 deviceid: id,
                                 screen_name: screen_name
                                  };

                                 connection.query(sql, values, function(error, out){

                                   if(!!error){
                                       console.log('Error in the query');
                                       console.log("SCREENVIEW API ENDS---------------------------------------------------");
                                       //res.send("Error in the query");
                                   }else{
                                      console.log(out);
                                      console.log(out.insertId);
                                      console.log('Screenview for this devivce is not present, create new screenview for this device, save');

                                       const  val = {
                                               screenviewsid: out.insertId,
                                               date_time: date_time
                                        };
                                      connection.query('INSERT INTO screenviewsdetails SET ?', val, function(error, res){});
                                       //res.status(200).json(result.insertId);
                                       data["Data"] = "Screenview for this devivce is not present, create new screenview for this device, save ";
                                       res.json(data);
                                       console.log("SCREENVIEW API ENDS---------------------------------------------------");
                                   }
                                  });
                                }
                               });
               }
               else {
                data["Data"] = "Authentication failed!";
                console.log("Authentication failed!");
                console.log("SCREENVIEW API ENDS---------------------------------------------------");
                res.json(data);
               }

            });

});
