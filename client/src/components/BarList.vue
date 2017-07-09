<template>
    <div>
        <article class="message is-warning" v-if="error">
            <div class="message-header">
                <p>Search Failed</p>
                <button class="delete" @click="() => this.error = null"></button>
            </div>
            <div class="message-body">
                {{error.error.description}}
            </div>
        </article>
        <div class="columns is-multiline">
            <div v-for="(bar, index) in bars" class="column is-one-quarter">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            {{bar.name}}
                        </p>
                    </header>
                    <div class="card-image">
                        <figure class="image">
                            <img :src="bar.image_url" alt="Image">
                        </figure>
                    </div>
                    <div class="card-content">
                        <div class="content">
                            <p class="subtitle is-4">{{bar.display_phone}}</p>
                            <p v-for="item in bar.display_address">{{item}}</p>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <p class="card-footer-item">
                            <span>{{bar.visitors.length}} total visitors</span>
                        </p>
                        <a v-if="user && !bar.visitors.includes(user.name)" class="card-footer-item" @click="visitBar(bar.yelpId, bar)">Visit {{bar.name}}</a>
                        <a v-if="user && bar.visitors.includes(user.name)" class="card-footer-item" @click="cancelVisit(bar.yelpId, bar)">Cancel</a>
                    </footer>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { bus } from '../main'
    import axios from 'axios'

    export default {
        name: 'bar-list',
        props: ['user'],
        data() {
            return {
                bars: JSON.parse(localStorage.getItem('bars')),
                error: null
            }
        },
        methods: {
            visitBar(id, item) {
                let url = "https://webtask.it.auth0.com/api/run/wt-66742f8f5098485c3dff28a55918758f-0/server/visit/" + id;
                axios.post(url, {
                    name: item.name,
                    yelpId: item.yelpId,
                    image_url: item.image_url,
                    display_address: item.display_address,
                    display_phone: item.display_phone,
                    visitors: [...item.visitors, this.user.name]
                })
                    .then((data) => {
                        var index = this.bars.findIndex(x => x.yelpId === item.yelpId)
                        this.bars[index] = data.data.bar;
                        localStorage.removeItem('bars');
                        localStorage.setItem('bars', JSON.stringify(this.bars));
                        this.bars = JSON.parse(localStorage.getItem('bars'));
                    }, (err) => {
                        console.log(err);
                    })
            },
            cancelVisit(id, item) {
                let url = "https://webtask.it.auth0.com/api/run/wt-66742f8f5098485c3dff28a55918758f-0/server/cancel/" + id;
                axios.post(url, {
                    yelpId: item.yelpId,
                    visitors: item.visitors.filter(visitor => visitor !== this.user.name)
                })
                    .then((data) => {
                        var index = this.bars.findIndex(x => x.yelpId === item.yelpId)
                        this.bars[index] = data.data.bar;
                        localStorage.removeItem('bars');
                        localStorage.setItem('bars', JSON.stringify(this.bars));
                        this.bars = JSON.parse(localStorage.getItem('bars'));
                    }, (err) => {
                        console.log(err);
                    })
            }
        },
        created() {
            bus.$on('querySent', function (query) {
                this.bars = [];
                localStorage.removeItem('bars')
                let url = "https://webtask.it.auth0.com/api/run/wt-66742f8f5098485c3dff28a55918758f-0/server/bars";
                axios.post(url, { query: query }).then((data) => {
                    if (data.data.bars && !data.data.err) {
                        localStorage.setItem('bars', JSON.stringify(data.data.bars))
                        this.bars = JSON.parse(localStorage.getItem('bars'));
                    } else {
                        this.error = JSON.parse(data.data.err);
                    }
                    bus.$emit('searchFinished');
                }, (err) => {
                    console.log(err);
                    bus.$emit('searchFinished');
                })
            }.bind(this));
        }
    }

</script>