# BU-CS473-Team1

Clone this repo

`git clone git@github.com:alex-cormier/BU-CS473-Team1.git` 

or

`git clone https://github.com/alex-cormier/BU-CS473-Team1.git`

You'll be prompted for you SSH key passphrase, or your Gitlab User/Pass respectively.

Install Docker

`https://www.docker.com/products/docker-desktop`

To get started with this repo, navigate to repo folder:

Ex:`cd ~/git/team1`

Then, build docker:

Ex: `docker build -t Spotlight .`

Next, run docker:

Ex: `docker run --name Spotlight -p 8080:8080 Spotlight`

Finally, you can go to `localhost:8080` in a web browser to see the content of the webserver.
