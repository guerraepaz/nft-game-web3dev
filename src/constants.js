const CONTRACT_ADDRESS = "0x94A7cD0588740445DF07bD97B39a835c2fBCcCf9";


/*
 * Adicione esse método e tenha certeza de exportá-lo no final!
 */
const transformCharacterData = (characterData) => {
    return {
      name: characterData.name,
      imageURI: characterData.imageURI,
      hp: characterData.hp.toNumber(),
      maxHp: characterData.maxHp.toNumber(),
      attackDamage: characterData.attackDamage.toNumber(),
    };
  };
  
  export { CONTRACT_ADDRESS, transformCharacterData };