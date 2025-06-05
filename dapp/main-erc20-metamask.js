const erc20Address = "0x82ce2F45F289Db7F050CeBEdeFee3f9C3fF72a08";
const destination = "0x1234567890abcdef1234567890abcdef12345678"; // <-- Cambiar por dirección real

const erc20Abi = [
  "function balanceOf(address) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

const connectButton = document.getElementById("connectButton");
const sendButton = document.getElementById("sendButton");
const accountDisplay = document.getElementById("account");
const tokenSymbol = document.getElementById("tokenSymbol");
const tokenBalance = document.getElementById("tokenBalance");
const statusMessage = document.getElementById("statusMessage");

let provider;
let signer;
let contract;
let decimals;
let symbol;
let userAccount;

connectButton.addEventListener("click", async () => {
  if (!window.ethereum) {
    alert("MetaMask no está instalado.");
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    userAccount = accounts[0];

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new ethers.Contract(erc20Address, erc20Abi, signer);

    [symbol, decimals] = await Promise.all([
      contract.symbol(),
      contract.decimals()
    ]);

    const rawBalance = await contract.balanceOf(userAccount);
    const formattedBalance = ethers.formatUnits(rawBalance, decimals);

    accountDisplay.textContent = userAccount;
    tokenSymbol.textContent = symbol;
    tokenBalance.textContent = `${formattedBalance} ${symbol}`;
    sendButton.style.display = "inline-block";
    statusMessage.textContent = "";

  } catch (err) {
    console.error("Error al conectar:", err);
    alert("Error al consultar saldo ERC20");
  }
});

sendButton.addEventListener("click", async () => {
  try {
    statusMessage.textContent = "⏳ Enviando tokens...";
    const amount = ethers.parseUnits("10", decimals); // 10 FER
    const tx = await contract.transfer(destination, amount);
    await tx.wait();

    statusMessage.textContent = `✅ 10 ${symbol} enviados a ${destination}`;
    const updatedBalance = await contract.balanceOf(userAccount);
    tokenBalance.textContent = `${ethers.formatUnits(updatedBalance, decimals)} ${symbol}`;
  } catch (err) {
    console.error("Error al enviar tokens:", err);
    statusMessage.textContent = "❌ Error al enviar tokens.";
  }
});