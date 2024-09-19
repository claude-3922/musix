import { createClient } from "redis";

const client = createClient({
  password: "nsfQRaFIYv6cm5osRlfIZdNnBRXYU4EU",
  socket: {
    host: "redis-11257.c309.us-east-2-1.ec2.redns.redis-cloud.com",
    port: 11257,
  },
});
