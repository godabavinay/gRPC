import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { v4 as uuidv4 } from "uuid";

const packageDef = protoLoader.loadSync("user.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.user;

const users = new Map();
const server = new grpc.Server();

server.addService(userPackage.UserService.service, {
  CreateUser: (call, callback) => {
    const { name, email } = call.request;
    const id = uuidv4();
    const user = { id, name, email };
    users.set(id, user);
    callback(null, user);
  },

  GetUser: (call, callback) => {
    const { id } = call.request;
    const user = users.get(id);

    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        details: "User not found",
      });
    }

    callback(null, user);
  },

  ListUsers: (call) => {
    for (const user of users.values()) {
      call.write(user);
    }
    call.end();
  },

  CreateUsersStream: (call, callback) => {
    let count = 0;
    call.on("data", (userReq) => {
      const id = uuidv4();
      users.set(id, { id, ...userReq });
      count++;
    });

    call.on("end", () => {
      callback(null, { createdCount: count });
    });
  },
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Server bind failed:", err);
      return;
    }
    console.log(`gRPC server running on port ${port}`);
  }
);
