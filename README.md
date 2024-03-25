# WhatsApp Auto-Logger function using JavaScript
This simple auto-logger function continuously runs in the background and listens to a specific group chat on WhatsApp. `index.js` automatically removes any spam messages based on a spam keyword and saves all other messages to a `.csv` file called `messages.csv`
> `messages.csv` is not included in this repository as it contains information specific to my group chat, but will be saved in the same directory.

## Auto Push to GitHub
`git-auto-push.sh` is a shell script that automatically committs and pushes updates to the `messages.csv` file using cron.
`0 4 * * * <absolute location of .sh file>` runs the said `.sh` file everyday at 4 AM. This is specified in the file which can be accessed by this command: 	
> `crontab -e`

### Future Updates
- Cleaning Dataset
- Using ML to classify each message into categories
- Using ChatGPT APIs to automatically reply to specific users 
