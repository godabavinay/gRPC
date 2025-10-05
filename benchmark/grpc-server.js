// grpc-server.js
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

// load proto
const packageDef = protoLoader.loadSync("user.proto", {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObj.user;

// simple in-memory user
const users = new Map();
users.set("1", { id: "1", name: "Alice", email: "alice@example.com" });

const server = new grpc.Server();

server.addService(userPackage.UserService.service, {
  GetUser: (call, callback) => {
    const id = call.request.id;
    const u = users.get(id) || {
      id,
      name: "Unknown",
      email: "unknown@example.com",
    };
    callback(null, u);
  },
});

const addr = "0.0.0.0:50051";
server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) throw err;
  console.log("gRPC server listening on", addr);
  // bindAsync implicitly starts server; server.start() not required
});
