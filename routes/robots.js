const express = require("express");
const router = express.Router();
const cron = require('node-cron');
var fs = require('fs');
router.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  const robotsTxtContent = `
    User-agent: Googlebot
    Disallow: 
    User-agent: googlebot-image
    Disallow: 
    User-agent: googlebot-mobile
    Disallow: 
    User-agent: MSNBot
    Disallow: 
    User-agent: Slurp
    Disallow: 
    User-agent: Teoma
    Disallow: 
    User-agent: Gigabot
    Disallow: 
    User-agent: Robozilla
    Disallow: 
    User-agent: Nutch
    Disallow: 
    User-agent: ia_archiver
    Disallow: 
    User-agent: baiduspider
    Disallow: 
    User-agent: naverbot
    Disallow: 
    User-agent: yeti
    Disallow: 
    User-agent: yahoo-mmcrawler
    Disallow: 
    User-agent: psbot
    Disallow: 
    User-agent: yahoo-blogs/v3.9
    Disallow: 
    User-agent: *
    Disallow: 
    Disallow: /cgi-bin/
    
  Sitemap: https://www.elevatorplus.app/`;

  res.send(robotsTxtContent);
});

const generateXML = function () {
    var urls = ``;
    var data = new Date();
 
    var xmlText = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <!--  created with Free Online Sitemap Generator www.xml-sitemaps.com  -->
    <url>
    <loc>https://elevatorplus.app/</loc>
    <lastmod>${data}</lastmod>
    <priority>1.00</priority>
    </url>
    <url>
    <loc>https://elevatorplus.app/features</loc>
    <lastmod>${data}</lastmod>
    <priority>0.80</priority>
    </url>
    <url>
    <loc>https://elevatorplus.app/aboutus</loc>
    <lastmod>${data}</lastmod>
    <priority>0.80</priority>
    </url>
    <url>
    <loc>https://elevatorplus.app/blogs</loc>
    <lastmod>${data}</lastmod>
    <priority>0.80</priority>
    </url>
    <url>
    <loc>https://elevatorplus.app/contactus</loc>
    <lastmod>${data}</lastmod>
    <priority>0.80</priority>
    </url>
    <url>
    <loc>https://elevatorplus.app/demo-request</loc>
    <lastmod>${data}</lastmod>
    <priority>0.80</priority>
    </url>
    <url>
    <loc>https://elevatorplus.app/demo-request/</loc>
    <lastmod>${data}</lastmod>
    <priority>0.80</priority>
    </url>
    <url>
    <loc>https://elevatorplus.app/website-files/pdf/elevatorplus.pdf</loc>
    <lastmod>${data}</lastmod>
    <priority>0.80</priority>
    </url>
    <url>
    <loc>https://elevatorplus.app/faqs</loc>
    <lastmod>${data}</lastmod>
    <priority>0.80</priority>
    </url>
    <url>
    <loc>https://elevatorplus.app/policy</loc>
    <lastmod>${data}</lastmod>
    <priority>0.80</priority>
    </url>
    <url>
    <loc>https://elevatorplus.app/terms</loc>
    <lastmod>${data}</lastmod>
    <priority>0.80</priority>
    </url>
    </urlset>`;
  
    return new Promise(async (resolve, reject) => {
      fs.writeFile('sitemap.xml', xmlText, function (err) {
        if (err) {
          reject({
            title: "error"
          })
        } else {
          resolve({
            title: "success"
          });
        };
      });
    });
  }
  cron.schedule('1 1 1 * *', async () => {
    const pathToFile = "sitemap.xml"
  
    fs.unlink(pathToFile, function (err) {
      if (err) {
        console.log("Not sitemap.xml the file.")
      } else {
        console.log("Successfully deleted sitemap.xml the file.")
      }
    })

    setTimeout(() => {
      generateXML()
      console.log("Successfully created sitemap.xml the file.")
    }, 5000)
  });

module.exports = router;
