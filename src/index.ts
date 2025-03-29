import { Server } from "./server";

async function main() {
  try {
    const server = new Server();
    await server.start();
    console.log("EvoComms service started successfully");
  } catch (error) {
    console.error("Failed to start EvoComms service:", error);
    process.exit(1);
  }
}

main();
