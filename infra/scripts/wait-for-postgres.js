const { exec } = require("child_process");

async function checkServices() {
  console.log("\n🟦 Cheking Postgres");
  checkPostgres();
}

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      checkPostgres();
      process.stdout.write(".");
      return;
    }

    console.log("\n🟩 Postgres ready 💾");
  }
}

checkServices();
