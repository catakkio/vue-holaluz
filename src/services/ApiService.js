

// export const getClients = async function () {
//   const response = await axios.get('/clients') 
//   return response
// }

// export const getSupplyPoints = async function () {
//   const response = await axios.get('/supply-points')
//   return response
// }

const fetchClients = async function () {
  let clients = [];
  const response = await fetch('/clients')
  if (response.status === 200) { clients = await response.json() }
  return clients;
}

export const getClientByCupsCode = async (cupsCode) => {
  const clients = await fetchClients();

  const matchingClient = Object.values(clients).find((client) => {
    return cupsCode.trim().toUpperCase() == client.cups?.trim().toUpperCase()
  });


  return matchingClient;
}


const getSupplyPoints = async function () {
  let supplyPoints = [];

  const response = await fetch('/supply-points')
  if (response.status == 200) { supplyPoints = await response.json() }
  debugger
  return supplyPoints;
}

export const getSupplyPointsByCupsCode = async function (cupsCode) {
  const supplyPoints = await getSupplyPoints();

  const matchingSupplyPoint = Object.values(supplyPoints).find(
    supplyPoint => supplyPoint.cups?.trim().toUpperCase() == cupsCode.trim().toUpperCase()
  );

  return matchingSupplyPoint;
}

