const addressInput = document.getElementById("addressInput");
const checkButton = document.getElementById("checkButton");
const walletAddressDisplay = document.getElementById("walletAddress");
const balanceDisplay = document.getElementById("balance");

checkButton.addEventListener("click", async () => {
  const address = addressInput.value.trim();

  if (!ethers.isAddress(address)) {
    alert("Dirección inválida.");
    return;
  }

  try {
    // Conexión a Sepolia, o cualquier RPC público
    const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");

    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);

    walletAddressDisplay.textContent = `Dirección: ${address}`;
    balanceDisplay.textContent = `Saldo: ${balanceInEth} ETH`;

  } catch (err) {
    console.error("Error al obtener saldo:", err);
    alert("No se pudo consultar el saldo.");
  }
});