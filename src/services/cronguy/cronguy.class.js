const ax = require('axios')
const md5 = require('md5')
const Bottleneck = require('bottleneck')
const fs = require('fs')
const path = require('path')
const varConfig = require('../../../var-config.json')

/* eslint-disable no-unused-vars */
exports.Cronguy = class Cronguy {
    constructor(options) {
        this.artwork = options.services.artwork
        this.history = options.services.history
        this.wordcloud = options.services.wordcloud
    }

    async create(data, params) {
        const config = fs.readFileSync(path.join(__dirname, '../../config/settings.json'), 'utf-8')
        const configJson = JSON.parse(config)
        console.log(configJson)
        const date = new Date()
        const dateString = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
        const nowConfig = configJson[dateString] ? configJson[dateString] : configJson.default
        const response = {}
        const now = new Date()
        await Promise.all([
            this.fetchArtwork(nowConfig.artworkId).then((ao) => {
                return this.artwork.create(ao, params)
            }),
            this.fetchHistory().then((ho) => {
                return this.history.create(ho, params)
            }),
            this.fetchWordcloud(nowConfig.topic).then((wo) => {
                return this.wordcloud.create(wo, params)
            })
        ]).then((values) => {
            values.push(nowConfig.artworkArtist, nowConfig.quoteContent, nowConfig.quoteSpeaker)
            response.data = values
        })
        response.time = now
        return response
    }

    async fetchArtwork(artworkId) {
        var artworkObject = {}
        const tokenEndpoint = "https://api.artsy.net/api/tokens/xapp_token"
        const artworkEndpoint = "https://api.artsy.net/api/artworks"
        var token = null

        const now = new Date()
        artworkObject.createdAt = now

        await ax.post(
            tokenEndpoint,
            {},
            {
                params: {
                    "client_id": varConfig.artsyClientId,
                    "client_secret": varConfig.artsyClientSecret
                }
            }
        ).then(
            res => {
                token = res.data.token
            }
        )
        await ax.get(
            artworkEndpoint + "/" + artworkId,
            {
                headers: {
                    "X-XAPP-Token": token
                }
            }
        ).then(
            res => {
                artworkObject.data = res.data
            }
        )
        return artworkObject
    }

    async fetchHistory() {

        var historyObject = {}

        const now = new Date()
        historyObject.createdAt = now

        const historyEndpoint = 'http://history.muffinlabs.com/date'
        await ax.get(
            historyEndpoint
        ).then(
            res => {
                res.data.data.Events.splice(1)
                res.data.data.Births.splice(1)
                res.data.data.Deaths.splice(1)
                historyObject.data = res.data
            }
        )
        return historyObject
    }

    async fetchWordcloud(topicKeyword) {

        var wordcloudObject = {}
        const langList = [
            'zh', 'yue', 'wyw', 'jp', 'kor',
            'fra', 'spa', 'th', 'ara', 'ru',
            'pt', 'de', 'it', 'el', 'nl',
            'pl', 'bul', 'est', 'dan', 'fin',
            'cs', 'rom', 'slo', 'swe', 'hu',
            'cht', 'vie'
        ]
        const wordsColl = []
        const appid = varConfig.baiduTranslateAppId
        const limiter = new Bottleneck({
            minTime: 101,
            maxConcurrent: 1
        })

        function getRandomInt(min, max) {
            min = Math.ceil(min)
            max = Math.floor(max)
            return Math.floor(Math.random() * (max - min) + min)
        }

        const now = new Date()
        wordcloudObject.createdAt = now

        await Promise.all(langList.map((lang) => {
            const randNum = getRandomInt(1, 99999)
            const sign = md5(appid + topicKeyword + randNum + varConfig.baiduTranslateKey) // according to http://api.fanyi.baidu.com/api/trans/product/apidoc#joinFile
            return limiter.schedule(() =>
                ax.get(
                    'https://fanyi-api.baidu.com/api/trans/vip/translate',
                    {
                        params: {
                            q: topicKeyword,
                            from: 'en',
                            to: lang,
                            appid: appid,
                            salt: randNum,
                            sign: sign
                        }
                    }
                )
            ).then(
                async (res) => {
                    const translatedWord = res.data.trans_result?.[0].dst
                    const wordObj = {
                        text: translatedWord,
                        value: getRandomInt(20, 51)
                    }
                    wordsColl.push(wordObj)
                }
            )
        }))
        wordcloudObject.data = wordsColl
        return wordcloudObject
    }
};
