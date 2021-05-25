const fs=require("fs");
require("chromedriver");
let wd = require("selenium-webdriver");
let browser =new wd.Builder().forBrowser('chrome').build();

let finalData=[];
let projectsAdded=0;
let totalProjects=0;

async function getIssues(url,i,j){
    let browser=new wd.Builder().forBrowser('chrome').build();
    await browser.get(url+"/issues");
        
            let issueBoxes=await browser.findElements(wd.By.css(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open"))
            finalData[i].Projects[j]["Issues"]=[];

            let currURL=await browser.getCurrentUrl();
            if(currURL= (finalData[i].Projects[j].ProjectURL+ "/issues"))
            {
             for(let k=0;k<issueBoxes.length;k++)
             {
                 if(k==8)
                 {
                     break;
                 }
                 let heading=await issueBoxes[k].getAttribute("innerText");
                 let url=await issueBoxes[k].getAttribute("href");
                 finalData[i].Projects[j].Issues.push({"Heading":heading,"URL":url});
            }
        }
        projectsAdded+=1;
        if(projectsAdded==totalProjects)
        {
          fs.writeFileSync("finalData.json",JSON.stringify(finalData));         
        }

    await browser.close();
}

async function getProjects(url,i){
    let browser =new wd.Builder().forBrowser('chrome').build();
    await browser.get(url);
        let projectBoxes=await browser.findElements(wd.By.css("a.text-bold"));
        totalProjects+=(projectBoxes.length > 2 ? 2:projectBoxes.length);
        finalData[i]["Projects"]=[];
        for(let j=0;j<projectBoxes.length;j++)
        {
            if(j==8)
            {
                break;
            }
        finalData[i].Projects.push({"ProjectURL":await projectBoxes[j].getAttribute("href")});
        }
    

        for(let j=0;j<finalData[i].Projects.length;j++){
            getIssues(finalData[i].Projects[j].ProjectURL,i,j)
       
        }
    await browser.close();
}
async function main() {
    await browser.get("https://github.com/topics");
    await browser.wait(wd.until.elementLocated(wd.By.css(".no-underline.d-flex.flex-column.flex-justify-center")));
    let topicBoxes = await browser.findElements(wd.By.css(".no-underline.d-flex.flex-column.flex-justify-center"));
  
    for (let i = 0; i < topicBoxes.length; i++) {
        let url = await topicBoxes[i].getAttribute("href");
        finalData.push({TopicUrl:url})
        
    }

    for(let i=0;i<finalData.length;i++)
    {
        getProjects(finalData[i].TopicUrl,i);
    }
    
await browser.close();

}

main();
