export const fetchClients = async function () {
  let clients = [];

  const response = await fetch("/clients");
  if (response.status === 200) {
    clients = await response.json();
  }
  return clients;
};

export const fetchSupplyPoints = async function () {
  let supplyPoints = [];

  const response = await fetch("/supply-points");
  if (response.status == 200) {
    supplyPoints = await response.json();
  }
  return supplyPoints;
};
