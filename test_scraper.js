const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
  const url = `https://etrain.info/train/12301/live`;
  const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const $ = cheerio.load(response.data);
  console.log($('title').text());
}
test();
