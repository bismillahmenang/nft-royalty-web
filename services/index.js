
export async function getNFTMetadataSolscan(nftAddress){
    const res=await fetch(`https://api.solscan.io/token/meta?token=${nftAddress}`)
    return res.json()

}
export async function getNFTRoyalty(updateAuthority, symbol) {
    const res = await fetch(`https://api.coralcube.cc/0dec5037-f67d-4da8-9eb6-97e2a09ffe9a/inspector/getMintActivities?limit=50&update_authority=${updateAuthority}&collection_symbol=${symbol.toLowerCase().replace(/\s/g, "_")}`)
  return res.json()
}

export async function getNFTRoyaltyFromDeta(updateAuthority, symbol,mintAddress,last){
    const res = await fetch('https://clggjw.deta.dev/coral', {
        method: 'POST',
        body: JSON.stringify({
            updateAuthority, symbol:symbol.toLowerCase().replace(/\s/g, "_"),mintAddress,last
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res.json()
}
export async function getNFTUpdateAuthorityAndCollectionName(nftAddress) {
    const res = await fetch(`https://api.solscan.io/account?address=${nftAddress}`)
    const data=await res.json();
    if(!data?.data?.metadata?.collection?.key){
        const res2 = await fetch(`https://api.solscan.io/nft/detail?mint=${nftAddress}`)
        const data2=await res2.json();
        return {updateAuthority:data.data.metadata.updateAuthority,collectionName:data2.data.collection,image:data.data.metadata.data.uri}
    }else{
        const res2 = await fetch(`https://api.solscan.io/account?address=${data.data.metadata.collection.key}`)
        const data2=await res2.json();
        return {updateAuthority:data.data.metadata.updateAuthority,collectionName:data2.data.metadata.data.name,image:data.data.metadata.data.uri}
    }

}
export async function getNFTCollectionId(collectionAddress) {
    const res = await fetch(`https://api.solscan.io/nft/detail?mint=${collectionAddress}`)
    const data=await res.json();

    return {collectionId:data.data.collectionId,collectionName:data.data.collection}
}

export async function getImageFromURI(uri){
    const res = await fetch(uri)
    const data=await res.json();
    return data.image
}

export async function solToUsd(sol){
    const res=await fetch(`https://api.solscan.io/market?symbol=SOL&cluster=`)
    const usd=await res.json()
    return sol*usd.data.priceUsdt;
}