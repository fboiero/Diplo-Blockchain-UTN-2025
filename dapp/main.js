const connectButton = document.getElementById("connectButton");
const walletAddressDisplay = document.getElementById("walletAddress");
const balanceDisplay = document.getElementById("balance");
const accountList = document.getElementById("accountList");
const accountSelector = document.getElementById("accountSelector");

let provider;

connectButton.addEventListener("click", async () => {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask no está instalado");
    return;
  }

  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

   alert(accounts);

    provider = new ethers.BrowserProvider(window.ethereum);

    accountSelector.style.display = "block";
    accountList.innerHTML = "";

    accounts.forEach(account => {
      const option = document.createElement("option");
      option.value = account;
      option.textContent = account;
      accountList.appendChild(option);
    });

    mostrarInfoCuenta(accounts[0]);

  } catch (err) {
    console.error("Error al conectar:", err);
    alert("Error al conectar con MetaMask");
  }
});

accountList.addEventListener("change", (event) => {
  mostrarInfoCuenta(event.target.value);
});

async function mostrarInfoCuenta(address) {
  try {
    walletAddressDisplay.textContent = `Dirección: ${address}`;
    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);
    balanceDisplay.textContent = `Saldo: ${balanceInEth} ETH`;
  } catch (err) {
    console.error("Error al mostrar datos de la cuenta:", err);
  }
}

// Detectar cambios de cuenta desde MetaMask
if (window.ethereum) {
  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length > 0) {
      // Actualiza selector y saldo automáticamente
      accountList.innerHTML = "";
      accounts.forEach(account => {
        const option = document.createElement("option");
        option.value = account;
        option.textContent = account;
        accountList.appendChild(option);
      });
      mostrarInfoCuenta(accounts[0]);
    } else {
      walletAddressDisplay.textContent = "Dirección: -";
      balanceDisplay.textContent = "Saldo: -";
      accountSelector.style.display = "none";
    }
  });
}