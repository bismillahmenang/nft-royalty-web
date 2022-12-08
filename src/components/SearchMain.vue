<template>
    <v-form>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-text-field
                            v-model="NFTId"
                            clearable
                            label="Input Solana NFT Mint Address Here"
                            type="text"
                            variant="outlined"
                            :disabled="loading"
                    >


                        <template v-slot:append-inner>
                            <v-fade-transition leave-absolute>
                                <v-progress-circular
                                        v-if="loading"
                                        color="info"
                                        indeterminate
                                        size="24"
                                ></v-progress-circular>


                            </v-fade-transition>
                        </template>

                        <template v-slot:append>
                            <v-menu>
                                <template v-slot:activator="{ props }">
                                    <v-btn variant="flat"
                                           color="secondary" v-bind="props" class="mt-n2" :disabled="loading"
                                           @click="searchNFT">

                                        SEARCH
                                    </v-btn>
                                </template>


                            </v-menu>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
            <div class="text-center my-5 text-h5" v-if="isEmpty(NFTMetadata) && search && !loading">NFT not Found</div>
            <div v-else-if="!isEmpty(NFTMetadata) && !loading">
                <div class="text-center text-h3 my-5">NFT {{ NFTMetadata?.data?.name }} Royalty Detail</div>
                <v-card>
                    <template v-slot:title>
                        NFT Detail
                    </template>
                    <template v-slot:text>
                        <v-row align="center" justify="center">
                            <v-col cols="5">
                                <v-img

                                        width="500"
                                        height="300"
                                        :src="image"
                                        :lazy-src="`https://picsum.photos/10/6?image=8`"
                                        aspect-ratio="1"
                                        cover
                                        class="bg-grey-lighten-2 justify-center"
                                >
                                    <template v-slot:placeholder>
                                        <v-row
                                                class="fill-height ma-0"
                                                align="center"
                                                justify="center"
                                        >
                                            <v-progress-circular
                                                    indeterminate
                                                    color="grey-lighten-5"
                                            ></v-progress-circular>
                                        </v-row>
                                    </template>
                                </v-img>

                            </v-col>
                        </v-row>

                        <div class="font-weight-bold text-h6">Name</div>
                        <div>{{ NFTMetadata?.data?.name }}</div>
                        <div class="font-weight-bold text-h6">Mint Address</div>
                        <div><a :href="`https://solscan.io/token/${NFTId}`"
                                target="_blank">{{ NFTId }}</a></div>
                        <div class="font-weight-bold text-h6">Collection Name</div>
                        <div><a target="_blank"
                                :href="`https://solscan.io/collection/${collectionId}`">{{ collectionName }}</a>
                        </div>
                        <div class="font-weight-bold text-h6">Update Authority</div>
                        <div><a :href="`https://solscan.io/account/${updateAuthority}`"
                                target="_blank">{{ updateAuthority }}</a></div>
                    </template>
                </v-card>
                <v-card class="my-2">
                    <template v-slot:title>
                        Total royalty for NFT {{ NFTMetadata?.data?.name }} from {{ startDate }} to {{ endDate }}
                    </template>
                    <template v-slot:text>
                        <span class="text-h5 text-bold"> {{ lamportsToSol(totalRoyalty) }} SOL ≈ {{ totalRoyaltyUSD }} USD</span>
                    </template>
                </v-card>
                <v-card class="my-2">
                    <template v-slot:title>
                        List of address who pay royalty to NFT {{ NFTMetadata?.data?.name }} from {{ startDate }} to
                        {{ endDate }}
                    </template>
                    <template v-slot:text>
                        <div v-if="royaltyGiver.length===0">No one pay royalty</div>
                        <DataTable v-else :value="royaltyGiver" :paginator="true" :rows="5"
                                   paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                   :rowsPerPageOptions="[5,10]" responsiveLayout="scroll"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
                            <Column field="buyer" header="Buyer address" :sortable="true">
                                <template #body="{data}">
                                    <a :href="`https://solscan.io/account/${data.buyer}`"
                                       target="_blank">{{ truncateInTheMiddle(data.buyer, 10) }}</a>
                                </template>
                            </Column>
                            <Column field="royalty_fee" header="Royalty Fee" :sortable="true">
                                <template #body="{data}">
                                    {{ lamportsToSol(data.royalty_fee) }} SOL
                                </template>
                            </Column>
                        </DataTable>
                    </template>
                </v-card>
                <div class="text-center text-h3 my-5">NFT Collections {{ collectionName }} Royalty Detail</div>
                <v-card class="my-2">
                    <template v-slot:title>
                        All Transactions sales of collection {{ collectionName }} from {{ startDate }} to {{ endDate }}
                    </template>

                    <template v-slot:text>
                        <DataTable :value="royaltyFilter" :paginator="true" :rows="5"
                                   paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                   :rowsPerPageOptions="[5,10]" responsiveLayout="scroll"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">

                            <Column field="mint" header="Token Address" :sortable="true">
                                <template #body="{data}">
                                    <a :href="`https://solscan.io/token/${data.mint}`"
                                       target="_blank">{{ truncateInTheMiddle(data.mint, 10) }}</a>
                                </template>
                            </Column>
                            <Column field="price" header="Price" :sortable="true">
                                <template #body="{data}">
                                    {{ lamportsToSol(data.price) }} SOL
                                </template>
                            </Column>
                            <Column field="market_fee" header="Market Fee" :sortable="true">
                                <template #body="{data}">
                                    {{ lamportsToSol(data.market_fee) }} SOL
                                </template>
                            </Column>
                            <Column field="time" header="Time" :sortable="true">
                                <template #body="{data}">
                                    {{ ISOdateToReadable(data.time) }}
                                </template>
                            </Column>
                            <Column field="royalty_fee" header="Royalty Fee" :sortable="true">
                                <template #body="{data}">
                                    {{ lamportsToSol(data.royalty_fee) }} SOL
                                </template>
                            </Column>
                            <Column field="buyer" header="Buyer" :sortable="true">
                                <template #body="{data}">
                                    <a :href="`https://solscan.io/account/${data.buyer}`"
                                       target="_blank">{{ truncateInTheMiddle(data.buyer, 10) }}</a>

                                </template>
                            </Column>
                            <Column field="seller" header="Seller" :sortable="true">
                                <template #body="{data}">
                                    <a :href="`https://solscan.io/account/${data.seller}`"
                                       target="_blank">{{ truncateInTheMiddle(data.seller, 10) }}</a>
                                </template>
                            </Column>
                            <Column field="marketplace" header="Marketplace" :sortable="true"></Column>
                            <Column field="signature" header="Signature" :sortable="true">
                                <template #body="{data}">
                                    <a :href="`https://solscan.io/tx/${data.signature}`"
                                       target="_blank">{{ truncateInTheMiddle(data.signature, 10) }}</a>

                                </template>
                            </Column>

                        </DataTable>
                        source: <a target="_blank"
                                   :href="`https://api.coralcube.cc/0dec5037-f67d-4da8-9eb6-97e2a09ffe9a/inspector/getMintActivities?update_authority=${updateAuthority}&collection_symbol=${aaa}&limit=1`">Coral
                        Cube API</a>
                    </template>
                </v-card>
                <v-card class="my-2">
                    <template v-slot:title>
                        Address that paid royalty to {{ collectionName }} collections from {{ startDate }} to {{
                            endDate
                        }}
                    </template>
                    <template v-slot:text>
                        <div v-if="royaltyCollectionGiver.length===0">No one pay royalty</div>
                        <DataTable v-else :value="royaltyCollectionGiver" :paginator="true" :rows="5"
                                   paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                   :rowsPerPageOptions="[5,10]" responsiveLayout="scroll"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
                            <Column field="buyer" header="Buyer address" :sortable="true">
                                <template #body="{data}">
                                    <a :href="`https://solscan.io/account/${data.buyer}`"
                                       target="_blank">{{ truncateInTheMiddle(data.buyer, 10) }}</a>
                                </template>
                            </Column>
                            <Column field="mint" header="Mint Address" :sortable="true">
                                <template #body="{data}">
                                    <a :href="`https://solscan.io/token/${data.mint}`"
                                       target="_blank">{{ truncateInTheMiddle(data.mint, 10) }}</a>
                                </template>
                            </Column>
                            <Column field="price" header="Price" :sortable="true">
                                <template #body="{data}">
                                    {{ lamportsToSol(data.price) }} SOL
                                </template>
                            </Column>

                            <Column field="royalty_fee" header="Royalty Fee" :sortable="true">
                                <template #body="{data}">
                                    {{ lamportsToSol(data.royalty_fee) }} SOL
                                </template>
                            </Column>
                            <Column field="signature" header="Signature" :sortable="true">
                                <template #body="{data}">
                                    <a :href="`https://solscan.io/tx/${data.signature}`"
                                       target="_blank">{{ truncateInTheMiddle(data.signature, 10) }}</a>

                                </template>
                            </Column>
                            <Column field="marketplace" header="Marketplace" :sortable="true"></Column>
                        </DataTable>
                    </template>
                </v-card>
                <v-card class="my-2">
                    <template v-slot:title>
                        Total royalty paid to {{ collectionName }} collections from {{ startDate }} to {{ endDate }}
                    </template>
                    <template v-slot:text>
                        <span class="text-h5 text-bold">{{
                                lamportsToSol(totalCollectionsRoyalty)
                            }} SOL ≈ {{ totalCollectionUSD }} USD</span>
                    </template>
                </v-card>
                <v-card class="my-2">
                    <template v-slot:title>
                        Total royalty paid to {{ collectionName }} collections by date from {{ startDate }} to
                        {{ endDate }}
                    </template>
                    <template v-slot:text>
                        <Bar
                                id="my-chart-id"
                                :options="chartOptions"
                                :data="chartData"
                        />
                    </template>
                </v-card>
            <v-card class="my-2">
            <template v-slot:title>
            Address that pay most royalty to {{ collectionName }} collections from {{ startDate }} to
            {{ endDate }}
            </template>
            <template v-slot:text>
            <Doughnut :data="addressPay" :options="chartOptions"  />
            </template>
            </v-card>
            </div>
        </v-container>
    </v-form>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import {
    getNFTCollectionId,
    getNFTMetadataSolscan,
    getNFTRoyaltyFromDeta,
    getNFTUpdateAuthorityAndCollectionName,
    getImageFromURI,
    getNFTRoyalty,
    solToUsd
} from '../../services'
import {lamportsToSol, ISOdateToReadable, truncateInTheMiddle, isoToDate, sortDate} from "../../utils"
import {Bar,Doughnut} from 'vue-chartjs'
import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,ArcElement} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,ArcElement)

const search = ref(false)
const totalRoyalty = ref(0)
const loading = ref(false)
const NFTId = ref("")
const collectionName = ref("")
const collectionId = ref("")
const royaltyData = ref([])
const NFTMetadata = ref({})
const updateAuthority = ref("")
const image = ref("")
const startDate = ref("")
const endDate = ref("")
const aaa = ref("")
const royaltyFilter = ref([])
const royaltyGiver = ref([])
const royaltyCollectionGiver = ref([])
const totalCollectionsRoyalty = ref([])
const totalCollectionUSD = ref(0)
const totalRoyaltyUSD = ref(0)
const chartData = ref({
    labels: [],
    datasets: [{data: []}]
})
const addressPay= ref({
labels: [],
datasets: [{data: []}]
})
const chartOptions = {
    responsive: true
}

function isEmpty(obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
}

onMounted(async () => {
    let uri = window.location.search.substring(1)
    let params = new URLSearchParams(uri)
    if (params.get("nft_id")) {
        NFTId.value = params.get("nft_id")
        await searchNFT()
    }
})

async function searchNFT() {
    loading.value = true
    try {
        const {collectionId: CI} = await getNFTCollectionId(NFTId.value)

        collectionId.value = CI
        const {
            updateAuthority: _updateAuthority,
            collectionName: _collectionName,
            image: _image
        } = await getNFTUpdateAuthorityAndCollectionName(NFTId.value)
        updateAuthority.value = _updateAuthority
        collectionName.value = _collectionName
        aaa.value = _collectionName.toLowerCase()
            .replace(/\s/g, "_")
        image.value = await getImageFromURI(_image)
        const _NFTMetadata = await getNFTMetadataSolscan(NFTId.value)
        NFTMetadata.value = _NFTMetadata

        let _royaltyData = await getNFTRoyaltyFromDeta(_updateAuthority, _collectionName, NFTId.value)
        if (_royaltyData.items.length === 0) {
            _royaltyData = {}
            _royaltyData.items = []
            _royaltyData.items = await getNFTRoyalty(_updateAuthority, _collectionName)
        } else {
            while (_royaltyData.last) {
                let royal = await getNFTRoyaltyFromDeta(_updateAuthority, _collectionName, NFTId.value, _royaltyData.last)
                _royaltyData.items = _royaltyData.items.concat(royal.items)
                _royaltyData.last = royal.last
            }
        }
        _royaltyData.items = sortDate(_royaltyData.items)
        endDate.value = _royaltyData.items.length > 0 ? isoToDate(_royaltyData.items[_royaltyData.items.length - 1].time) : ""
        startDate.value = _royaltyData.items.length > 0 ? isoToDate(_royaltyData.items[0].time) : ""
        royaltyData.value = _royaltyData.items
        royaltyFilter.value = _royaltyData.items
        totalRoyalty.value = royaltyData.value.filter(({mint}) => mint === NFTId.value)
            .reduce((acc, obj) => {
                let newObj = acc + obj.royalty_fee
                return newObj
            }, 0)
        totalRoyaltyUSD.value = await solToUsd(lamportsToSol(totalRoyalty.value))
        royaltyGiver.value = royaltyData.value.filter(({royalty_fee, mint}) => royalty_fee > 0 && mint === NFTId.value)
        royaltyCollectionGiver.value = royaltyData.value.filter(({royalty_fee}) => royalty_fee > 0)
        totalCollectionsRoyalty.value = royaltyData.value.filter(({royalty_fee}) => royalty_fee > 0)
            .reduce((acc, obj) => {
                let newObj = acc + obj.royalty_fee
                return newObj
            }, 0)
        totalCollectionUSD.value = await solToUsd(lamportsToSol(totalCollectionsRoyalty.value))
        let royaltyByDate = royaltyData.value.reduce((acc, cur) => {
            // If the current date is not in the accumulation object, add it
            // and initialize the count for that date to 0

            const date = new Date(cur.time);
            const formattedDate = date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            if (!acc[formattedDate]) {
                acc[formattedDate] = 0;
            }

            // If the current object has the property "royalty" set to true,
            // increment the count for the current date
            if (cur.royalty_fee) {
                acc[formattedDate] += cur.royalty_fee;
            }

            return acc;
        }, []);
    const keys = Object.keys(royaltyByDate);
    const values = Object.values(royaltyByDate).map(a=>lamportsToSol(a));
    const addressThatPayTheMost=royaltyCollectionGiver.value.reduce((acc, cur) => {

    if (!acc[cur.buyer]) {
    acc[cur.buyer] = 0;
    }

    // If the current object has the property "royalty" set to true,
    // increment the count for the current date
    if (cur.royalty_fee) {
    acc[cur.buyer] += cur.royalty_fee;
    }

    return acc;
    }, [])
    const keys2=Object.keys(addressThatPayTheMost)
    const values2=Object.values(addressThatPayTheMost).map(a=>lamportsToSol(a));
    const colors = Array.from({ length: values2.length }, () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16)
    );

    addressPay.value={
    labels: [...keys2],
    datasets: [{ label: 'Royalty fee data in SOL',
    backgroundColor: [...colors],data: [...values2]}]
    };
        chartData.value = {
            labels: [...keys],
        datasets: [{ label: 'Royalty fee data in SOL',
        backgroundColor: '#f87979',data: [...values]}]
        };
        loading.value = false
        search.value = false
    } catch (e) {
        console.log(e.message)
        loading.value = false
        search.value = true
    }


}


</script>
