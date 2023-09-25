const env = require('./.env')
const puppeteer = require('puppeteer')
//require("dotenv").config()
const express = require("express")
const { Telegraf } = require('telegraf')
const { google } = require('googleapis')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const credenciais = require('./spry-sequence-357517-d1ca6ab92278.json')
const { JWT } = require('google-auth-library')
const app = express()
//iniciando bot

const bot = new Telegraf(env.token)
const spreadsheetId = '1h4UBhopK6XHFsZes_4PFzdlYocj2BW9X9cXkUxE7jPI'
var continuidade = 1

async function Aee() {

    const serviceAccountAuth = new google.auth.GoogleAuth({
        keyFile: 'spry-sequence-357517-d1ca6ab92278.json',
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
        ],
    });
    const authClientObject = await serviceAccountAuth.getClient()
    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject })
    return { googleSheetsInstance }
}
//const doc = new GoogleSpreadsheet('1h4UBhopK6XHFsZes_4PFzdlYocj2BW9X9cXkUxE7jPI', serviceAccountAuth)

async function appget() {
    const { googleSheetsInstance } = await Aee()

    const response = await googleSheetsInstance.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'GERAL'
    })
    return { response }
    //console.log(response.data.values.length)
    //console.log(response.data.values[1][1])
}

async function appget2(range) {
    const { googleSheetsInstance } = await Aee()

    const response2 = await googleSheetsInstance.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        valueInputOption: "USER_ENTERED",
        range: range,
        resource: {
            values: [
                ['ehha']
            ]
          }
    })
    
    return { response2 }
    //console.log(response.data.values.length)
    //console.log(response.data.values[1][1])
}

async function safadinho(idf) {
    const { response } = await appget()
    const nsafados = await response.data.values.length
    let codes = await response.data.values
    var n = 1 
    var safade = 'Nada'
    console.log(nsafados)
    while ((n+1) < nsafados) {
        //console.log(codes[n][1])
        var  n = await n + 1
        if (idf.includes(codes[n][1])){
            //console.log(response.data.values[n][1])
            var safade = await codes[n][0]
            var n = await nsafados
        }
    }
    console.log(safade)
    return safade
}

async function infos() {
    const { response } = await appget()
    const chave1 = await response.data.values[1][3]
    const chave2 = await response.data.values[2][3]
    const chave3 = await response.data.values[3][3]
    const chave4 = await response.data.values[4][3]
    const cod1 = await response.data.values[1][4]
    const cod2 = await response.data.values[2][4]
    const cod3 = await response.data.values[3][4]
    const cod4 = await response.data.values[4][4]
    return [
        chave1,
        chave2,
        chave3,
        chave4,
        cod1,
        cod2,
        cod3,
        cod4
    ]
}

async function logar(cod) {
    const browser = await puppeteer.launch({
        args: [
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--single-process",
          "--no-zygote",
        ],
        executablePath:
            env.NODE_ENV === "production"
                ? env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
      })
    const page = await browser.newPage()
    await page.goto('https://altoqi.prod.sentinelcloud.com/ems/customerLogin.html')
  
    // - Acessa a página de login
    await page.click('[name="selectLoginType"]')
    

    // - Acessa a página de login
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
  
    // Troque os valores de process.env.UNSPLASH_EMAIL e process.env.UNSPLASH_PASS pelo seu login e senha :)
    await page.type('[name="entitlementid"]', cod)
  
    await page.keyboard.press('Enter')
  
    await page.waitForNavigation()

    await page.waitForTimeout(3000)
    
    const data1 = await page.evaluate( async () => {
        let data1 = []
        const titles = await document.querySelector('#selectedActivation > td:nth-child(4)').innerText
        data1.push(titles)
        return data1
    })
    console.log(data1[0])

    var idf = 'Livre'

    if (data1[0] === 'Activated'){
        const data2 = await page.evaluate( async () => {
            let data2 = []
            const titles = await document.querySelector('#licensingAttributes').innerText
            data2.push(titles)
            //var idf = await data2[0]
            return data2
        })
        idf = data2[0]
        console.log(idf)
    }

    await browser.close()

    return idf
}


//doc.loadInfo()

//console.log(doc.title)
//while(continuidade === 1){
try {
    app.get("/", (req, res) => {
        res.send("Render Puppeteer server is up and running!");
    })
    
    bot.help(async content => {
        const from = content.update.message.from
        content.reply('Olá, ' + (from.first_name) + '!\nPara verificar a disponibilidade de alguma chave é só escrever:\n/status + [CODIGO DA CHAVE].\nEx.:\n/status c5')
    })

    bot.on('text', async content => {
        const from = await content.update.message.from
        const comando = await content.update.message.text
        const validacao = 'status'
        if (comando.split("")[0] = '/')
            if (comando.includes(validacao)){
                try {
                    var cod = 'Errou'
                    var chave = await comando.split(" ")[1]
                    let chaves = await infos()
                    //console.log(chaves[0])
                    if (chave === chaves[0])
                    //chave === chaves[0]
                        cod = chaves[4]
                    else if (chave === chaves[1])
                        cod = chaves[5]
                    else if (chave === chaves[2])
                        cod = chaves[6]
                    else if (chave === chaves[3])
                        cod = chaves[7]
                
                }
                catch {
                    content.reply('Olá, ' + (from.first_name) + '! Não consegui acessar a planilha de códigos, fala com o suporte ae.')
                    var cod = 'Errou'
                }
                if (cod === 'Errou'){
                    content.reply('Olá, ' + (from.first_name) + '! Não reconheci o códiogo da chave, verifica se tá certo e tenta de novo, moral.')
                    
                }
                else if (cod != 'Errou'){
                    try {
                        var idf = await logar(cod)
                    }
                    catch {
                        var idf = 'ErroSite'
                    }
                    if (idf === 'ErroSite')
                        content.reply('Olá, ' + (from.first_name) + '! Não consegui acessar o site da AltoQi, fala com o suporte ae.')
                    else if (idf === 'Livre')
                        content.reply('Chave ' + (chave) + ' livre para uso. Faz logo a reserva e cuida nesse teu projeto.')
                    else{
                        try {
                            var safade = await safadinho(idf)
                        }
                        catch {
                            var safade = 'ErroPlanilha'
                        }
                        if (safade === 'ErroPlanilha')
                            content.reply('Olá, ' + (from.first_name) + '! Não consegui acessar os códigos dos membros, fala com o suporte ae.')
                        else if (safade === 'Nada')
                            content.reply('Chave ' + (chave) + ' em uso por um usuário sem cadastro.')
                        else
                            content.reply('Chave ' + (chave) + ' em uso por ' + (safade))
                    }
                }
            }
                //console.log(chave)
                
    })
    
    //bot.startPolling()
    //var range = 'GERAL!D48'

    //const response2 = appget2(range)
    //response2.data
}
catch {
    console.log('Errinho')
    //Só pra garantir
}
finally {
    bot.launch()
}
