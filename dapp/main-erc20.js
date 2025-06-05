const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");

// Dirección del contrato ERC20
const erc20Address = "0x82ce2F45F289Db7F050CeBEdeFee3f9C3fF72a08";

// ABI mínima para balanceOf y symbol
const erc20Abi = [
  "function balanceOf(address) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

const walletInput = document.getElementById("walletInput");
const checkButton = document.getElementById("checkButton");

const walletDisplay = document.getElementById("walletDisplay");
const tokenSymbol = document.getElementById("tokenSymbol");
const tokenBalance = document.getElementById("tokenBalance");

checkButton.addEventListener("click", async () => {
  const address = walletInput.value.trim();

  if (!ethers.isAddress(address)) {
    alert("Dirección inválida");
    return;
  }

  try {
    const contract = new ethers.Contract(erc20Address, erc20Abi, provider);

    const [symbol, decimals, rawBalance] = await Promise.all([
      contract.symbol(),
      contract.decimals(),
      contract.balanceOf(address)
    ]);

    const formattedBalance = ethers.formatUnits(rawBalance, decimals);

    walletDisplay.textContent = address;
    tokenSymbol.textContent = symbol;
    tokenBalance.textContent = `${formattedBalance} ${symbol}`;

  } catch (err) {
    console.error("Error al consultar el contrato:", err);
    alert("Error al consultar el token ERC20");
  }
});