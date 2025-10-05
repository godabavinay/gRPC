// grpc-bench.js
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import pLimit from "p-limit";

const packageDef = protoLoader.loadSync("user.proto", {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObj.user;

const client = new userPackage.UserService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

function getUser(id) {
  return new Promise((resolve, reject) => {
    client.GetUser({ id }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

async function run({ total = 1000, concurrency = 1000 }) {
  const limit = pLimit(concurrency);
  const tasks = [];
  const start = Date.now();

  for (let i = 0; i < total; i++) {
    tasks.push(limit(() => getUser("1")));
  }

  let succeeded = 0;
  let failed = 0;

  try {
    const results = await Promise.allSettled(tasks);
    for (const r of results) {
      if (r.status === "fulfilled") succeeded++;
      else failed++;
    }
  } catch (e) {
    console.error("unexpected error", e);
  }

  const durationMs = Date.now() - start;
  console.log({
    total,
    succeeded,
    failed,
    durationMs,
    qps: (succeeded / (durationMs / 1000)).toFixed(2),
  });
}

const args = process.argv.slice(2);
const total = parseInt(args[0] || "1000", 10);
const concurrency = parseInt(args[1] || "1000", 10);

run({ total, concurrency }).catch(console.error);
