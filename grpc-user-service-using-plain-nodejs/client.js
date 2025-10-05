import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const packageDef = protoLoader.loadSync("user.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.user;

const client = new userPackage.UserService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

client.CreateUser(
  { name: "Alice", email: "alice@example.com" },
  (err, response) => {
    if (err) return console.error(err);
    console.log("Created User: ", response);

    client.GetUser({ id: response.id }, (err2, user) => {
      if (err2) return console.error(err2);
      console.log("Fetched User: ", user);
    });
  }
);

const call = client.ListUsers({}, null);

call.on("data", (user) => {
  console.log("Streamed user: ", user);
});

call.on("end", () => {
  console.log("All users streamed.");
});

const stream = client.CreateUsersStream((err, summary) => {
  if (err) return console.error(err);
  console.log("Created users count: ", summary.createdCount);
});

stream.write({ name: "Bob", email: "bob@example.com" });
stream.write({ name: "Charlie", email: "charlie@example.com" });
stream.end();
