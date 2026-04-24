import axios from "axios";

const TOTAL_ORDERS = 50;
const GATEWAY_URL = "http://localhost:5000/api/order/create";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTMwNWNlNGJhM2EzMDIyOGVkN2RhNiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc3MDI5NzUzLCJleHAiOjE3NzcwMzI3NTN9.8RGbptP6BMkZJqyPj1QbeEaOXtdM8ndCbQmoC_L-NDY";

const payload = {
    items: [
        { 
            product_id: "69cd25dd5fa31220f9200f0b", 
            quantity: 1,
            name: "Test Product",
            price: 100,
            image: "test.jpg"
        }
    ],
    items_total: 100,
    shipping_address: {
        full_name: "Research Tester",
        phone: "9876543210",
        address_line_1: "123 Kafka Lane",
        city: "Pune",
        state: "Maharashtra",
        pin_code: "411001",
        country: "India"
    }
};

async function runLoadTest() {
  console.log(
    `Starting Hypothesis 2 Load Test: Sending ${TOTAL_ORDERS} requests...`,
  );
  console.log(`Target: Measuring Gateway Latency Stability`);

  const startTime = Date.now();
  let successCount = 0;
  let errorCount = 0;

  const requests = Array.from({ length: TOTAL_ORDERS }).map(async (_, i) => {
    await new Promise((resolve) => setTimeout(resolve, i * 100));

    try {
      const response = await axios.post(GATEWAY_URL, payload, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        successCount++;
        console.log(`Order ${i + 1}: Created (Status 201)`);
      }
    } catch (error) {
      errorCount++;
      const errorDetail = error.response
        ? JSON.stringify(error.response.data)
        : error.message;
      console.error(`Order ${i + 1}: Failed - ${errorDetail}`);
    }
  });

  await Promise.all(requests);

  const endTime = Date.now();
  const totalTimeSeconds = (endTime - startTime) / 1000;

  console.log("\n--- LOAD TEST SUMMARY ---");
  console.log(`Total Requests: ${TOTAL_ORDERS}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failures: ${errorCount}`);
  console.log(`Total Execution Time: ${totalTimeSeconds.toFixed(2)}s`);
  console.log(
    `Throughput: ${(successCount / totalTimeSeconds).toFixed(2)} orders/sec`,
  );
  console.log("---------------------------\n");
  console.log(
    "Check your api-gateway/gateway_performance.csv for the detailed ms results.",
  );
}

runLoadTest();
