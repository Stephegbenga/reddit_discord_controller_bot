const {get_tasks, get_completed_tasks, save_completed_task, send_post} = require("./utils");
const express = require("express");
const app = express();
const port = 3000;

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
});



async function run_background_process(){
  let all_tasks = await get_tasks();
  let completed_tasks = await get_completed_tasks();

  for (const task of all_tasks) {
    let reddit_channel = task["Reddit Channel"].trim();

    const task_exist = completed_tasks.some((task) => task["reddit channel"].trim() == reddit_channel);
    let data = {
      "creator": task["Name"],
      "reddit channel": task["Reddit Channel"],
      "reddit username": task["Reddit username"],
    };

    if (!task_exist) {
      if (reddit_channel.includes("comments")) {
        let response = await send_post(reddit_channel, "Any one", "reddit");
        if (response.data.success) {
          data["status"] = "success";
        } else {
          data["status"] = "failed";
          data["reason"] = response.message;
        }

        await save_completed_task("Sheet1", data);
        return res.send({success: true, message: "received"});
      } else {
        data["status"] = "failed";

        if(reddit_channel){
          data["reason"] = "Not a valid post link";
        }else{
          data["reason"] = "link is empty";
        }
        save_completed_task("Sheet1", data);
      }
    }
  }

}


app.get("/trigger_automation", async (req, res) => {
  run_background_process()
  return res.send({success: true, message: "received"});
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

