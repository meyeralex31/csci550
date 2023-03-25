
const uniqueProfileId = () => {
    const dateStr = Date.now().toString(36);
    const randomVal = Math.random().toString(36).substr(2);
    return dateStr + randomVal;
  };

module.exports = uniqueProfileId;