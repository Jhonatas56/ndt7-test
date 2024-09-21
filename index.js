import ndt7 from "@m-lab/ndt7";

const runTest = async () => {
  ndt7
    .test(
      {
        userAcceptedDataPolicy: true,
        metadata: {
          client_name: "ndt7-html-example",
        },
      },
      {
        serverChosen: function (server) {
          console.log("Testing to:", {
            machine: server.machine,
            locations: server.location,
          });
          console.log(
            "Testing to: " + server.machine + " (" + server.location.city + ")"
          );
        },
        downloadMeasurement: function (data) {
          if (data.Source === "client") {
            console.log(
              `Download test is ongoing: ${data.Data.MeanClientMbps} Mbps`
            );
          }
        },
        downloadComplete: function (data) {
          // (bytes/second) * (bits/byte) / (megabits/bit) = Mbps
          const serverBw =
            (data.LastServerMeasurement.BBRInfo.BW * 8) / 1000000;
          const clientGoodput = data.LastClientMeasurement.MeanClientMbps;
          const elapsed = data.LastServerMeasurement.TCPInfo.ElapsedTime;
          console.log(
            `Download test completed in ${(elapsed / 1000000).toFixed(2)}s`
          );
          console.log(
            `Download test is complete:
Instantaneous server bottleneck bandwidth estimate: ${serverBw} Mbps
Mean client goodput: ${clientGoodput} Mbps`
          );
          console.log("Download: " + clientGoodput.toFixed(2) + " Mb/s");
        },
        uploadMeasurement: function (data) {
          if (data.Source === "server") {
            console.log(
              "Upload: " +
                (
                  (data.Data.TCPInfo.BytesReceived /
                    data.Data.TCPInfo.ElapsedTime) *
                  8
                ).toFixed(2) +
                " Mb/s"
            );
          }
        },
        uploadComplete: function (data) {
          const bytesReceived =
            data.LastServerMeasurement.TCPInfo.BytesReceived;
          const elapsed = data.LastServerMeasurement.TCPInfo.ElapsedTime;
          // bytes * bits/byte / microseconds = Mbps
          const throughput = (bytesReceived * 8) / elapsed;
          console.log(
            `Upload test completed in ${(elapsed / 1000000).toFixed(2)}s
Mean server throughput: ${throughput} Mbps`
          );
        },
        error: function (err) {
          console.log("Error while running the test:", err.message);
        },
      }
    )
    .then((exitcode) => {
      console.log("ndt7 test completed with exit code:", exitcode);
    });
};

runTest();
