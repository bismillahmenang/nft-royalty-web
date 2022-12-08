export function getNFTIdFromURL(url) {
  const tempURL = new URL(url)
  let newURL = ""
  switch (tempURL.hostname) {
    case "magiceden.io":
      newURL = tempURL.pathname.split("/")[2]
      break
    case "solanart.io":
      newURL = tempURL.pathname.split("/")[2]
      break
    case "coralcube.io":
      newURL = tempURL.pathname.split("/")[2]
      break
    case "www.yawww.io":
      newURL = tempURL.pathname.split("/")[3]
      break
    case "opensea.io":
      newURL = tempURL.pathname.split("/")[3]
      break

  }
  return newURL
}

export function getCollectionName(collection_name) {
  return collection_name.split("/")[1]
}

export function lamportsToSol(lamports) {
  return lamports / 1000000000
}

export function ISOdateToReadable(isoTimestamp) {
    const date = new Date(isoTimestamp);
    const options = {
        weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
    };
    const readableDate = date.toLocaleDateString("en-US", options);
    return readableDate;

}

export  function truncateInTheMiddle(fullStr, strLen, separator) {
    if (fullStr.length <= strLen) return fullStr;

    separator = separator || '...';

    const sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow/2),
        backChars = Math.floor(charsToShow/2);

    return fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars);
}

export function isoToDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
}

export function sortDate(arr){
    return arr.sort((a, b) => {
        // Convert the timestamps to Date objects
    var dateA = new Date(a.time);
    var dateB = new Date(b.time);

    // Compare the dates and return either -1, 0, or 1
    // depending on whether dateA is before, the same as,
    // or after dateB
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
    });
}


// Sort the array in ascending order by timestamp



