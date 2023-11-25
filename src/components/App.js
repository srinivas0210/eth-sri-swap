import React, { useState, useEffect } from "react";
import logo from "../logo.png";
import "./App.css";
import Web3 from "web3";
import EthSriSwap from "../abis/EthSriSwap.json";
import SriToken from "../abis/SriToken.json";

function App() {
  const [ethSriSwap, setEthSriSwap] = useState({});
  const [sriToken, setSriToken] = useState({});

  useEffect(() => {
    const connectToChain = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3)
        window.web3 = new Web3(window.web3.currentProvider);
      else console.log("Non-Ethereum browser detected. ");

      loadWallets();
      loadContracts();
    };

    connectToChain();
  }, []);

  const loadWallets = async () => {
    const web3 = window.web3;
    const wallets = await web3.eth.getAccounts();
    console.log("existing wallets", wallets);
  };

  const loadContracts = async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();

    const _ethSriSwap = new web3.eth.Contract(
      EthSriSwap.abi,
      EthSriSwap.networks[networkId].address
    );

    const bal = await web3.eth.getBalance(_ethSriSwap.address);

    const _sriToken = new web3.eth.Contract(
      SriToken.abi,
      SriToken.networks[networkId].address
    );

    setEthSriSwap(_ethSriSwap);
    setSriToken(_sriToken);

    console.log(_ethSriSwap, _sriToken);
  };

  const buyTokens = async (etherAmount) => {
    await ethSriSwap.methods
      .buyTokens()
      .send({ from: "0xw", value: etherAmount })
      .on("transactionHash", () => {
        // stop loading
      });
  };

  const sellTokens = async (tokenAmount) => {
    await sriToken.methods
      .approve(ethSriSwap.address, tokenAmount)
      .send({ from: "0xw" })
      .on("transactionHash", async () => {
        await ethSriSwap.methods
          .sellTokens(tokenAmount)
          .send({ from: "0xw" })
          .on("transactionHash", () => {
            // stop loading
          });
      });
  };

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dapp University
        </a>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={logo} className="App-logo" alt="logo" />
              </a>
              <h1>Dapp University Starter Kit</h1>
              <p>
                Edit <code>src/components/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                LEARN BLOCKCHAIN{" "}
                <u>
                  <b>NOW! </b>
                </u>
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
