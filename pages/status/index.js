import useSWR from "swr";

const loadingText = "Carregando...";
async function fetchApi(key) {
  const res = await fetch(key);
  const resBody = await res.json();

  return resBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });
  let updatedAtText = loadingText;

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-br");
  }

  return <div>Última atualização {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });

  if (!isLoading && data) {
    const databaseVersion = data.dependencies.database.version;
    const maxConnections = data.dependencies.database.max_connections;
    const currentConnections = data.dependencies.database.current_connections;
    return (
      <div>
        <h1>Database</h1>
        <p>Database Version {databaseVersion}</p>
        <p>Database Max Connections {maxConnections}</p>
        <p>Database Current Connections {currentConnections}</p>
      </div>
    );
  }
  
  return (
    <>
      <h1>Database</h1>
      <div>{loadingText}</div>
    </>
  );
}
