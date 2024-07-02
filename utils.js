const axios = require("axios");
const fs = require('fs');
const app_scripts_url = require("./config")



async function get_tasks(sheet_name = "Completed", column_filters = [4, 6]) {
  try {
    let data = JSON.stringify({sheet_name, column_filters});

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: app_scripts_url.get_tasks,
      headers: {},
      data: data,
    };

    let response = await axios.request(config);
    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
}



async function get_completed_tasks(sheet_name = "Sheet1") {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${app_scripts_url.get_completed_tasks}?sheet=${sheet_name}`,
      headers: {},
    };

    let response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}

async function save_completed_task(sheet_name = "Sheet1", data) {
  try {
    let payload = JSON.stringify({
      sheet_name: sheet_name,
      data,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: app_scripts_url.save_completed_task,
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    };

    let response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}


function get_random_sender(){
  const filename = "senders.txt"
    // Read the file synchronously (you can use asynchronous methods if preferred)
    const data = fs.readFileSync(filename, 'utf8');
    
    // Split the data into an array of lines
    const senders = data.trim().split('\n');
    
    // Pick a random sender from the array
    const randomIndex = Math.floor(Math.random() * senders.length);
    const randomSender = senders[randomIndex].trim(); // trim to remove any extra whitespace
    
    return randomSender;
}



async function send_post(post_link, message, platform){
  let sender = get_random_sender()
  try {
    let payload = JSON.stringify({
      post_link: post_link,
      message: message,
      platform: platform
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: sender,
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    };

    let response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}



module.exports = {
  get_tasks,
  get_completed_tasks,
  save_completed_task,
  get_random_sender,
  send_post
};
