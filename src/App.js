/*
 * Nós vamos precisar usar estados agora! Não esqueça de importar useState
 */
import React, { useEffect, useState } from "react";
import "./App.css";
import SelectCharacter from "./Components/SelectCharacter";
import twitterLogo from "./assets/twitter-logo.svg";
//import { CONTRACT_ADDRESS } from "./constants";
import myEpicGame from "./utils/MyEpicGame.json";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants"
import Arena from './Components/Arena';
import LoadingIndicator from "./Components/LoadingIndicator";



// Constantes
const TWITTER_HANDLE = "Web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * Só uma variável de estado que vamos usar para armazenar a carteira pública do usuário.
   */
  const [currentAccount, setCurrentAccount] = useState(null);

  /*
   * Já que esse método vai levar um tempo, lembre-se de declará-lo como async
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Eu acho que você não tem a metamask!");
        return;
      } else {
        console.log("Nós temos o objeto ethereum", ethereum);

        /*
         * Checa se estamos autorizados a acessar a carteira do usuário.
         */
        const accounts = await ethereum.request({ method: "eth_accounts" });

        /*
         * Usuário pode ter múltiplas contas autorizadas, pegamos a primeira se estiver ali!
         */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Carteira conectada::", account);
          setCurrentAccount(account);
        } else {
          console.log("Não encontramos uma carteira conectada");
        }
      }
    } catch (error) {
      console.log(error);
    }
     /*
   * Nós lançamos a propriedade de estado depois de toda lógica da função
   */
  setIsLoading(false);
  };
  /*
 * Logo abaixo da conta, configure essa propriedade de novo estado.
 */
const [characterNFT, setCharacterNFT] = useState(null);

/*
 * Nova propriedade de estado adicionado aqui
 */
const [isLoading, setIsLoading] = useState(false);
  // Métodos de renderização

const renderContent = () => {
  /*
   * Se esse app estiver carregando, renderize o indicador de carregamento
   */
  if (isLoading) {
    return <LoadingIndicator />;
  }

  /*
   * cenário #1
   */
  if (!currentAccount) {
    return (
      <div className="connect-wallet-container">
        <img
          src="https://thumbs.gfycat.com/AcrobaticDesertedArawana-size_restricted.gif"
          alt="Jeremias Gif"
        />
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          Conecte sua carteira para começar
        </button>
      </div>
    );
  } else if (currentAccount && !characterNFT) {
    return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
	/*
	* Se tiver uma carteira conectada e um personagem NFT, é hora de batalhar!
	*/
  } else if (currentAccount && characterNFT) {
    return <Arena characterNFT={characterNFT} />;
  }
};
/*
 * Adicione esse useEffect logo embaixo do outro useEffect que você está chamando checkIfWalletIsConnected
 */
useEffect(() => {
  /*
   * A função que vamos chamar que interage com nosso contrato inteligente
   */
  const fetchNFTMetadata = async () => {
    console.log("Verificando pelo personagem NFT no endereço:", currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    const txn = await gameContract.checkIfUserHasNFT();
    if (txn.name) {
      console.log("Usuário tem um personagem NFT");
      setCharacterNFT(transformCharacterData(txn));
    } else {
      console.log("Nenhum personagem NFT foi encontrado");
    }
  };

  /*
   * Nós so queremos rodar isso se tivermos uma wallet conectada
   */
  if (currentAccount) {
    console.log("Conta Atual:", currentAccount);
    fetchNFTMetadata();
  }
    /*
   * Quando nosso componente for montado, tenha certeza de configurar o estado de carregamento
   */
    setIsLoading(true);
    checkIfWalletIsConnected();
}, [currentAccount]);
const fetchNFTMetadata = async () => {
  console.log("Verificando pelo personagem NFT no endereço:", currentAccount);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const gameContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    myEpicGame.abi,
    signer
  );

  const txn = await gameContract.checkIfUserHasNFT();
  if (txn.name) {
    console.log("Usuário tem um personagem NFT");
    setCharacterNFT(transformCharacterData(txn));
  } else {
    console.log("Nenhum personagem NFT foi encontrado");
  }
};

  /*
   * Implementa o seu método connectWallet aqui
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Instale a MetaMask!");
        return;
      }

      /*
       * Método chique para pedir acesso para a conta.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! Isso deve escrever o endereço público uma vez que autorizarmos Metamask.
       */
      console.log("Contectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
      /*
   * Quando nosso componente for montado, tenha certeza de configurar o estado de carregamento
   */
  setIsLoading(true);
  checkIfWalletIsConnected();
  }, []);

  return (
  <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header gradient-text">⚔️ Metaverso Da Cana ⚔️</p>
        <p className="sub-text">Junte os pastores e proteja o Metaverso da cana!!!</p>
        {/*
         * Aqui é onde nosso botão e código de imagem ficava! Lembre-se que movemos para o método de renderização.
         */}
        {renderContent()}
      </div>
      <div className="footer-container">
        <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built with @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  </div>
);
};


export default App;