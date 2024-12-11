export const Homepage = () => {
  return (
    <div className="page">
      <div className="page__content">
        <h1>Remix is not available anymore</h1>
        <p>
          We have decided to deprecate our Remix fork in favor of a new plugin we are currently developing. This plugin
          will enable you to develop your contracts directly on the official{' '}
          <a href="https://remix.ethereum.org">Remix IDE</a> by simply loading the fhEVM plugin.
        </p>
        <p>To use it:</p>
        <ol>
          <li>Go to the "Plugin Manager" page</li>
          <li>Click on "Connect to a Local Plugin"</li>
          <li>Fill the name with "Zama" and the "Url" with "https://remix.zama.ai/"</li>
          <li>Keep "Iframe" and "Side panel" and validate</li>
        </ol>
        <p className="center" dir="auto">
          <a href="https://github.com/zama-ai/fhevm/blob/main/fhevm-whitepaper-v2.pdf"> 📃 Read the whitepaper</a> |{' '}
          <a href="https://docs.zama.ai/fhevm" rel="nofollow">
            📒 Documentation
          </a>{' '}
          |{' '}
          <a href="https://zama.ai/community" rel="nofollow">
            💛 Community support
          </a>{' '}
          | <a href="https://github.com/zama-ai/awesome-zama"> 📚 FHE resources by Zama</a>
        </p>
      </div>
    </div>
  );
};
