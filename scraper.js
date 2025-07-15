import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import * as Cheerio from 'cheerio';
import { Parser } from "json2csv";

const BASE_URL=process.env.BASE_URL;
const TOTAL_PAGES = Number(process.env.TOTAL_PAGES) || 1;



export async function scrapeData() {
   const  allProducts = [];
    
    for (let page = 1; page < TOTAL_PAGES; page++) {
        //Build page url (page=1 is first page page=2 is 2nd one)
        const pageUrl = page === 1? BASE_URL : `${BASE_URL}?page=${page}`;

        console.log(`Scraping page ${page} : ${pageUrl}`);

        try {
            const {data : html} = await axios.get(pageUrl)
            const $ = Cheerio.load(html);

            $(".thumbnail").each((i, element) => {
                const title  = $(element).find(".title").attr("title")?.trim() | "";
                const price = $(element).find(".price").text().trim();
                const description = $(element).find(".description").text().trim();

                allProducts.push({title, price, description});
            });


        } catch (error) {
            console.error(`Error while Scraping page ${page} :`,error.message);
        }
        
        
    }

    // Make sure data folder exists
     fs.mkdirSync("./data", { recursive: true });

    //save to JSON
    fs.writeFileSync("./data/laptops.json", JSON.stringify(allProducts, null, 2), 'utf-8');
    console.log("Data saved to .JSON file.");

    //convert to CSV and save 
    const parser = new Parser();
    const csv = parser.parse(allProducts);

    fs.writeFileSync("./data/laptops.csv", csv, 'utf-8');
    console.log("Data saved to .CSV file");
    

    
}

scrapeData();