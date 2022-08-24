let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");
let readline = require("readline");
let reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("proto/vacaciones.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

const REMOTE_URL = "0.0.0.0:50050";

let employee = new proto.work_leave.EmployeeLeaveDaysService(REMOTE_URL,
    grpc.credentials.createInsecure());

reader.question("Please enter your id: ", answer1 => {
    reader.question("Please enter your name: ", answer2 => {
        reader.question("Please enter your accrued leave days: ", answer3 => {
            reader.question("Please enter your requested leave days: ", answer4 => {

                employee.eligibleForLeave({ employee_id: answer1, name: answer2, accrued_leave_days: answer3, requested_leave_days: answer4 },
                    (err, res) => {
                        
                        try {
                            if (res.eligible) {
                                employee.grantLeave({ employee_id: answer1, name: answer2, accrued_leave_days: answer3, requested_leave_days: answer4 },
                                    (err, res) => {
                                        console.log(res);
                                    });
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    });
            });
        });
    });
});

